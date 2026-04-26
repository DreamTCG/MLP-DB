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

  const rawFilename = req.query.filename || `deck_${Date.now()}.jpg`;
  const filename = rawFilename.replace(/[^a-zA-Z0-9_.-]/g, '_').slice(0, 80);

  const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
  const chunks = [];
  let totalSize = 0;
  try {
    await new Promise((resolve, reject) => {
      req.on('data', chunk => { totalSize += chunk.length; chunks.push(chunk); });
      req.on('end', resolve);
      req.on('error', reject);
    });
  } catch (e) {
    return res.status(500).json({ error: 'Upload stream error' });
  }
  if (totalSize > MAX_BYTES) return res.status(413).json({ error: 'File too large (max 5 MB)' });
  const body = Buffer.concat(chunks);

  const blob = await put(`snapshots/${filename}`, body, {
    access: 'public',
    contentType: 'image/jpeg',
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  return res.status(200).json({ url: blob.url });
}
