/**
 * POST /api/decks/share
 * Body: { deck: object, name: string, imageUrl?: string }
 * Returns: { url: string, id: string }
 */

import { Redis } from '@upstash/redis';
import { randomBytes } from 'crypto';

const redis = new Redis({
  url:   process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const ALLOWED_ORIGINS = ['https://mlptcg.vercel.app'];

function nanoid12() {
  return randomBytes(9).toString('base64url').slice(0, 12);
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
    id = nanoid12();
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

  const origin = ALLOWED_ORIGINS.includes(req.headers.origin)
    ? req.headers.origin
    : 'https://mlptcg.vercel.app';
  const url = `${origin}/deck/${id}`;

  return res.status(200).json({ url, id });
}
