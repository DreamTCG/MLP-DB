# 🌈 MLP Card Game Deck Builder

A web-based deck builder for the **My Little Pony Card Game (KAYOU)** — runs entirely in the browser, no installation required.

🔗 **Live App:** [https://dreamtcg.github.io/MLP-DB/](https://dreamtcg.github.io/MLP-DB/)

---

## ✨ Features

### 🃏 Deck Building
- **Main Deck** — up to 50 cards, max 4 copies per card (base + alt art counted together)
- **Main Character** — 1 slot
- **Scene Deck** — unlimited
- **Story Deck** — 4 tiers (I–IV); click any Story card to auto-fill all 4 tiers from the same set
- Save / load deck drafts as `.json` · Export decklist as `.txt` or `.json`

### 📚 Card Library
- Browse all cards with image thumbnails
- **Search** by name, card ID, or subtype/keyword (e.g. `Unicorn`, `Twilight Sparkle`)
- **Filters** — Type, Rarity, Set (multi-select) with **✕ Clear All**
- **Alt rarity toggle** — cycle **All / No ※ / ※ Only** to show or hide alternate-art cards
- **Library sort** — toggle ascending/descending by Set → Rarity → Card number

### 🔍 Card Detail (Zoom)
- Tap 🔍 on any card to open full details
- **◀ / ▶ navigation** between cards (or swipe on mobile)
- **EN / TH toggle** — switch ability text between English and Thai
- **Font size controls** — A− / A+ / ↺ reset (persists across sessions)
- Adjust card quantity directly from the detail view

### 🃏 Main Deck Sort
- Sort button cycles through **3 modes**: ✨ Rarity → 💎 Cost ↑ (low→high) → 💎 Cost ↓ (high→low)
- Alt art cards sort at the same rank as their base version

### 📊 Analysis Panel
- Summary: total cards, average Cost, average Power (Characters only — Event/Item excluded)
- Charts: Cost Curve, Power Distribution, Rarity Breakdown, Card Type, Color Mix, Pony Race, Character Tags
- Each section is independently collapsible
- Panel can be hidden/shown via **📊 Hide / Show** in the Deck header

### 📸 Snapshot
- Exports a clean **1800×2400 px PNG** (2× render) — no UI buttons visible
- Layout: Main Deck (6 cols × 3 rows), Scene Deck (6 cols), Story Deck (4 landscape tiles)
- Works on both desktop and mobile

### 📱 Adaptive Layout
- **Desktop (≥900px):** 3-column — Library | Deck | Analysis
- **Mobile (<900px):** tab navigation — Library / Deck / Analysis

---

## 🗂 Repository Structure

```
MLP-DB/
├── index.html      # Single-file app (no build step)
├── MLP-DB.json     # Card database
├── cards/          # Card images — filename must match card ID (e.g. BP01-CR01.jpg)
└── README.md
```

---

## 🎴 Card Database Format

`MLP-DB.json` is a JSON array of card objects:

```json
[
  {
    "id": "BP01-CR01",
    "name": "Twilight Sparkle",
    "type": "Character",
    "subtype": ["Unicorn", "Twilight Sparkle"],
    "color": "Purple",
    "cost": 4,
    "power": 5,
    "rarity": "CR",
    "deck": "BP01",
    "ability": "Appear If there is any Event in your Retirement Area, choose 1 Character in Rival's Adventure Area, it gets -3 Inspiration until the end of turn.",
    "ability_th": "Appear ถ้ามีอีเวนต์อยู่ในโซนพักผ่อนของคุณ, ...",
    "story_stage": null
  }
]
```

### Card Types
| Type | Zone | Notes |
|------|------|-------|
| `Main Character` | MC slot | Exactly 1 per deck |
| `Character` | Main Deck | Max 4 copies (shared with alt art) |
| `Event` | Main Deck | Max 4 copies (shared with alt art) |
| `Item` | Main Deck | Max 4 copies (shared with alt art) |
| `Scene` | Scene Deck | Unlimited |
| `Story` | Story Deck | Requires `story_stage`: `"I"` / `"II"` / `"III"` / `"IV"` |

### Rarity Tiers
| Code | Full Name | Alt Art |
|------|-----------|---------|
| CR | Colorful Rare | ※CR |
| GR | Gold Rare | ※GR |
| SR | Silver Rare | ※SR |
| RR | Ruby Rare | ※RR |
| ER | Emerald Rare | ※ER |
| SPR | Sapphire Rare | ※SPR |
| U | Uncommon | — |
| C | Common | — |

> Alt art cards use a `※` prefix on both the `id` and `rarity` (e.g. `※BP01-CR01`, rarity `※CR`). They count toward the same 4-copy limit as the base version.

### Colors
`Purple` 🌟 · `Indigo` 💎 · `Yellow` 🦋 · `Pink` 🎈 · `Orange` 🍎 · `Blue` ⚡ · `White` ⬜

---

## 🔄 Updating the Database

1. Edit `MLP-DB.json` with new card entries
2. Add images to `cards/` — filename must match the card `id` exactly (e.g. `BP01-CR01.jpg`)
3. Commit and push — the live app updates within ~2 minutes, no changes to `index.html` needed

> The Set filter auto-detects all deck codes from the JSON, so new sets appear automatically.

---

## 🏗 Deck Rules Summary

| Zone | Limit |
|------|-------|
| Main Character | Exactly 1 |
| Main Deck | 50 cards total · max 4 copies per card (base + alt combined) |
| Scene Deck | Unlimited |
| Story Deck | 4 cards (one per Tier I–IV, same story set) |

---

## 🙏 Credits

Idea by **Kiattisak.V** · Created by **Claude Sonnet 4.6**

Card game and all artwork © [KAYOU](https://th.kayouofficial.com/) — fan-made tool, not affiliated with or endorsed by KAYOU.
