# CLAUDE.md — PitchIQ

## Project Overview
**Name:** PitchIQ
**Description:** Interactive web platform that teaches football (soccer) formations, positions, and tactics through a hands-on, visual interface (draggable/clickable pitch, position encyclopedia, position-specific workouts, manager tactics profiles).
**Status:** Pre-MVP — project not yet scaffolded (no code written)
**Repo:** local only

## Tech Stack
- **Language:** TypeScript
- **Framework:** Next.js (SEO benefits for content/position pages) + SVG for the interactive pitch
- **Database:** None for v1 — static/MDX content, no accounts. A DB only becomes relevant in Phase 3 (accounts, progress tracking).
- **Deployment:** Static hosting + CDN (Vercel, Netlify, or Cloudflare Pages)

## Development Commands
```bash
# Not yet initialized — fill in once the Next.js app is scaffolded
# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Lint / type-check
npm run lint
```

## Architecture
Content-first static site. Formation/position/manager data should live as structured content (MDX or JSON) so pages stay easy to add without touching component code. The pitch itself is a client component (SVG-based) that reads formation data and renders/animates player markers; clicking a marker routes to that position's page.

```
src/
  app/              Next.js routes — one page per formation, position, manager, workout plan
  components/pitch/ Interactive SVG pitch, formation selector, compare-mode view
  content/          MDX/JSON content: formations, positions, managers, workout plans
  lib/              Formation data model, position metadata, shared types
```

## Key Conventions
- **No real player names, likenesses, club crests, kits, or league logos anywhere** — use role labels (e.g., "LW," "CDM") and generic/abstract markers and colors. This is a hard legal constraint, not a style preference (see PRD Section 9).
- **All written content (position descriptions, manager tactical analysis, drills) must be original wording** — facts aren't copyrightable, but copied phrasing from articles/wikis is. Never paraphrase-copy from a source page.
- Manager profiles cover only factual/biographical info and original tactical analysis — no implied endorsement, no paparazzi/agency photos.
- Workout/training content must include a general-fitness disclaimer (not medical advice).
- Position/formation pages should be statically generated (SSG) for SEO — avoid client-only rendering for primary content.

## Environment Variables
See `.env.example` for required variables. Copy to `.env` to get started. v1 needs no database or auth secrets — only CMS keys apply if a headless CMS (Sanity/Contentful) is adopted instead of local MDX.

## Testing Approach
TBD once the project is scaffolded. Expect: unit tests for the formation data model / position lookups, and interaction tests (Playwright) for pitch clicks, formation switching, and compare mode given the interactivity is the core value prop.

## Known Gotchas
- **Copyright is a first-class constraint, not an afterthought.** Every feature involving formations, managers, or players must be checked against PRD Section 9 (no club IP, no player likenesses/names on the pitch, no licensed footage) before implementation.
- Formation "compare mode" and quizzes are Should/Could-have for v1 — don't build them before the MVP scope (PRD Section 10: pitch + 10 position pages + 4 workout plans + 4–6 manager profiles) is done.
- Several product decisions are still open (PRD Section 13): monetization model, sandbox vs. preset-only pitch, video vs. illustration-only drills, new-fan vs. player-first messaging, football/soccer terminology default. Flag these rather than assuming an answer when they affect a feature you're building.
