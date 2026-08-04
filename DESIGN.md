---
name: PitchStudy
description: Interactive football tactics education, styled as a stadium under floodlights.
colors:
  attack: "#ffb627"
  attack-hi: "#ffd166"
  attack-deep: "#d98d0f"
  defend: "#3d7bff"
  defend-bright: "#6c9cff"
  defend-deep: "#1b3a8f"
  press: "#ff3b3b"
  press-deep: "#c11212"
  night-950: "#15121b"
  night-900: "#1e1a29"
  night-800: "#282235"
  chalk: "#e9edf2"
  touchline-muted: "#8b93a3"
  dossier-paper: "#ece2c8"
  dossier-card: "#f4ecd8"
  dossier-edge: "#d9c9a3"
  dossier-ink: "#2b2620"
  dossier-ink-muted: "#6b6048"
  dossier-priority: "#7a4a15"
  dossier-carbon-blue: "#3a5a78"
  dossier-risk-red: "#a33b2e"
  broadcast-white: "#ffffff"
  broadcast-grey: "#8b93a3"
  broadcast-cyan: "#67e8f9"
typography:
  display:
    fontFamily: "Big Shoulders, system-ui, sans-serif"
    fontWeight: 900
    letterSpacing: "-0.02em"
    lineHeight: 1
  body:
    fontFamily: "Public Sans, system-ui, sans-serif"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontWeight: 600
  dossier-display:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontWeight: 700
    letterSpacing: "-0.01em"
    lineHeight: 1
rounded:
  full: "9999px"
  md: "0.5rem"
  sm: "0.125rem"
components:
  button-primary:
    backgroundColor: "{colors.attack}"
    textColor: "{colors.night-950}"
    rounded: "{rounded.full}"
    typography: "{typography.label}"
    padding: "0 2rem"
    height: "2.75rem"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.touchline-muted}"
    rounded: "{rounded.full}"
    typography: "{typography.label}"
    padding: "0 1.5rem"
    height: "2.75rem"
  card:
    backgroundColor: "{colors.night-900}"
    textColor: "{colors.chalk}"
    rounded: "{rounded.md}"
    padding: "1.5rem"
  input:
    backgroundColor: "{colors.night-900}"
    textColor: "{colors.chalk}"
    rounded: "{rounded.full}"
    padding: "0.625rem 1.25rem"
---

# Design System: PitchStudy

> **World in transition.** PitchStudy is mid-redesign, now with two proof-of-direction surfaces
> ahead of the sitewide nav's "Floodlit Pitch" (below). **Tactics Lab** (`/tactics-lab`) was
> rebuilt in **"The Scouting Dossier,"** a light warm-paper world. The **homepage** (`/`) was
> rebuilt in **"The Broadcast Overlay,"** a dark glassy world evoking a live match-analysis
> graphics feed. Until the rest of the site rolls over, expect the sitewide nav (still Floodlit
> Pitch) to hand off into either — this is a deliberate, disclosed seam, not a bug. See
> **Scouting Dossier** and **Broadcast Overlay** callouts under Colors, Typography, Shapes,
> Elevation & Depth, and Components below for each world's specifics.

## Overview

**Creative North Star: "The Floodlit Pitch"**

A stadium at night: the base is never true black but a violet-tinted charcoal, as if lit by distant floodlights rather than absent of light. Three accent hues carry fixed, non-interchangeable meaning rather than decorative variety — amber for attack, progress, and reward; blue for defense and structure; red reserved for pressing, danger, and mistakes, spent as rarely as an actual red card. Nothing else in the palette competes with those three; neutrals stay neutral so the three hues keep their signal value.

The system is confident rather than loud: flat surfaces, pill-shaped controls, mono-spaced uppercase labels standing in for the crispness of a scoreboard or matchday graphic, and a big, condensed display face doing the shouting instead of color or ornament.

**Key Characteristics:**
- Violet-charcoal base, never pure black
- Exactly three brand hues, each with one fixed job
- Pill radius on everything interactive; softer rectangles on everything you sit inside
- Colored glow, not gray shadow, is how this system says "this matters"
- Condensed, heavy, uppercase display type as the primary voice; mono uppercase for labels and eyebrows

## Colors

Matchday-material names: each hue is named for a physical thing you'd actually see at a match, not for its hue family.

