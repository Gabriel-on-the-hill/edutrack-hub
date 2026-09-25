import prisma from '../../../lib/db';
import { requireRole } from '../../../lib/auth';

export default async function handler(req, res) {
  // Admin-only: curricula are managed through the admin dashboard.
  const authUser = requireRole(req, res, ['ADMIN']);
  if (!authUser) return;

  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const curriculum = await prisma.curriculum.findUnique({
        where: { id },
        include: {
          competencies: {
            orderBy: { orderIndex: 'asc' },
          },
        },
      });

      if (!curriculum) {
        return res.status(404).json({ error: 'Curriculum not found' });
      }

      return res.status(200).json({ curriculum });
    } catch (error) {
      console.error('Prisma Error:', error);
      return res.status(500).json({ error: 'Failed to fetch curriculum details' });
    }
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
