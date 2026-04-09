# 🌈 MLP Card Game Deck Builder

A fan-made web app for building decks for the **My Little Pony Card Game (KAYOU)**. Runs entirely in the browser — no installation required.

🔗 **Live App:** [mlptcg.vercel.app](https://mlptcg.vercel.app/)

---

## ✨ Features

### 🃏 Deck Builder
- **Main Deck** — up to 50 cards, max 4 copies per card (base + alt art counted together)
- **Main Character** — 1 slot
- **Scene Deck** — unlimited
- **Story Deck** — 4 tiers (I–IV); click any Story card to auto-fill all 4 tiers from the same set
- Save / load multiple named decks · Export decklist as `.txt`
- **Cloud sync** — sign in with Google or X to sync decks across devices (Supabase)
- **Share deck** — generates a shareable link; recipients can import in one click

### 📚 Card Library
- Browse all cards with image thumbnails
- **Search** by name, card ID, or keyword
- **Filters** — Type, Rarity, Set, Race (multi-select with clear all)
- **Alt rarity toggle** — All / No ※ / ※ Only
- **Sort** — ascending / descending by Set → Rarity → Number

### 🔍 Card Detail
- Tap any card to open full details
- **◀ / ▶ navigation** between cards (swipe on mobile)
- **EN / TH toggle** — switch effect text language
- **A− / A+ / ↺** — adjust effect text font size (persists across sessions)
- Adjust card quantity directly from the detail view
- **Related cards** — Alt Art · Character · Related to (cards mentioning this card in their effect)

### 📊 Analysis Panel
- Summary: total cards, average Cost, average Power
- Charts: Cost Curve, Power Distribution, Rarity, Type, Color, Race, Character Tags
- Each section independently collapsible

### 📱 Adaptive Layout
- **Desktop (≥900px):** 3-column — Library | Deck | Analysis
- **Mobile (<900px):** tab navigation with floating action bar

---

## 🗂 Repository Structure

```
MLP-DB/
├── deckbuilder/index.html   # Deck builder app
├── library/index.html       # Card library / browser
├── nav.js                   # Shared navigation & auth
├── MLP-DB.json              # Card database
├── cards/                   # Card images (filename = card ID, e.g. BP01-CR01.jpg)
└── README.md
```

---

## 🎴 Card Database Format

`MLP-DB.json` — JSON array of card objects:

```json
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
  "ability": "Appear If there is any Event in your Retirement Area...",
  "ability_th": "Appear ถ้ามีอีเวนต์อยู่ในโซนพักผ่อน...",
  "story_stage": null
}
```

Alt art cards use a `※` prefix on both `id` and `rarity` (e.g. `※BP01-CR01`, rarity `※CR`). They share the 4-copy limit with the base version.

### Rarity Codes
`CR` · `GR` · `SR` · `RR` · `ER` · `SPR` · `U` · `C`  
Alt art prefix: `※CR` · `※GR` · `※SR` · `※RR` · `※ER` · `※SPR`

---

## 🔄 Adding Cards

1. Add entries to `MLP-DB.json`
2. Drop images in `cards/` — filename must match card `id` exactly (`BP01-CR01.jpg`)
3. Push — the live app updates automatically. New sets appear in filters without any code changes.

---

## 🏗 Deck Rules

| Zone | Limit |
|------|-------|
| Main Character | Exactly 1 |
| Main Deck | 50 cards · max 4 copies per card (base + alt combined) |
| Scene Deck | Unlimited |
| Story Deck | 4 cards (Tier I–IV, same story set) |

---

## 🙏 Credits

Idea by **Kiattisak.V** · Built with **Claude Sonnet 4.6**

Card game and all artwork © [KAYOU](https://th.kayouofficial.com/) — fan-made tool, not affiliated with or endorsed by KAYOU.
