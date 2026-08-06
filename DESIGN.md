---
name: PitchStudy
description: Interactive football tactics education, styled as a bright instrument reading a cloudy sky.
colors:
  attack: "#8a5c12"
  attack-hi: "#ffb627"
  attack-deep: "#6b460d"
  defend: "#2f5f95"
  defend-bright: "#6c9cff"
  defend-deep: "#16324f"
  press: "#b8362a"
  press-deep: "#8a2920"
  night-950: "#eef4fa"
  night-900: "#ffffff"
  night-800: "#d7e6f2"
  chalk: "#22384a"
  touchline-muted: "#52738c"
  telemetry-parchment: "#22384a"
  telemetry-olive: "#4f86b8"
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
  telemetry-display:
    fontFamily: "Frank Ruhl Libre, Georgia, serif"
    fontWeight: 900
    letterSpacing: "-0.01em"
    lineHeight: 1
rounded:
  full: "9999px"
  md: "0.5rem"
  sm: "0.125rem"
components:
  button-primary:
    backgroundColor: "{colors.attack}"
    textColor: "#ffffff"
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

## Overview

**Creative North Star: "Pitch Telemetry"**

PitchStudy's sitewide identity, replacing three earlier worlds — "The Floodlit Pitch" (a dark
stadium base), "The Scouting Dossier" (Tactics Lab's warm-paper redesign), and "The Broadcast
Overlay" (the homepage's dark-glass redesign). Built from two mood-board references (a vintage
technical/product-schematic poster — measurement calipers, gauge sliders, serials, halftone
line art on olive paper — and a moody "Solaris Eclipse" ad blending an elegant serif wordmark
with sci-fi HUD chrome: corner brackets, timestamps, a waveform toggle) toward the brief "the
website is good as in structure, but the look and feel is a bit soulless — make it more complex
and rich."

The result: a bright overcast-sky surface — pale blue-white, never true white, never the old
violet-charcoal dark — read through the lens of a measurement instrument. Every page carries the
same instrument-panel chrome: corner marks, tick rulers, spec-sheet readouts of real data (never
decorative numbers). It keeps the Floodlit Pitch's stadium-at-night DNA in spirit — the "sky" is
what a floodlit pitch looks like from the other side, dusk rather than midnight — while adding
the density and material richness the old flat-dark and flat-paper worlds didn't have.

**Key Characteristics:**
- Pale overcast-sky base (`#eef4fa`), white cards, never true dark and never true white
- Exactly three brand hues (amber/blue/red) still carry fixed attack/defend/press meaning, now
  redefined as ink-safe deep tones for AA text contrast on a light ground
- Instrument chrome sitewide: corner brackets (`.telemetry-corner`), tick rulers
  (`.telemetry-ruler`), spec-sheet readouts (`.telemetry-readout`) — see Components
- A cool-toned lift shadow (`.telemetry-panel-lift`) replaces both the old dark stadium's
  black drop-shadows and the old paper world's offset shadow
- Condensed, heavy, uppercase Big Shoulders remains the sitewide display workhorse; an elegant
  serif (Frank Ruhl Libre, `.font-telemetry-display`) is reserved for the one or two hero-level
  headline moments per page (homepage, Explore) — not a sitewide typeface swap

## Colors

### Primary
- **Telemetry Gold** (`#8a5c12`): attack, progress, XP, reward, the primary CTA fill. Redefined
  from the old bright Floodlight Amber (`#ffb627`, kept as `attack-hi`, decorative-only — hover
  washes and non-text accents, since it fails text contrast on this light ground) to a deep,
  ink-safe gold so amber-on-fill and amber-as-text both clear AA on the pale sky background.

### Secondary
- **Telemetry Blue** (`#2f5f95`): defense and structure — the "Defend" side of every
  attack/defend toggle, informational chips, the tactics-board reading of a shape. `#6c9cff`
  (`defend-bright`) survives from the old palette as the brighter, non-text accent variant.

