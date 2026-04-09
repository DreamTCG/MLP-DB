/**
 * GET /api/decks/[id]
 * Returns: { deck, name, imageUrl, createdAt } or 404
 */

import { Redis } from '@upstash/redis';

const redis = new Redis({
  url:   process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id || !/^[a-z0-9]{6,12}$/.test(id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  const raw = await redis.get(`deck:${id}`);

  if (!raw) {
    return res.status(404).json({ error: 'Deck not found' });
  }

  const data = typeof raw === 'string' ? JSON.parse(raw) : raw;

  return res.status(200).json(data);
}
