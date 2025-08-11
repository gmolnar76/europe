# EUROPA.VOTE

An experimental voting website about Europe's future. Next.js 14 (App Router), TypeScript, Tailwind CSS.

Features (planned)
- 3D maps with borders for 3 scenarios
- Realtime charts and results
- Registration + guest voting (guest shown as separate series)
- i18n: EN, RU to start (more later)

Getting Started
- Install dependencies: npm install
- Run dev server: npm run dev
- Build: npm run build; Start: npm start

Brand colors
- Midnight #0A2A6A, Gold #FFCC00, Teal #2EC5B6, Slate #0F172A, Offwhite #F5F7FB

Data sources
- Natural Earth Admin 0/1; Eurostat/GISCO; UN M49 codes.

Map
- Map engine: MapLibre GL JS (no API key). Tiles: OpenStreetMap.
- Scenarios (prototype):
  1) Sovereign states community (EU focus)
  2) United States of Europe (unified fill, dashed borders)
  3) Euroatlantic + Eurasian overlay (EA blue, EZ gold)

License
- MIT (TBD)
