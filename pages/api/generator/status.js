/**
 * GET /api/generator/status?jobId=xxx
 *
 * Proxy for Generator's GET /pipeline/status/{job_id} endpoint.
 * Polls pipeline job status.
 */
import { requireRole } from '../../../lib/auth';

export default async function handler(req, res) {
  const authUser = requireRole(req, res, ['ADMIN']);
  if (!authUser) return;

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { jobId } = req.query;
  if (!jobId) {
    return res.status(400).json({ error: 'jobId query parameter required' });
  }

  const apiUrl = process.env.GENERATOR_API_URL;
  const apiKey = process.env.GENERATOR_API_KEY;

  if (!apiUrl || !apiKey) {
    return res.status(503).json({ error: 'Generator service not configured' });
  }

  try {
    const response = await fetch(`${apiUrl}/pipeline/status/${jobId}`, {
      headers: { 'X-API-Key': apiKey },
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Generator proxy error (pipeline/status):', error);
    return res.status(502).json({ error: 'Generator service unavailable' });
  }
}
