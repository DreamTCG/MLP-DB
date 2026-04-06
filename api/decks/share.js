/**
 * POST /api/decks/share
 * Body: { deck: object, name: string, imageUrl?: string }
 * Returns: { url: string, id: string }
 */

import { Redis } from '@upstash/redis';

const redis = new Redis({
  url:   process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

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

  const safeName = String(name).slice(0, 30);

  let id;
  let attempts = 0;
  do {
    id = nanoid8();
    const existing = await redis.get(`deck:${id}`);
    if (!existing) break;
    attempts++;
  } while (attempts < 5);

  const payload = {
    deck,
    name: safeName,
    imageUrl: imageUrl || null,
    createdAt: new Date().toISOString(),
  };

  await redis.set(`deck:${id}`, JSON.stringify(payload));

  const origin = req.headers.origin || 'https://mlptcg.vercel.app';
  const url = `${origin}/deck/${id}`;

  return res.status(200).json({ url, id });
}
