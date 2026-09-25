/**
 * POST /api/generator/run
 *
 * Proxy for Generator's POST /pipeline/run endpoint.
 * Starts an async curriculum discovery pipeline and returns a job_id.
 */
import { requireRole } from '../../../lib/auth';

export default async function handler(req, res) {
  const authUser = requireRole(req, res, ['ADMIN']);
  if (!authUser) return;

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiUrl = process.env.GENERATOR_API_URL;
  const apiKey = process.env.GENERATOR_API_KEY;

  if (!apiUrl || !apiKey) {
    return res.status(503).json({ error: 'Generator service not configured' });
  }

  try {
    const response = await fetch(`${apiUrl}/pipeline/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Generator proxy error (pipeline/run):', error);
    return res.status(502).json({ error: 'Generator service unavailable' });
  }
}
