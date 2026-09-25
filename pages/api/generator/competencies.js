/**
 * GET /api/generator/competencies?curriculumId=xxx
 *
 * Proxy for Generator's GET /curricula/{id}/competencies endpoint.
 */
import { requireRole } from '../../../lib/auth';

export default async function handler(req, res) {
  const authUser = requireRole(req, res, ['ADMIN']);
  if (!authUser) return;

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { curriculumId } = req.query;
  if (!curriculumId) {
    return res.status(400).json({ error: 'curriculumId query parameter required' });
  }

  const apiUrl = process.env.GENERATOR_API_URL;
  const apiKey = process.env.GENERATOR_API_KEY;

  if (!apiUrl || !apiKey) {
    return res.status(503).json({ error: 'Generator service not configured' });
  }

  try {
    const response = await fetch(`${apiUrl}/curricula/${curriculumId}/competencies`, {
      headers: { 'X-API-Key': apiKey },
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Generator proxy error (competencies):', error);
    return res.status(502).json({ error: 'Generator service unavailable' });
  }
}
