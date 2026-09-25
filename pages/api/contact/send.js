// POST /api/contact/send
// Saves contact form submissions to database and sends email notifications

import { z } from 'zod';
import prisma from '../../../lib/db';
import { sendEmail, contactFormAdminTemplate, contactFormConfirmationTemplate } from '../../../lib/email';
import { applyRateLimit } from '../../../lib/rate-limit';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'hello@edutrackhub.com';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export default async function handler(req, res) {
  // 1. Rate Limiting (3 attempts per 10 minutes)
  if (!await applyRateLimit(req, res, {
    limit: 3,
    windowMs: 10 * 60 * 1000,
    keyPrefix: 'contact'
  })) return;

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = contactSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: result.error.flatten().fieldErrors,
      });
    }

    const { name, email, phone, subject, message } = result.data;
    const subjectLine = subject || 'General Inquiry';

    // Save to database
    await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject: subjectLine,
        message,
      },
    });

    // Send notification email to admin
    sendEmail({
      to: ADMIN_EMAIL,
      subject: `[Contact Form] ${subjectLine} - from ${name}`,
      html: contactFormAdminTemplate(name, email, phone, subjectLine, message),
    }).catch(err => console.error('Failed to send admin notification:', err));

    // Send confirmation email to user
    sendEmail({
      to: email,
      subject: 'Thanks for contacting EduTrack Hub!',
      html: contactFormConfirmationTemplate(name),
    }).catch(err => console.error('Failed to send confirmation email:', err));

    return res.status(200).json({
      message: 'Thank you for your message. We\'ll get back to you soon!',
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({
      error: 'Failed to send message. Please try again.',
    });
  }
}
