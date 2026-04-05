/**
 * GET /api/decks/[id]
 * Returns: { deck: object, name: string, imageUrl: string|null, createdAt: string }
 * Or 404 if not found.
 *
 * Requires KV_REST_API_URL and KV_REST_API_TOKEN env vars.
 */

import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id || !/^[a-z0-9]{6,12}$/.test(id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  const data = await kv.get(`deck:${id}`);

  if (!data) {
    return res.status(404).json({ error: 'Deck not found' });
  }

  return res.status(200).json(data);
}
