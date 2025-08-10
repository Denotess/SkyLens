# Hypixel Skyblock Discord Bot (Full)

Features:
- SkyCrypt & Hypixel integration for player profiles, networth, dungeons, minions, collections.
- Auction House search with filters (stars, fpb, recomb, skin, enchants, price).
- Bazaar fetch & margin calculations.
- Gemstone & farming calculators.
- Missing accessories tracker.
- Scheduled flips scanner & watches.
- SQLite persistence (better-sqlite3).
- Deployable to Render as Background Worker.

Usage:
1. Copy `.env.example` -> `.env` and fill tokens.
2. `npm install`
3. `npm start`

Deploy: Create a Background Worker on Render, connect GitHub, set env vars, start command `npm start`.
