// pages/api/admin/messages.js
// Admin-only: list contact-form submissions and mark them read.

import prisma from '../../../lib/db';
import { requireRole } from '../../../lib/auth';

export default async function handler(req, res) {
  const authUser = requireRole(req, res, ['ADMIN']);
  if (!authUser) return;

  if (req.method === 'GET') {
    try {
      const messages = await prisma.contactMessage.findMany({
        orderBy: { createdAt: 'desc' },
      });
      const unread = messages.filter((m) => !m.isRead).length;
      return res.status(200).json({ messages, unread });
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      return res.status(500).json({ error: 'Failed to fetch messages' });
    }
  }

  if (req.method === 'PATCH') {
    try {
      const { id, isRead } = req.body || {};
      if (!id) return res.status(400).json({ error: 'id is required' });
      const updated = await prisma.contactMessage.update({
        where: { id },
        data: { isRead: isRead !== false },
      });
      return res.status(200).json({ message: updated });
    } catch (error) {
      console.error('Failed to update message:', error);
      return res.status(500).json({ error: 'Failed to update message' });
    }
  }

  res.setHeader('Allow', ['GET', 'PATCH']);
  return res.status(405).json({ error: 'Method not allowed' });
}
