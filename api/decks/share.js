/**
 * POST /api/decks/share
 * Body: { deck: object, name: string, imageUrl?: string }
 * Returns: { url: string, id: string }
 *
 * Stores deck JSON in Vercel KV under key `deck:<id>`.
 * Requires KV_REST_API_URL and KV_REST_API_TOKEN env vars
 * (set in Vercel dashboard → Storage → KV → Connect).
 */

import { kv } from '@vercel/kv';

// Generate a random 8-character alphanumeric ID
function nanoid8() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < 8; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { deck, name, imageUrl } = req.body || {};

  if (!deck || !name) {
    return res.status(400).json({ error: 'deck and name are required' });
  }

  // Sanitise name
  const safeName = String(name).slice(0, 30);

  let id;
  let attempts = 0;

  // Retry on the off-chance of a collision (extremely unlikely)
  do {
    id = nanoid8();
    const existing = await kv.get(`deck:${id}`);
    if (!existing) break;
    attempts++;
  } while (attempts < 5);

  const payload = {
    deck,
    name: safeName,
    imageUrl: imageUrl || null,
    createdAt: new Date().toISOString(),
  };

  await kv.set(`deck:${id}`, payload);

  const origin = req.headers.origin || 'https://mlptcg.vercel.app';
  const url = `${origin}/deck/${id}`;

  return res.status(200).json({ url, id });
}