### Primary
- **Floodlight Amber** (#ffb627): attack, progress, XP, reward, the primary CTA fill. The system's warmest, most-used accent — everything the user is meant to *do next* lives here.

### Secondary
- **Away Kit Blue** (#3d7bff): defense and structure — the "Defend" side of every attack/defend toggle, informational chips, the tactics-board reading of a shape. Two variants exist on purpose: `#3d7bff` is only 3:1-safe, so it's for borders, fills, and icons only; `#6c9cff` (Away Kit Blue, bright) is the AA-safe (4.5:1+) variant for blue *text* on `night-900`. Never use the base blue for body text.

### Tertiary
- **Red Card Red** (#ff3b3b): pressing, danger, destructive actions, mistakes. Spent deliberately rarely — its whole power is that it reads as an event, not a decoration. A risky selection (e.g. "High Press") gets a one-shot red pulse on selection so the choice is *felt*, not just repainted.

### Neutral
- **Night** (#15121b / #1e1a29 / #282235): a three-step ramp from page background (950) to card surface (900) to raised surface/border (800) — all violet-tinted charcoal, never neutral gray and never pure black.
- **Chalk** (#e9edf2): primary text — named for chalk pitch-marking lines.
- **Touchline Grey** (#8b93a3): secondary/muted text, deliberately kept out of the three brand hues so it never competes with them.

### Named Rules
**The Dark-Text-on-Fill Rule.** Any element with a solid brand-hue fill (Floodlight Amber, Away Kit Blue, or Red Card Red) uses Night (#15121b) text, never Chalk — verified: night-950 clears 4.5:1+ on all three hues at their fill luminance, chalk maxes out around 3.3:1 on the same fills.

**The One-Job-Per-Hue Rule.** Amber means attack/progress, blue means defense/structure, red means pressing/danger — never reassign a hue to a fourth, unrelated meaning just because it's decoratively convenient.

### Scouting Dossier (Tactics Lab only)
A light, warm-paper palette — the deliberate opposite of Floodlit Pitch's dark base, forced by the physical scene (a paper report read in desk light, not a glowing screen). The same three functional meanings (attack/defend/press) carry over as inks, not screen hues: **Priority Stamp** (#7a4a15, was Floodlight Amber), **Carbon-Copy Blue** (#3a5a78, was Away Kit Blue), **Risk Stamp Red** (#a33b2e, was Red Card Red) — all re-verified for AA text contrast against both paper tones (Manila Paper #ece2c8, Index-Card Paper #f4ecd8; all three inks clear 5:1+). Neutrals: **Ink** (#2b2620, primary text) and **Faded Ink** (#6b6048, secondary text, 4.8:1+). A rubber stamp's fill color (`#b8860b`, the old Floodlight Amber hex) is kept as a *decorative-only* accent — it fails text contrast on this light ground by design, so it's never used for text, only hover washes and non-text accents. Modal/dialog backdrops use a dedicated dark scrim (`rgba(43,38,32,0.5)`) rather than any neutral token, since every neutral here is light.

### Broadcast Overlay (Homepage only)
Born from a live-mode redesign session working from three mood-board references (a glossy blue web-studio UI, a dark sci-fi event poster, a blue/white glitch-art music poster) toward a "futuristic and swaggy, but still instructive" brief. Floodlit Pitch's three hue-coded meanings (amber/blue/red) are dropped for this surface only — the homepage doesn't carry per-feature meaning the way a tactics toggle does, so the whole page instead runs on one accent: **Broadcast Cyan** (`#67e8f9`, Tailwind cyan-300) over **Broadcast Grey** (`#8b93a3`, the same hex as `touchline-muted`) and **Broadcast White** (`#ffffff`), composed as a single named gradient token, `--grad-futurist: linear-gradient(120deg, var(--touchline-muted), #ffffff, #67e8f9)`. Surfaces are near-black glass (`rgba(255,255,255,0.04)` panels with `backdrop-blur-xl`) rather than Floodlit Pitch's flat `night-900` card — the "screen" reads like a HUD readout over dark glass, not a bordered app card. `--grad-futurist` is deliberately never mixed into the sitewide `--grad-kickoff` (press→attack→defend); the two gradients stay visually and semantically separate.

### Broadcast Overlay component notes
- **Hero:** `.hero-glass-panel` (translucent glass card) with `.hero-shimmer-bar` (an animated cyan sweep along the top edge) and `.hero-breathe-glow` (a slow pulsing glow on the primary CTA) — both continuous loops, the one place on this surface where ambient motion runs unprompted, matching a broadcast graphic's own idle shimmer.
- **HUD frame:** `.hud-frame` draws sci-fi-poster-style corner brackets (cyan, 2px, open-cornered) in pure CSS, no extra markup.
- **Feature grid (bento cards):** `.bento-accent-bar` renders `--grad-futurist` across the full width of every card's top edge (replacing what was six cards each carrying their own amber/blue/red accent — this surface intentionally doesn't reuse Floodlit Pitch's one-job-per-hue rule). `border-grad-futurist` swaps in for `border-grad-kickoff` as the hover-glow ring on these cards specifically (via `TiltCard`'s `glowClassName` prop). Six live mini-widgets (`src/components/home/cards/*`) turn each card into a small working demo of its destination page rather than a static description.
- **Motion, "alive, not a casino":** per-card motion (mini-widget hover-tweens, the accent-bar shimmer, the card's rise-in on load) is either hover/focus-triggered or plays once on mount — nothing on an individual card loops indefinitely. Only page-level ambient elements loop: the hero's shimmer/breathe pair above, and `.bento-grid::before`, a soft blurred `--grad-futurist` wash breathing behind the whole feature grid.

## Typography

**Display Font:** Big Shoulders (condensed, weights 500/700/900), with system-ui fallback
**Body Font:** Public Sans, with system-ui fallback
**Label/Mono Font:** IBM Plex Mono (weights 400/500/600), with ui-monospace fallback

**Character:** A condensed, heavyweight display face reads like a matchday scoreboard or shirt-back numbering; a plain, humanist sans keeps body copy quiet and legible; a mono face renders every label, eyebrow, and tab as if it were a stat line.

### Hierarchy
- **Display** (900, large/clamped, leading-none, uppercase, tight tracking): page and section headings — "Welcome to the club," "Build a shape."
- **Body** (400, text-sm to text-base, leading-relaxed): descriptive copy, card body text.
- **Label** (600, text-xs, uppercase, tracking-widest, IBM Plex Mono): eyebrows above headings, button text, tab labels, form field placeholders-as-labels. This is the system's most distinctive typographic signature — nearly every piece of UI chrome (not prose) is rendered this way.

### Named Rules
**The Mono-Chrome Rule.** Interface chrome (buttons, tabs, eyebrows, nav labels) is always uppercase tracking-widest mono; body prose is never set in the mono face. The two faces never trade roles.

### Scouting Dossier (Tactics Lab only)
IBM Plex Mono is promoted from label-only duty to *also* serve as the display face — a dossier's headers are just bigger typewriter text, not a separate display font, so no new typeface was introduced. Public Sans remains the body face for longer case notes. This is a deliberate, materially-justified exception to Floodlit Pitch's "condensed display + mono labels" split, not a drift.

## Layout

Single-column, generous vertical rhythm on content pages (headers use a stacked eyebrow → display heading → body-copy pattern, repeated identically across Account, Admin, Login, Join). Tactics Lab and the admin dashboard use a wider two-column layout (pitch/board + a complementary sidebar of stats and controls) since they're tool surfaces rather than reading surfaces. Fully responsive; mobile collapses the two-column tool layouts to stacked single-column.

## Elevation & Depth

Flat by default — cards and panels are bordered, not shadowed, and sit at a single visual depth. The one deliberate exception is the primary CTA, which carries a soft colored glow in its own hue (`shadow: 0 0 32px -8px var(--attack)`) instead of a neutral drop shadow — elevation here is expressed as light, not as a gray shadow implying a physical lift. A secondary, subtler pattern (`.tactics-panel`) gives Tactics Lab's side panels a faint inset top highlight plus an inset bottom shadow for a tactile, physical-card feel without introducing an external shadow.

### Named Rules
**The Colored-Glow Rule.** When a surface needs to feel elevated or important, the elevation is a soft glow in the element's own brand hue, never `rgba(0,0,0,…)`.

### Scouting Dossier (Tactics Lab only)
The glow-shadow rule is explicitly rejected here: a colored halo doesn't survive translation to paper. The one elevation device is `.dossier-paper-shadow` — a real offset-plus-blur shadow (`2px 3px 0 rgba(43,38,32,.12), 4px 6px 12px -4px rgba(43,38,32,.18)`) reading as a sheet lifted slightly off the desk, applied to the pitch/board frame, player markers, Playbook cards, and the save-sheet modal.

### Broadcast Overlay (Homepage only)
Extends the Colored-Glow Rule rather than breaking it: elevation still reads as light, never gray shadow, but the glow is cyan (`--grad-futurist` / `rgba(103,232,249,…)`) instead of the per-hue amber/blue/red glow used elsewhere. Glass panels add a second depth cue Floodlit Pitch doesn't use — `backdrop-blur-xl` over translucent white fills — so elevation here is "glass over a dark HUD," not just a glow on a flat card.

## Shapes

Two radii, used systemically and never mixed: **full** (`9999px`, a true pill) on every interactive control — buttons, inputs, tab tracks, nav chips, the segmented-tab indicator — and **md** (`0.5rem`/8px) on everything you sit inside or read from — cards, modals, panels. A control you act on is always a pill; a surface you read or sit inside is always a soft rectangle.

### Named Rules
**The Pill-vs-Rectangle Rule.** If it's clickable, it's fully rounded. If it's a container, it's `rounded-lg` and nothing rounder.

### Scouting Dossier (Tactics Lab only)
Pills are dropped entirely — real paper documents, forms, and rubber stamps are rectangular, not pill-shaped. Everything (buttons, inputs, the pitch frame, player markers, Playbook cards) uses a small **sm** radius (`0.125rem`/2px), reading as an index card or form field rather than a soft app-shell rectangle. Two literal, factual exceptions keep their true circular shape rather than following the new rule: the ball marker in Play Designer/Scenario Mode (a ball is round) and the center-spot/penalty-spot dots on the pitch diagram (also literally round marks) — a shape rule about *UI convention* doesn't override a shape that's a fact about the object being drawn.

## Components

### Buttons
- **Shape:** full pill (`rounded-full`), `min-h-11` (44px) minimum tap target.
- **Primary:** Floodlight Amber fill, Night text, mono uppercase label, colored glow shadow, scales to 1.02 on hover.
- **Ghost/Outline:** transparent fill, `touchline-muted/40` border, hover shifts border to `pitch-marker` (amber).
- **Gradient-bordered variant:** a 2px animated-feeling gradient ring (`border-grad-kickoff`, sweeping press → attack → defend) around a pill, used for a secondary CTA that still needs real visual weight (e.g. "Join the Club").
- **Focus:** every interactive control — no exceptions — gets `outline-2 outline-offset-2` in Floodlight Amber (`--pitch-marker`) on `:focus-visible`. This is a hard sitewide standard, not a per-component choice.

### Cards / Containers
- **Corner Style:** `rounded-lg` (8px), never full.
- **Background:** Night-900, occasionally at 95% opacity over the fixed background texture (`tactics-panel`).
- **Shadow Strategy:** none by default; see Elevation & Depth for the one exception.
- **Border:** 1px, `touchline-muted` at 30% opacity.

### Inputs / Fields
- **Style:** full pill, `touchline-muted/40` border, Night-900 background, Chalk text, `touchline-muted/70` placeholder.
- **Focus:** same amber focus-visible ring as buttons — inputs never get a distinct focus treatment of their own.

### Modals / Confirm Dialogs
- **Backdrop:** `night-950` at 85% opacity, full-viewport, centered content.
- **Panel:** the standard card treatment (`rounded-lg`, bordered, `night-900`), entrance via a scale+fade (0.96→1, opacity 0→1).
- **Never** a native `window.confirm()` — every confirmation in the product uses this custom pattern.

### Navigation
- Signed-in identity renders as a small rounded-full chip: a 2-letter initials avatar in a solid-amber circle (Night text) plus the display name, opening a dropdown menu on click (not hover), closing on outside-click, Escape, or item-select.

### Segmented Tabs (signature component)
A pill-track control (`rounded-full border touchline-muted/30 bg-night-900 p-1`) holding pill-shaped options; the active option's fill is a sliding, spring-animated highlight (Framer Motion `layoutId`), not a hard cut. Each option can carry its own fill tone (amber/blue/red/a warm attack-press blend) so the *choice itself* communicates posture — selecting a red-toned option (e.g. "High Press") also fires a one-shot red pulse ring, so a risky choice is felt, not just repainted. Full keyboard support (arrow keys cycle, Home/End jump). This is the system's most distinctive custom control and the clearest expression of "color carries meaning, not decoration."

**Scouting Dossier note:** Tactics Lab's own mode switcher (Formation Designer / Play Designer / Scenario Mode / Playbook) does *not* use this component — it uses the new **Dossier Tabs** below instead. The Mentality / Pressing-style / Defensive-line pickers inside Tactics Lab's Team Instructions panel, however, still render through this shared Segmented Tabs component (colors cascade to the dossier palette automatically; the pill shape does not) — rebuilding it bespoke was deliberately deferred since Workouts' lens tabs share the same component and aren't part of this build. Disclosed scope boundary, not an oversight.

### Scouting Dossier (Tactics Lab only)

**Buttons — "Stamp":** no fill. A rubber-stamp impression: 2px border in the ink color, ink-colored uppercase mono text, transparent background, `rounded-sm` (2px) corners (`.dossier-stamp` utility class). Replaces Floodlit Pitch's solid-fill-plus-glow CTA everywhere in Tactics Lab (Save to Playbook, Duplicate to my Playbook, Send to the Coaching Staff, the Save-sheet's Save button, the Leave-without-saving confirm's Stay/Leave).

**Dossier Tabs (signature component, replaces Segmented Tabs for this world):** folder tabs, not a pill track. Each tab is a `rounded-t-sm` bordered rectangle sitting on a shared `border-b-2` rule; the active tab lifts 2px and drops its own bottom border so it visually merges into the panel below, exactly like the divider card currently pulled forward in a folder. Inactive tabs recede a few pixels "behind," implemented via `z-index` stacking rather than opacity. Full keyboard support carried over from Segmented Tabs (arrow keys, Home/End). Horizontally scrollable (`overflow-x-auto`) on narrow viewports rather than wrapping, since wrapped folder tabs don't read as a folder.

**Header:** tried, then reverted by request — a bordered case-file card with a rotated "Tactics Division" stamp box. Current header is the plain sitewide eyebrow-plus-heading pattern (eyebrow → `<h1>` → body copy, no card, no stamp), just rendered in the dossier's promoted display-mono face and ink/paper colors rather than Big Shoulders on dark. Don't reintroduce the case-file card without the user asking for it again.

**Pitch/board frame:** the green-glow ambient blur divs from Floodlit Pitch's pitch frame are removed entirely (a colored halo doesn't survive translation to paper); the frame itself is `rounded-sm`, bordered in the paper-edge tone, with `.dossier-paper-shadow` for lift. Player markers are small `rounded-sm` squares (stamped position codes) rather than circles — the one exception being the ball itself and the pitch's center/penalty spots, which stay circular since that's a fact about the object, not a UI convention.

**Modals:** backdrop uses the dedicated dark scrim token (never a neutral, since neutrals are light in this world); panel keeps the bordered-card-plus-paper-shadow treatment, `rounded-sm` not `rounded-lg`.

## Do's and Don'ts

### Do:
- **Do** use Floodlight Amber, Away Kit Blue, and Red Card Red for exactly their assigned meaning (attack/defend/press) every time — never as a fourth generic "accent."
- **Do** give every interactive element a visible `:focus-visible` ring in the amber marker color.
- **Do** use the custom modal pattern (backdrop + bordered `night-900` panel) for any confirmation — never a native browser dialog.
- **Do** respect `prefers-reduced-motion` — the project already zeroes all animation/transition durations globally when it's set; new motion must not bypass that.

### Don't:
- **Don't** use base Away Kit Blue (`#3d7bff`) for body text — it fails AA; use the bright variant (`#6c9cff`) for text, base blue for borders/fills/icons only.
- **Don't** give a card, panel, or modal a gray/black drop shadow — flat by default, colored glow only for the one CTA exception.
- **Don't** round a container past `rounded-lg` (8px) or leave an interactive control anything less than fully pill-shaped — the two radii never mix.
- **Don't** set interface chrome (buttons, tabs, eyebrows, labels) in the body sans face, or body prose in the mono face — the two typefaces never trade roles.
