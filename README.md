# 🌈 MLP Card Game Deck Builder

A web-based deck builder for the **My Little Pony Card Game (KAYOU)** — playable directly in the browser, no installation required.

🔗 **Live App:** [https://dreamtcg.github.io/MLP-DB/](https://dreamtcg.github.io/MLP-DB/)

---

## ✨ Features

### 🃏 Deck Building
- Add cards to **Main Deck** (max 50 cards, 4 copies per card)
- Set a **Main Character** card (1 slot)
- Build a **Scene Deck** (unlimited)
- Complete a **Story Deck** (4 Tiers: I–IV)
- **Color Lock** — enforces single main color per deck; White cards are always allowed alongside any color
- Save and load deck drafts as `.json` files
- Export decklist as text or JSON

### 📚 Card Library
- Browse all cards with image thumbnails
- **Multi-select filters**: Type, Color, Rarity, Set
- **Sort order**: Set → Rarity → Card number (ascending/descending toggle)
- Search by card name or ID

### 🔍 Card Detail
- Tap the 🔍 icon on any card to view full details
- Navigate to previous/next card with ◀ / ▶ buttons (or swipe left/right on mobile)
- Adjust card quantity directly from the detail view

### 📊 Analysis Panel
- Deck summary: card count, average Cost, average Power
- Charts: Cost Curve, Power Distribution, Rarity Breakdown, Card Type, Color Mix, Pony Race, Character Tags
- Each section is collapsible independently

### 📸 Snapshot
- Capture the full decklist as a PNG image (works on both desktop and mobile)

### 📱 Adaptive Layout
- **Desktop (≥900px):** 3-column layout — Library | Deck | Analysis side by side
- **Mobile (<900px):** Tab-based navigation — Library / Deck / Analysis

---

## 🗂 Repository Structure

```
MLP-DB/
├── index.html          # Main app (single-file)
├── MLP-DB.json         # Card database
├── cards/              # Card images (filename = card ID, e.g. SD01-C01.jpg)
│   ├── SD01-C01.jpg
│   ├── SD01-C02.jpg
│   └── ...
└── README.md
```

---

## 🎴 Card Database Format

`MLP-DB.json` is a JSON array of card objects:

```json
[
  {
    "id": "SD01-C01",
    "name": "Twilight Sparkle",
    "type": "Character",
    "subtype": ["Unicorn", "Twilight Sparkle"],
    "color": "Purple",
    "cost": 1,
    "power": 2,
    "rarity": "C",
    "deck": "SD01",
    "ability": "...",
    "story_stage": null
  }
]
```

### Card Types
| Type | Description |
|------|-------------|
| `Main Character` | Goes in the MC slot (1 per deck) |
| `Character` | Main deck card |
| `Event` | Main deck card |
| `Item` | Main deck card |
| `Scene` | Scene deck |
| `Story` | Story deck — requires `story_stage`: `"I"` / `"II"` / `"III"` / `"IV"` |

### Colors
| Color | Icon |
|-------|------|
| Purple | 🌟 |
| Indigo | 💎 |
| Yellow | 🦋 |
| Pink | 🎈 |
| Orange | 🍎 |
| Blue | ⚡ |
| White | ⬜ (neutral — allowed in any deck) |

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
| *CR | Shining Colorful Rare |
| *GR | Shining Gold Rare |
| *SR | Shining Silver Rare |
| *RR | Shining Ruby Rare |
| *ER | Shining Emerald Rare |
| *SPR | Shining Sapphire Rare |

> Cards with a `*` prefix (e.g. `*BP01-GR01`) are special alternate-art variants.

---

## 🔄 Updating the Database

1. Edit `MLP-DB.json` with new card data
2. Add new card images to the `cards/` folder — filename must match the card `id` exactly (e.g. `SD01-C01.jpg`)
3. Commit and push — changes go live at the URL within ~2 minutes

---

## 🏗 Deck Rules Summary

| Zone | Limit |
|------|-------|
| Main Character | Exactly 1 |
| Main Deck | 50 cards total, max 4 copies per card |
| Scene Deck | Unlimited |
| Story Deck | 4 cards (one per Tier I–IV) |
| Color | 1 main color + White allowed |

---

## 🙏 Credits

Idea by **Kiattisak.V** · Created by **Claude Sonnet 4.6**

Card game and all card artwork © [KAYOU](https://th.kayouofficial.com/) — this tool is a fan-made deck builder and is not affiliated with or endorsed by KAYOU.
