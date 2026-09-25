// pages/api/admin/leads.js
// Admin-only: list captured marketing leads.

import prisma from '../../../lib/db';
import { requireRole } from '../../../lib/auth';

export default async function handler(req, res) {
  const authUser = requireRole(req, res, ['ADMIN']);
  if (!authUser) return;

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return res.status(200).json({ leads, total: leads.length });
  } catch (error) {
    console.error('Failed to fetch leads:', error);
    return res.status(500).json({ error: 'Failed to fetch leads' });
  }
}
