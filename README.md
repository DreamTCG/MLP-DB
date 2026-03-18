# 🌈 MLP Card Game Deck Builder

A web-based deck builder for the **My Little Pony Card Game (KAYOU)** — playable directly in the browser, no installation required.

🔗 **Live App:** [https://dreamtcg.github.io/MLP-DB/](https://dreamtcg.github.io/MLP-DB/)

---

## ✨ Features

### 🃏 Deck Building
- Add cards to **Main Deck** (max 50 cards, 4 copies per card)
- Set a **Main Character** card (1 slot)
- Build a **Scene Deck** (unlimited)
- Complete a **Story Deck** (4 Tiers: I–IV) — click any Story card to auto-fill all 4 tiers from the same set
- Save and load deck drafts as `.json` files
- Export decklist as text or JSON

### 📚 Card Library
- Browse all cards with image thumbnails
- **Search** by card name, card ID, or subtype/keyword (e.g. `Unicorn`, `Pet`, `Twilight Sparkle`)
- **Filters**: Type, Rarity, Set — all multi-select with a **✕ Clear All** button
- **Alt Rarity Toggle** — cycle between **All** / **No ※** / **※ Only** to show or hide alternate-art cards
- **Set filter auto-detects** deck codes from the database — updates automatically when the DB is updated
- **Sort order**: Set → Rarity → Card number (ascending/descending toggle)

### 🔍 Card Detail
- Tap the 🔍 icon on any card to view full details
- Navigate to previous/next card with ◀ / ▶ buttons (or swipe left/right on mobile)
- Adjust card quantity directly from the detail view
- Story cards display in landscape aspect ratio

### 📊 Analysis Panel (Desktop)
- Deck summary: card count, average Cost, average Power
- Charts: Cost Curve, Power Distribution, Rarity Breakdown, Card Type, Color Mix, Pony Race, Character Tags
- Each section is collapsible independently
- Panel can be hidden/shown via the **📊 Hide / Show** button in the Deck header

### 📸 Snapshot
- Capture the full decklist as a PNG image (works on both desktop and mobile)

### 📱 Adaptive Layout
- **Desktop (≥900px):** 3-column layout — Library | Deck | Analysis side by side
- **Mobile (<900px):** Tab-based navigation — Library / Deck / Analysis

---

## 🗂 Repository Structure

```
MLP-DB/
├── index.html          # Main app (single-file, no dependencies to install)
├── MLP-DB.json         # Card database
├── cards/              # Card images (filename = card ID, e.g. BP01-CR01.jpg)
│   ├── BP01-CR01.jpg
│   ├── SD01-C01.jpg
│   └── ...
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
    "story_stage": null
  }
]
```

### Card Types
| Type | Zone | Notes |
|------|------|-------|
| `Main Character` | MC slot | Exactly 1 per deck |
| `Character` | Main Deck | Max 4 copies |
| `Event` | Main Deck | Max 4 copies |
| `Item` | Main Deck | Max 4 copies |
| `Scene` | Scene Deck | Unlimited |
| `Story` | Story Deck | Requires `story_stage`: `"I"` / `"II"` / `"III"` / `"IV"` |

### Colors
| Color | Icon |
|-------|------|
| Purple | 🌟 |
| Indigo | 💎 |
| Yellow | 🦋 |
| Pink | 🎈 |
| Orange | 🍎 |
| Blue | ⚡ |
| White | ⬜ |

### Rarity Tiers (sort order)
| Code | Full Name |
|------|-----------|
| CR | Colorful Rare |
| GR | Gold Rare |
| SR | Silver Rare |
| U | Uncommon |
| C | Common |
| RR | Ruby Rare |
| ER | Emerald Rare |
| SPR | Sapphire Rare |
| ※CR | Shining Colorful Rare |
| ※GR | Shining Gold Rare |
| ※SR | Shining Silver Rare |
| ※RR | Shining Ruby Rare |
| ※ER | Shining Emerald Rare |
| ※SPR | Shining Sapphire Rare |

> Cards with a `※` prefix are special alternate-art variants (e.g. `※BP01-GR01`). They share the same name but have different artwork.

---

## 🔄 Updating the Database

1. Edit `MLP-DB.json` with new card data
2. Add new card images to the `cards/` folder — filename must match the card `id` exactly (e.g. `BP01-CR01.jpg`)
3. Commit and push — the app updates live within ~2 minutes, no changes to `index.html` needed

> The Set filter auto-detects all deck codes from the JSON, so new sets appear in the filter automatically.

---

## 🏗 Deck Rules Summary

| Zone | Limit |
|------|-------|
| Main Character | Exactly 1 |
| Main Deck | 50 cards total, max 4 copies per card |
| Scene Deck | Unlimited |
| Story Deck | 4 cards (one per Tier I–IV) |

---

## 🙏 Credits

Idea by **Kiattisak.V** · Created by **Claude Sonnet 4.6**

Card game and all card artwork © [KAYOU](https://th.kayouofficial.com/) — this tool is a fan-made deck builder and is not affiliated with or endorsed by KAYOU.
