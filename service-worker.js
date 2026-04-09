/* ============================================================
   DreamTCG Service Worker — cache-first for app shell
   Cache version: bump CACHE_NAME to force full refresh on deploy
   ============================================================ */

const CACHE_NAME = 'dreamtcg-v2';

// App shell files to pre-cache on install
const APP_SHELL = [
  '/',
  '/nav.js',
  '/manifest.json',
  '/deckbuilder/',
  '/deckbuilder/index.html',
  '/library/',
  '/library/index.html',
];

// Never cache these — always network
const NEVER_CACHE = [
  '/MLP-DB.json',
  '/cards/',
  '/_vercel/',
  '/api/',
];

function shouldSkip(url) {
  const path = new URL(url).pathname;
  return NEVER_CACHE.some(p => path.startsWith(p));
}

// ── Offline fallback HTML ──────────────────────────────────
const OFFLINE_HTML = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DreamTCG — ออฟไลน์</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #0f0920; color: #e8e0ff;
      font-family: 'Nunito', sans-serif;
      display: flex; align-items: center; justify-content: center;
      min-height: 100vh; text-align: center; padding: 24px;
    }
    .wrap { max-width: 320px; }
    .icon { font-size: 3.5rem; margin-bottom: 16px; }
    h1 { font-size: 1.3rem; font-weight: 800; color: #a78bfa; margin-bottom: 10px; }
    p  { font-size: 0.88rem; color: #9580c8; line-height: 1.7; margin-bottom: 24px; }
    button {
      background: linear-gradient(135deg, #7c3aed, #ec4899);
      border: none; border-radius: 12px; color: #fff;
      padding: 11px 28px; font-size: 0.9rem; font-weight: 800;
      cursor: pointer; font-family: inherit;
    }
    button:active { opacity: 0.85; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="icon">🦄</div>
    <h1>ไม่มีการเชื่อมต่ออินเทอร์เน็ต</h1>
    <p>กรุณาเชื่อมต่ออินเทอร์เน็ตก่อนใช้งาน DreamTCG</p>
    <button onclick="window.location.reload()">🔄 ลองใหม่</button>
  </div>
</body>
</html>`;

// ── Install: pre-cache app shell ───────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: remove old caches ────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: network-first for HTML navigation, cache-first for assets ─
self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = event.request.url;

  // Skip non-http(s) requests (chrome-extension://, etc.)
  if (!url.startsWith('http')) return;

  // Never cache: cards, DB JSON, API, Vercel internals
  if (shouldSkip(url)) return;

  // HTML navigation: network-first so deploys are visible immediately
  // Falls back to cache (offline), then shows offline page
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
          }
          return response;
        })
        .catch(() =>
          caches.match(event.request).then(cached =>
            cached || new Response(OFFLINE_HTML, {
              headers: { 'Content-Type': 'text/html; charset=utf-8' }
            })
          )
        )
    );
    return;
  }

  // All other assets (fonts, images, JS, CSS): cache-first for performance
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request)
        .then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
          }
          return response;
        })
        .catch(() => new Response('', { status: 503 }));
    })
  );
});
