import prisma from '../../../lib/db';
import { requireRole } from '../../../lib/auth';

export default async function handler(req, res) {
  // Admin-only: curricula are managed through the admin dashboard.
  const authUser = requireRole(req, res, ['ADMIN']);
  if (!authUser) return;

  if (req.method === 'GET') {
    try {
      const curricula = await prisma.curriculum.findMany({
        orderBy: { updatedAt: 'desc' },
      });
      return res.status(200).json({ curricula });
    } catch (error) {
      console.error('Prisma Error:', error);
      return res.status(500).json({ error: 'Failed to fetch curricula' });
    }
  }

  if (req.method === 'POST') {
    // This will be used by the Generator Bridge
    try {
      const { country, countryCode, grade, subject, competencies } = req.body;
      const curriculum = await prisma.curriculum.create({
        data: {
          country,
          countryCode,
          grade,
          subject,
          status: 'active',
          competencies: {
            create: competencies.map((comp, index) => ({
              title: comp.title,
              description: comp.description,
              orderIndex: index,
            })),
          },
        },
      });
      return res.status(201).json({ curriculum });
    } catch (error) {
      console.error('Prisma Error:', error);
      return res.status(500).json({ error: 'Failed to create curriculum' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