### Tertiary
- **Telemetry Red** (`#b8362a`): pressing, danger, destructive actions, mistakes — spent
  deliberately rarely, same as before. A risky selection still gets a one-shot red pulse ring.

### Neutral
- **Sky** (`#eef4fa` / `#ffffff` / `#d7e6f2`): a three-step ramp from page background (950) to
  card surface (900, pure white) to raised surface/border (800, soft cloud-blue) — never
  neutral gray, never true white, never the old violet-charcoal dark.
- **Ink** (`#22384a`): primary text — deep navy, the same tone that drives every
  `.telemetry-*` chrome element (`--telemetry-parchment`).
- **Slate** (`#52738c`): secondary/muted text.

### Named Rules
**The Ink-Safe Rule.** Amber/blue/red each have a deep "ink" value (`attack`/`defend`/`press`)
used for text, borders, and fills, and a brighter "hi" value (`attack-hi`, `defend-bright`)
reserved for decorative, non-text uses only — inherited from Scouting Dossier's identical rule
for its own paper background, now applied sitewide since Pitch Telemetry's ground is light too.

**The One-Job-Per-Hue Rule.** Amber means attack/progress, blue means defense/structure, red
means pressing/danger — never reassign a hue to a fourth, unrelated meaning.

## Typography

**Display Font:** Big Shoulders (condensed, weights 500/700/900) — the sitewide workhorse,
unchanged from the old Floodlit Pitch system.
**Hero Display Font:** Frank Ruhl Libre (serif, weight 900), via `.font-telemetry-display` —
reserved for the homepage and Explore's H1s, the "one committed display moment" per page rather
than a full typeface swap. Most headings sitewide (Tactics Lab, Academy, Managers, Training,
Challenge) still use Big Shoulders.
**Body Font:** Public Sans, unchanged.
**Label/Mono Font:** IBM Plex Mono, unchanged — already fit the new instrument-chrome language
perfectly (measurement labels, readouts, serials all read naturally in mono).

### Named Rules
**The Mono-Chrome Rule.** Interface chrome (buttons, tabs, eyebrows, nav labels) is always
uppercase tracking-widest mono; body prose is never set in the mono face.

## Layout

Unchanged from the previous system: single-column, generous vertical rhythm on content pages;
Tactics Lab and the admin dashboard use a wider two-column layout. Fully responsive.

## Elevation & Depth

Every card that used to carry a heavy dark drop-shadow (`rgba(0,0,0,0.6-0.7)`, designed for a
dark page) now uses `.telemetry-panel-lift` — a cool navy-tinted offset shadow (`rgba(34,56,74,
0.08-0.22)`) reading as a bright panel lifted a couple of inches off a light table, not a glow
and not a heavy black shadow.

### Named Rules
**The Ink-Shadow Rule.** Elevation shadows are always tinted with the ink color
(`rgba(34,56,74,…)`), never neutral black and never the old per-hue colored glow — a black
shadow reads as dirt on a bright surface, and a colored glow doesn't survive a bright,
overcast-sky ground any better than it survived Scouting Dossier's paper.

## Shapes

Unchanged: two radii, used systemically and never mixed — **full** (`9999px`) on every
interactive control, **md**/`rounded-lg` (8px) on everything you sit inside or read from.

### Named Rules
**The Pill-vs-Rectangle Rule.** If it's clickable, it's fully rounded. If it's a container, it's
`rounded-lg` and nothing rounder.

## Components

### Telemetry Chrome (signature components, sitewide)
- **Corner marks** (`.telemetry-frame` + `.telemetry-corner-{tl,tr,bl,br}`): small open-cornered
  brackets at a panel's corners — the hero, every bento card, every pitch board.
