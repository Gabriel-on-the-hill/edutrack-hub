/**
 * POST /api/generator/save
 *
 * Saves AI-generated content as a Resource in the Hub's database.
 */
import prisma from '../../../lib/db';
import { requireRole } from '../../../lib/auth';

export default async function handler(req, res) {
  const authUser = requireRole(req, res, ['ADMIN']);
  if (!authUser) return;

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { title, description, content, type, subject } = req.body;

  if (!title || !content || !type || !subject) {
    return res.status(400).json({ error: 'title, content, type, and subject are required' });
  }

  try {
    const resource = await prisma.resource.create({
      data: {
        title,
        description: description || null,
        content,
        type,
        subject,
        // url is now optional — AI-generated content lives in the content field
        isPublished: false,  // Admin must publish manually
      },
    });

    return res.status(201).json({ resource });
  } catch (error) {
    console.error('Failed to save resource:', error);
    return res.status(500).json({ error: 'Failed to save resource' });
  }
}
