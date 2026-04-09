/**
 * POST /api/blob-upload?filename=<name>
 * Body: raw image binary (image/jpeg)
 * Returns: { url: string }
 */

import { put } from '@vercel/blob';

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const filename = req.query.filename || `deck_${Date.now()}.jpg`;

  const chunks = [];
  await new Promise((resolve, reject) => {
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', resolve);
    req.on('error', reject);
  });
  const body = Buffer.concat(chunks);

  const blob = await put(`snapshots/${filename}`, body, {
    access: 'public',
    contentType: 'image/jpeg',
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  return res.status(200).json({ url: blob.url });
}
