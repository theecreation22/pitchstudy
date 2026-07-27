# Landing Page — Design

**Date:** 2026-07-26
**Status:** Approved

## Problem

`/` currently *is* the interactive pitch explorer directly — a short headline plus the live `FormationExplorer`. There is no page that introduces PitchIQ as a product, explains what it offers, or gives an equally-weighted path into the other four sections (Workouts, Managers, Quiz, and positions in general). A first-time visitor lands straight in a tool with no framing.

## Goals

- Give the site a real entry point that explains what PitchIQ is before dropping visitors into a tool.
- Surface all major sections (Explore, Workouts, Managers, Quiz) with equal visual weight — per PRD Section 13 open question #4 (tactics-first vs. training-first messaging), this resolves **balanced / no lean**: the copy doesn't favor new-fan or player framing.
- Do this without growing scope into a new Positions index page — Positions stays reachable only via the pitch explorer and related-position links, as today. The landing page's Explore card copy covers this instead of a dedicated card.

## Non-goals

- No new Positions index page (explicitly deferred; the existing discovery path — pitch markers and related-position links — is unchanged).
- No redesign of the Explore/Workouts/Managers/Quiz pages themselves beyond the routing move and link updates below.
- No new design tokens, fonts, or colors — this reuses the existing navy/cyan chalkboard design system as-is, including the card pattern (eyebrow above h2, `bg-pitch-card`, `border-pitch-touchline/30`) standardized during the recent UX audit pass.

## Design

### 1. Routing change

- The current `src/app/page.tsx` content (the full `FormationExplorer` — formation switching, compare mode, `?formation=` deep-link support) moves as-is to a new `src/app/explore/page.tsx`.
- `src/app/page.tsx` is replaced with the new landing page.
- `src/app/layout.tsx` nav gains an "Explore" link. Final nav order: **PitchIQ** (logo/home) · **Explore** · **Managers** · **Workouts** · **Quiz**.

### 2. Internal links to update

Every link that currently points to `/` expecting the pitch tool must become `/explore`:

- `src/app/positions/[slug]/page.tsx` — "← Back to the pitch" link (`href="/"` → `href="/explore"`)
- `src/app/managers/[slug]/page.tsx` — "View the {formation.name} on the pitch →" deep link (`href={\`/?formation=${formation.slug}\`}` → `href={\`/explore?formation=${formation.slug}\`}`)

### 3. Shared `PitchMarkings` extraction

`src/components/pitch/Pitch.tsx` currently defines the SVG pitch-line art (chalk-hand-drawn lines, boxes, center circle, corner arcs, the `pitchiq-chalk` filter) inline, mixed with the clickable marker overlay. Extract the markings-only SVG into `src/components/pitch/PitchMarkings.tsx` (no props — it's static line art), and have `Pitch.tsx` render `<PitchMarkings />` followed by its existing marker `<ul>` overlay. This is the one piece of the existing code this feature needs to touch, and it directly enables reuse in the new hero visual without duplicating the SVG geometry.

### 4. Landing page (`src/app/page.tsx`)

**Hero**
- Eyebrow (mono, `text-pitch-marker`): `INTERACTIVE FOOTBALL EDUCATION`
- H1 (`font-display`, matches the site's standard detail-page h1 scale — `text-4xl leading-none tracking-tight sm:text-6xl`): **"Know the shape. Know your role."**
- Subhead: "Explore live formations, learn what every position does, train for your role, and study the managers who shaped how the game is played."
- Static visual: a new `src/components/home/HeroPitch.tsx` client-free component rendering `<PitchMarkings />` plus a **fixed, non-interactive** 4-3-3 shape — plain `<div>` markers styled identically to the real interactive markers (circle badge, mono position code) but with no `<Link>`, no click handler, and no formation switching. Reuses the `formations` data (find the `"4-3-3"` entry) so the coordinates stay in sync with the real tool.
- Primary CTA: **"Explore the pitch →"** button/link to `/explore`, styled as the site's standard filled/outlined pill CTA (matching e.g. the "Train for this position" pattern).

**Section grid** — 4 cards, equal visual weight, reusing the standardized card pattern (mono eyebrow above `h2`, `bg-pitch-card`, `border-pitch-touchline/30`, hover `border-pitch-marker`):

| Card | Eyebrow | Title | Copy | Links to |
|---|---|---|---|---|
| 1 | INTERACTIVE PITCH | Explore the pitch | "Switch between 8 formations, watch the shape change, and click any player to learn what their position actually does." | `/explore` |
| 2 | TRAINING | Workouts | "Four-week plans for every position group — strength, speed, endurance, and position-specific drills." | `/workouts` |
| 3 | TACTICS HISTORY | Managers | "Profiles of the managers who shaped how the game is played, and the formations they made famous." | `/managers` |
| 4 | TEST YOURSELF | Quiz | "Short quizzes on formations, positions, and managers with instant feedback — no accounts needed." | `/quiz` |

### 5. Metadata

- Root layout metadata (`src/app/layout.tsx`) stays as the site-wide default — it already reads as landing-page-appropriate ("PitchIQ — Learn football tactics, interactively").
- `src/app/explore/page.tsx` gains its own `metadata` export (title/description specific to the formation explorer), matching the pattern every other section page already follows.

## Testing / verification

- `npm run lint`, `npx tsc --noEmit`, `npm run build` all clean; `/explore` and `/` both appear in the static route output.
- Browser check (desktop + mobile) once Playwright is available: landing hero renders correctly, static pitch visual shows a fixed non-interactive 4-3-3, all 4 cards link correctly, nav shows the new Explore item, `/explore` behaves identically to the old `/` (formation switching, compare mode, `?formation=` deep link from a manager page all still work).
- Manually click through from a manager page's "View the formation" link and from a position page's "Back to the pitch" link to confirm both land on `/explore` with the right formation preselected.

## Open questions

None — all resolved during brainstorming (route structure, hero content type, Positions handling, messaging balance).