- **Tick ruler** (`.telemetry-ruler`): a faint vertical rule with two cross-ticks, sitting just
  outside a pitch board's left edge — evokes the mood-board cassette poster's gauge sliders.
  Currently on Explore's pitch only.
- **Spec-sheet readout** (`.telemetry-readout`): a bordered strip below a pitch board showing
  real computed data — formation name, shape width/depth (genuinely computed from player
  coordinates), player count — never decorative or fabricated numbers.
- **Accent bar** (`.bento-accent-bar`): every card's top edge renders one shared gradient
  (`--grad-futurist`, ink navy → white → telemetry blue) instead of a per-card hue — this
  surface doesn't carry per-feature color meaning the way a tactics toggle does.
- **Ambient cloud wash** (`.telemetry-cloud`, `.bento-grid::before`): soft diagonal
  white-to-blue gradients layered behind the pitch board and the homepage feature grid.
- **Motion, "alive, not a casino":** per-card motion (mini-widget hover-tweens, the accent-bar
  shimmer, a card's rise-in on load) is hover/focus-triggered or plays once on mount; only
  page-level ambient elements (the hero's shimmer bar, the bento grid's backdrop breathe) loop
  continuously.

### Buttons
- **Shape:** full pill (`rounded-full`), `min-h-11` (44px) minimum tap target.
- **Primary:** Telemetry Gold fill, white text (inverted from the old amber-fill/dark-text
  pairing, since the ink-safe gold is now a dark fill), mono uppercase label.
- **Ghost/Outline:** transparent fill, `touchline-muted/40` border, hover shifts border to
  `pitch-marker`.
- **Focus:** every interactive control gets `outline-2 outline-offset-2` in the marker color on
  `:focus-visible` — unchanged, still a hard sitewide standard.

### Cards / Containers
- **Corner Style:** `rounded-lg` (8px), never full.
- **Background:** white (`night-900`).
- **Shadow Strategy:** `.telemetry-panel-lift` where elevation is needed (pitch boards, the
  hero, bento cards); flat/bordered-only elsewhere.
- **Border:** 1px, `touchline-muted` at 30% opacity.

### Modals / Confirm Dialogs
- **Backdrop:** `night-950` at high opacity, full-viewport, centered content.
- **Panel:** the standard card treatment, entrance via a scale+fade.
- **Never** a native `window.confirm()`.

### Navigation
- Signed-in identity renders as a small rounded-full chip: a 2-letter initials avatar in a
  solid-gold circle (white text) plus the display name.

### Segmented Tabs (signature component)
A pill-track control holding pill-shaped options; the active option's fill is a sliding,
spring-animated highlight (Framer Motion `layoutId`). Each option can carry its own fill tone
(amber/blue/red) so the choice itself communicates posture. Full keyboard support.

## Do's and Don'ts

### Do:
- **Do** use Telemetry Gold, Blue, and Red for exactly their assigned meaning (attack/defend/
  press) every time — never as a fourth generic "accent."
- **Do** use the `attack`/`defend`/`press` ink values for text and the `-hi`/`-bright` values
  only for decorative, non-text accents.
- **Do** give every interactive element a visible `:focus-visible` ring in the marker color.
- **Do** use `.telemetry-panel-lift` for elevation, never a neutral black or per-hue colored
  glow shadow.
- **Do** respect `prefers-reduced-motion` — the project already zeroes all animation/transition
  durations globally when it's set.

### Don't:
- **Don't** use the bright `attack-hi`/`defend-bright` values for body text — they fail AA on
  this light ground; that's exactly why the ink-safe variants exist.
- **Don't** give a card, panel, or modal a plain black drop shadow — use the ink-tinted
  `.telemetry-panel-lift` shadow instead.
- **Don't** round a container past `rounded-lg` (8px) or leave an interactive control anything
  less than fully pill-shaped.
- **Don't** promote Frank Ruhl Libre beyond the one hero-level headline per page — it's a
  signature moment, not a sitewide typeface swap.
