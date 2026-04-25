# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DreamTCG (live at [mlptcg.vercel.app](https://mlptcg.vercel.app/)) is a fan-made browser app for the My Little Pony Card Game (KAYOU). It is a **static site with Vercel serverless API routes** — no build step, no framework, no bundler. All HTML pages load plain `.js` files and use vanilla DOM APIs.

## Commands

```bash
# Convert newly added JPG card images to WebP (80% quality, deletes originals)
npm run convert-webp
```

There are no build, lint, or test commands — the site is plain HTML/CSS/JS deployed directly to Vercel.

## Architecture

### Page structure
Each app section is an `index.html` in its own directory — `/`, `/library/`, `/deckbuilder/`, `/wishlist/`, `/battlesim/`. Each page is self-contained with inline `<style>` and `<script>` blocks, augmented by a few shared `.js` files loaded via `<script src>`.

### Shared globals loaded on every page
Pages load scripts in this order:
1. `/i18n/translations.js` — sets `window.MLP_I18N` (the translation dictionary)
2. `/nav.js` — injects the navbar, initialises Supabase auth, exposes `window.i18n`, `window._supabase`, and auth helpers (`_openLoginModal`, `_loginWith`, `_logOut`, `_setProxyMode`, etc.)

Pages must **not** call `window._supabase` directly at parse time; auth state arrives asynchronously through `window._onAuthReady(session)` and `window._onFirstLogin()` callbacks that pages define before nav.js fires them.

### Card database — `MLP-DB.json`
Single JSON array of all cards. Each card object has: `id`, `name`, `type`, `subtype[]`, `color`, `cost`, `power`, `rarity`, `deck` (set code), `ability` (EN), `ability_th` (TH), `story_stage`.

- **Alt art** cards: `id` and `rarity` are prefixed with `※` (e.g. `※BP01-CR01`, rarity `※CR`). Base and alt art share the 4-copy limit in the main deck.
- Card images live in `/cards/` as `.webp`, filename matches `id` exactly (`BP01-CR01.webp`).
- **Adding a new set**: add cards to `MLP-DB.json`, drop images in `/cards/`. No code changes required — filters and set listings are derived dynamically. If the set is officially released, add its code to `sets_config.json → officialSets`; otherwise cards appear automatically as "proxy" cards.

### Deckbuilder (`/deckbuilder/`)
State is held in a module-global `state` object (`{ mc, main[], scene[], story[4] }`) and exposed as `window.state` so the extracted `.js` files can read it. The file split is:

| File | Responsibility |
|---|---|
| `index.html` (inline script) | State, core deck mutations, all event handlers |
| `db.js` | IndexedDB persistence (`dreamtcg` DB, `decks` store) |
| `cloud.js` | Supabase cloud sync API (`cloudGetAllDecks`, `cloudSaveDeck`, etc.) |
| `ui.js` | Analysis panel rendering (charts, Vibe Read archetypes) |
| `modals.js` | All modal/overlay logic (Export, Share, Import, zoom) |

All functions in `db.js`, `cloud.js`, `ui.js`, and `modals.js` are attached to `window` via `Object.assign(window, {...})` or direct assignment so the inline script in `index.html` can call them.

### Deck sharing (serverless API)
`POST /api/decks/share` stores a deck in Upstash Redis (key `deck:<8-char-id>`, no TTL). `GET /api/decks/[id]` retrieves it. The Vercel rewrite `/deck/:id → /deckbuilder/?share=:id` is defined in `vercel.json`. Deck snapshots (images) are stored via `POST /api/blob-upload` to Vercel Blob.

### Cloud sync (Supabase)
Supabase table `decks` (see `supabase/migrations/001_decks.sql`): RLS ensures users only access their own rows; a trigger enforces a 10-deck limit per user. Cloud sync is orchestrated in the deckbuilder's inline script; `cloud.js` provides only the pure API calls.

### i18n
`i18n/translations.js` exports `window.MLP_I18N = { en: {...}, th: {...} }`. The `nav.js` exposes `window.i18n.t(key)` and `window.i18n.setLang(lang)`. Pages listen for the `mlp-lang-change` CustomEvent to re-render dynamic strings.

### Dark mode
Toggled via `<html class="dark">`. CSS custom properties (`--bg`, `--text`, `--accent`, etc.) are defined in nav.js under `:root` and `html.dark` and apply globally. The preference is saved to `localStorage` key `mlp-theme`.

### Proxy mode
Cards from sets **not** listed in `sets_config.json → officialSets` are treated as proxy cards. The "Proxy Mode" toggle in the nav (saved to `localStorage` key `mlp-proxy-mode`) gates whether proxy cards can be exported. Pages listen for the `mlp-proxy-change` CustomEvent.

### Battle Simulator (`/battlesim/`)
Currently disabled in the nav (commented out). The AI is split across three files: `ai-config.js` (weights/constants), `ai-eval.js` (card/slot scoring), `ai-core.js` (orchestration — depends on globals `G`, `effInsp`, `log`, `renderScene` defined in `battlesim/index.html`).

### Service Worker (`service-worker.js`)
Cache-first for the app shell (HTML + nav.js). API routes (`/api/`) and Vercel internals (`/_vercel/`) are never cached. Bump `CACHE_NAME` (currently `dreamtcg-v3`) to force a full refresh on deploy.

## Key conventions

- **No build step.** Edit files directly; Vercel deploys on push.
- **Window globals as the module system.** Functions are shared between files by assigning to `window`. Avoid ES module `import`/`export` — the pages don't use a bundler.
- **Deck rules (enforced in UI and cloud):** Main Deck = exactly 50 cards, max 4 copies per card (base + alt art combined); Main Character = exactly 1; Story Deck = 4 tiers (I–IV) from the same story set; Scene Deck = unlimited.
- **Card ID format:** `<SetCode>-<RarityCode><Number>` (e.g. `BP01-CR01`). Alt art prefixed with `※`.
- **Rarity codes:** `C`, `U`, `SR`, `RR`, `ER`, `SPR`, `CR`, `GR`. Alt art prefixes: `※CR`, `※GR`, `※SR`, `※RR`, `※ER`, `※SPR`.
- **Environment variables (Vercel):** `KV_REST_API_URL` + `KV_REST_API_TOKEN` (Upstash Redis for deck sharing), `BLOB_READ_WRITE_TOKEN` (Vercel Blob for snapshots). Supabase credentials are hardcoded public anon keys in `nav.js` (safe to expose).
- **Cache headers** are defined in `vercel.json`. Card images are immutable (`max-age=31536000`); HTML pages have `s-maxage=600`.
