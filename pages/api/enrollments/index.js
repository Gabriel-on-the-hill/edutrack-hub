// POST /api/enrollments - Enroll in a class
// GET /api/enrollments - Get user's enrollments

import prisma from '../../../lib/db';
import { requireAuth } from '../../../lib/auth';
import { z } from 'zod';
import { sendEmail, enrollmentConfirmationTemplate } from '../../../lib/email';

const enrollSchema = z.object({
  classId: z.string().min(1, 'Class ID is required'),
});

export default async function handler(req, res) {
  // Require authentication for all methods
  const auth = requireAuth(req, res);
  if (!auth) return;

  const userId = auth.user.userId;

  // GET - Get user's enrollments
  if (req.method === 'GET') {
    try {
      const enrollments = await prisma.enrollment.findMany({
        where: { userId },
        include: {
          class: {
            select: {
              id: true,
              title: true,
              subject: true,
              level: true,
              scheduledTime: true,
              duration: true,
              meetUrl: true,
              notesUrl: true,
              recordingUrl: true,
              status: true,
            },
          },
        },
        orderBy: { enrolledAt: 'desc' },
      });

      return res.status(200).json({
        enrollments: enrollments.map((e) => ({
          id: e.id,
          status: e.status,
          enrolledAt: e.enrolledAt,
          class: e.class,
        })),
      });

    } catch (error) {
      console.error('Get enrollments error:', error);
      return res.status(500).json({ error: 'Failed to fetch enrollments' });
    }
  }

  // POST - Enroll in a class
  if (req.method === 'POST') {
    try {
      const result = enrollSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          error: 'Validation failed',
          details: result.error.flatten().fieldErrors,
        });
      }

      const { classId } = result.data;

      // Check if class exists
      const classData = await prisma.class.findUnique({
        where: { id: classId },
        include: {
          _count: { select: { enrollments: true } },
        },
      });

      if (!classData) {
        return res.status(404).json({ error: 'Class not found' });
      }

      // Check if class is full
      if (classData._count.enrollments >= classData.maxStudents) {
        return res.status(400).json({ error: 'This class is full' });
      }

      // Check if payment is required (Phase 2 Stripe)
      if (classData.price > 0) {
        return res.status(402).json({
          error: 'Payment required',
          requiresPayment: true,
          className: classData.title,
          price: classData.price,
          currency: classData.currency
        });
      }

      // Check if already enrolled
      const existing = await prisma.enrollment.findUnique({
        where: {
          userId_classId: { userId, classId },
        },
      });

      if (existing) {
        return res.status(400).json({ error: 'You are already enrolled in this class' });
      }

      // Get user info for email
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true },
      });

      // Check if class is free or paid
      const isFree = classData.price === 0;

      // Create enrollment
      const enrollment = await prisma.enrollment.create({
        data: {
          userId,
          classId,
          status: isFree ? 'CONFIRMED' : 'PENDING', // Free = confirmed, Paid = pending payment
        },
        include: {
          class: {
            select: {
              id: true,
              title: true,
              subject: true,
              scheduledTime: true,
            },
          },
        },
      });

      // Send enrollment confirmation email for free classes
      if (isFree && user) {
        const classDate = new Date(classData.scheduledTime).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
        const classTime = new Date(classData.scheduledTime).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });

        sendEmail({
          to: user.email,
          subject: `You're enrolled in ${classData.title}! ✅`,
          html: enrollmentConfirmationTemplate(user.name, classData.title, classDate, classTime),
        }).catch(err => console.error('Failed to send enrollment email:', err));
      }

      // If paid class, return info for payment
      if (!isFree) {
        return res.status(201).json({
          message: 'Enrollment created. Please complete payment.',
          enrollment: {
            id: enrollment.id,
            status: enrollment.status,
            class: enrollment.class,
          },
          requiresPayment: true,
          amount: classData.price,
          currency: classData.currency,
        });
      }

      return res.status(201).json({
        message: 'Successfully enrolled in class!',
        enrollment: {
          id: enrollment.id,
          status: enrollment.status,
          class: enrollment.class,
        },
        requiresPayment: false,
      });

    } catch (error) {
      console.error('Enrollment error:', error);
      return res.status(500).json({ error: 'Failed to enroll in class' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: 'Method not allowed' });
}
