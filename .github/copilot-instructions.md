<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Copilot workspace guidance

- Project: EUROPA.VOTE — Next.js 14 (App Router) + TypeScript + Tailwind CSS.
- Design tokens: colors
  - midnight: #0A2A6A (primary)
  - gold: #FFCC00 (accent)
  - teal: #2EC5B6 (guest votes accent)
  - slate: #0F172A (base text/dark bg)
  - offwhite: #F5F7FB (surface)
- i18n: default locales en, ru; future: de, fr, es, it, pl, hu. ICU messages.
- Voting model: 3 choices. Guests allowed; mark Vote.source = 'guest' | 'registered'. Charts separate series by source.
- Map scenarios:
  1) EU as sovereign states community — strong borders, per-country shades.
  2) United States of Europe — unified fill; borders faint and dashed.
  3) Euroatlantic + Eurasian — two overlays; EA blue, EZ gold; intersections blended.
- Data sources for boundaries: Natural Earth, Eurostat/GISCO; pre-simplify with mapshaper.
- Components folders: components/ui/* and components/charts/*; map layers under components/map/*.
- Accessibility: keyboard focus, ARIA, color contrast.
- Lint/format: ESLint + Prettier, keep strict TS.
