---
name: PitchStudy
description: Interactive football tactics education, drawn as a floodlit tactics board read through an instrument panel.
colors:
  night-950: "#0f1f2e"
  night-900: "#16283a"
  night-800: "#22384a"
  chalk: "#eef4fa"
  touchline-muted: "#7f9db4"
  attack: "#67e8f9"
  attack-hi: "#a5f3fc"
  attack-deep: "#0e7490"
  defend: "#5b8fd6"
  defend-bright: "#8fb8f0"
  defend-deep: "#1f3a52"
  press: "#ff5c52"
  press-deep: "#c23f36"
  telemetry-parchment: "#c7e0f4"
  telemetry-olive: "#67e8f9"
typography:
  display:
    fontFamily: "Barlow Condensed, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 1.5rem + 3vw, 3.75rem)"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Barlow Condensed, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Barlow Condensed, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Public Sans, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 600
    letterSpacing: "0.1em"
  label-micro:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "0.625rem"
    fontWeight: 600
    letterSpacing: "0.15em"
rounded:
  full: "9999px"
  xl: "0.75rem"
  lg: "0.5rem"
  md: "0.375rem"
spacing:
  xs: "0.5rem"
  sm: "0.75rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2.5rem"
components:
  button-primary:
    backgroundColor: "{colors.attack}"
    textColor: "{colors.night-950}"
    rounded: "{rounded.full}"
    typography: "{typography.label}"
    padding: "0 1.5rem"
    height: "2.75rem"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.touchline-muted}"
    rounded: "{rounded.full}"
    typography: "{typography.label}"
    padding: "0 1.25rem"
    height: "2.75rem"
  button-action:
    backgroundColor: "transparent"
    textColor: "{colors.touchline-muted}"
    rounded: "{rounded.md}"
    typography: "{typography.label}"
    padding: "0 0.75rem"
    height: "2.25rem"
  card:
    backgroundColor: "{colors.night-900}"
    textColor: "{colors.chalk}"
    rounded: "{rounded.lg}"
    padding: "1.5rem"
  input:
    backgroundColor: "{colors.night-900}"
    textColor: "{colors.chalk}"
    rounded: "{rounded.md}"
    padding: "0 0.75rem"
    height: "2.75rem"
  chip-selected:
    backgroundColor: "{colors.attack}"
    textColor: "{colors.night-950}"
    rounded: "{rounded.full}"
    typography: "{typography.label}"
    padding: "0 1rem"
    height: "2.25rem"
---

# Design System: PitchStudy

## Overview

**Creative North Star: "Pitch Telemetry"**

A floodlit tactics board read through an instrument panel. The ground is deep night blue, the
kind of blue a pitch takes on under lights rather than the flat charcoal of a dark UI theme.
Over it sits measurement chrome: corner brackets, tick rulers, spec-sheet readouts that print
real data and never decorative numbers. Behind everything, a hand-drawn chalk play draws itself
in coaching order and fades, so the page reads as a board someone works on rather than a screen.

The system replaced three earlier worlds: "The Floodlit Pitch" (a violet-charcoal stadium base),
"The Scouting Dossier" (a manila-paper Tactics Lab, reverted the day it landed), and "The
Broadcast Overlay" (a dark-glass homepage). Pitch Telemetry itself passed through a light phase,
a pale overcast sky with ink-safe amber, before returning to a dark ground with cyan as the
accent. That light phase is retired. Anything describing a near-white background, a deep gold
`#8a5c12`, Big Shoulders, or a Frank Ruhl Libre serif hero face is out of date, not a variant.

Instrument language is the through-line. Where another product would decorate, this one measures:
a formation panel gets corner marks and a ruler, a play gets a step timeline, a shape gets a
radar and a readout strip. The three brand hues carry fixed tactical meaning and are never
reassigned, because on a tactics board colour is information.

**Key Characteristics:**
- Deep night-blue ground (`#0f1f2e`) falling to `#0a1622` at the bottom of a fixed-attachment
  page gradient; never pure black, never a light surface
- Exactly three brand hues carrying fixed meaning: cyan attacks, blue defends, red presses
- Instrument chrome sitewide: corner brackets, tick rulers, spec-sheet readouts
- Translucent glass on the largest reading surfaces, so the drifting atmosphere shows through
- Elevation is a coloured glow, not a drop shadow
- Condensed uppercase Barlow Condensed for every display moment; no second display face

## Colors

Three saturated signal hues over a five-step blue neutral ramp. Nothing is grey: even the muted
text carries a slate-blue cast, so the palette reads as one lit environment rather than a colour
scheme applied to a neutral shell.

### Primary
- **Floodlight Cyan** (`#67e8f9`): attack, progress, XP, reward, the primary CTA fill, the active
  state on every nav link and pill. The brightest thing on any screen and the page's only true
  focal colour. `attack-hi` (`#a5f3fc`) is its hover wash; `attack-deep` (`#0e7490`) is for fills
  behind light text.

### Secondary
- **Tactics Blue** (`#5b8fd6`): defence and structure. The "out of possession" side of every phase
  toggle, opponent markers, informational chips, the reading of a shape at rest. `defend-bright`
  (`#8fb8f0`) is the text-safe variant; `defend-deep` (`#1f3a52`) is a surface tone.

### Tertiary
- **Press Red** (`#ff5c52`): pressing, danger, destructive actions, mistakes, a wrong answer.
  Spent deliberately rarely. A risky selection gets a single red pulse ring rather than a
  permanent red state.

### Neutral
- **Night Sky** (`#0f1f2e` / `#16283a` / `#22384a`): a three-step ramp from page ground to card
  surface to raised surface and border. Blue-biased at every step.
- **Chalk** (`#eef4fa`): primary text and chalk-line pitch art. Pale sky, not white.
- **Touchline** (`#7f9db4`): secondary and muted text. Deliberately outside the three brand hues
  so muted text never reads as a tactical signal.
- **Telemetry Parchment** (`#c7e0f4`): the chrome-line colour. Every corner bracket, ruler tick,
  and readout border is this hue at low alpha.

### Named Rules
**The One-Job-Per-Hue Rule.** Cyan means attack and progress, blue means defence and structure,
red means pressing and danger. Never reassign a hue to a fourth, unrelated meaning. If a new
concept needs colour, it takes an existing hue's meaning or it takes none.

**The Dark-Ink-On-Fill Rule.** Any brand-hue fill takes `night-950` text, never white. All three
hues are bright enough that white-on-fill fails contrast. This is the single most common mistake
in this system: a cyan button with white text is unreadable and has shipped before.

**The Stable-Name Rule.** Token names (`--attack`, `--pitch-card`, `--chalk`) have survived three
complete world changes unchanged, which is why a repaint never touches component classes. When
the palette moves, change the value, never the name.

## Typography

**Display Font:** Barlow Condensed (weights 500/600/700/900)
**Body Font:** Public Sans
**Label/Mono Font:** IBM Plex Mono

**Character:** A condensed, heavy, uppercase display face against a plain humanist body face and a
mono used strictly for chrome. The condensed display does the shouting; the body text stays
completely quiet so long lesson prose is comfortable to read. There is no second display face:
`.font-telemetry-display` exists as a hook for the headline slot but currently resolves to Barlow
Condensed, uppercase, with `-0.01em` tracking.

### Hierarchy
- **Display** (900, `clamp(2.25rem, 1.5rem + 3vw, 3.75rem)`, line-height 1): page H1s. Uppercase,
  tight tracking, set to break across two or three lines rather than shrink.
- **Headline** (700, 1.5rem, 1.1): section and card titles.
- **Title** (700, 1.125rem, 1.2): panel headings inside sidebars and dialogs.
- **Body** (400, 1rem, 1.625): lesson prose and descriptions. Keep to roughly 65 characters.
- **Label** (600, 0.75rem, `0.1em`–`0.2em`, uppercase): interface chrome at normal density.
  Buttons, tabs, nav labels, form labels.
- **Micro label** (600, 0.625rem, `0.15em`–`0.2em`, uppercase): the densest chrome, and the most
  heavily used step in the system (roughly 77 occurrences across 33 files). Card eyebrows,
  readout strips, timeline steps, panel section headers, legends. Reach for this before inventing
  a smaller size; 9px and 11px appear a handful of times each and are not part of the ramp.

### Named Rules
**The Mono-Chrome Rule.** Interface chrome is always uppercase, letter-spaced mono. Body prose is
never set in the mono face, and the mono face never runs longer than a few words.

**The One Display Voice Rule.** Barlow Condensed uppercase is the only display treatment. The
retired serif-hero pattern is not a variant to reach for; a page that wants more presence gets a
larger size, not a different face.

## Layout

Single column with generous vertical rhythm on content pages; a two-column split (board plus
sidebar) on Tactics Lab, Explore, and the admin dashboard, collapsing to stacked below `lg`.
Content containers cap at `max-width: 72rem` for tool pages and `48rem` for reading pages, with
`1rem` gutters rising to `2rem` at `sm`.

Navigation is a fixed 15rem left rail from `lg` up, with the body offset by the same amount to
clear it. Below `lg` the rail is replaced by a sticky glass top bar and a hamburger sheet.
Vertical rhythm between major sections is `1.5rem` to `2.5rem`; card interiors are `1.5rem`.

## Elevation & Depth

Depth is light, not shadow. The page is a lit environment, so surfaces separate by translucency
and glow rather than by cast shadows. Three materials cover everything: flat tonal cards, a
translucent glass for the largest reading surfaces, and a coloured glow for anything filled with
an accent.

### Shadow Vocabulary
- **Panel lift** (`box-shadow: 0 0 28px -8px var(--attack)`): a cyan glow under accent-filled
  controls and the pitch board. Not a drop shadow; an offset shadow reads as invisible on this
  ground and was tried and removed.
- **Glass** (`inset 0 1px 0 0 rgba(255,255,255,0.1)`, `0 12px 32px -16px rgba(0,0,0,0.6)`): a
  luminous top hairline plus a soft ambient drop, with `backdrop-filter: blur(14px)`.
- **Tactile panel** (`inset 0 1px 0 0 rgba(255,255,255,0.05)`, `inset 0 -10px 18px -12px
  rgba(0,0,0,0.4)`): inset only, for cards that should feel physical rather than printed.
- **Recessed track** (`inset 0 1px 3px rgba(0,0,0,0.35)`): pill tab tracks, so the active pill
  reads as raised out of the group.

### Light Films
Separate from the palette and deliberately so: these are translucent white overlays that model
light falling on a surface, not colours with meaning. They are the only place raw white belongs
in this system.

- **Glass film** (`linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))`): the
  sheen on the glass material, paired with the blur and the inset hairline.
- **Cloud film** (`rgba(255,255,255,0.1)` fading to a blue tint): the faint atmospheric wash over
  the pitch board. Held very low; at higher alpha it washes out opponent markers, which has
  happened and been corrected.
- **Shimmer** (`rgba(255,255,255,0.85)`): the travelling highlight that sweeps a card's accent bar
  on hover. Momentary and always in motion, never a resting state.

### Named Rules
**The Glow-Not-Drop Rule.** Elevation on this ground is emitted light. Reach for a coloured glow
or an inset highlight before a cast shadow, and never use a black drop shadow to lift something
off a dark surface.

## Shapes

Two shape languages, split by function. Anything you press is a pill (`9999px`): CTAs, ghost
buttons, tab tracks, chips, pill selectors. Anything that holds content is softly rectangular:
cards at `0.5rem`, the pitch board at `0.75rem`, inputs and small action buttons at `0.375rem`.

Cutting across both is the instrument chrome, which is deliberately hard-edged: 14px L-shaped
corner brackets inset 8px from a panel's edges, and a 1px vertical tick ruler sitting 22px
outside the left edge with marks at its top and midpoint. These are never rounded. The tension
between soft containers and sharp measurement marks is the signature of the system.

## Components

### Buttons
- **Shape:** Fully rounded pill (`9999px`), minimum height `2.75rem` for touch.
- **Primary:** Cyan fill (`{colors.attack}`) with night-blue text (`{colors.night-950}`), mono
  uppercase at `0.1em` tracking, carrying the panel-lift glow.
- **Ghost:** Transparent with a `1px` touchline border at 50% alpha and touchline text, brightening
  to chalk on hover.
- **Action:** The compact `2.25rem` variant used inside tool panels (Play Designer, timelines).
  Rounded `0.375rem`, bordered, filling to `attack/15` with cyan text when armed.
- **Hover / Focus:** Buttons lift `1px` on hover. Focus is always a `2px` outline in
  `{colors.attack}` at `2px` offset, never a removed outline or a colour-only change.
- **Disabled:** 30% opacity with `cursor: not-allowed`; hover effects suppressed.

### Chips
- **Style:** Pill, `1px` border in the hue that carries the chip's meaning, transparent fill,
  hue-coloured mono label.
- **Selected:** The hue fills the pill and the label flips to `night-950`. A `press`-toned
  selection additionally fires one red pulse ring.

### Cards / Containers
- **Corner Style:** `0.5rem`.
- **Background:** `{colors.night-900}`, or the glass material on the largest reading surfaces.
- **Border:** `1px` touchline at 30% alpha.
- **Shadow Strategy:** Flat at rest. Cards that carry instrument chrome add corner brackets;
  cards that are pressable add a gradient hover border.
- **Internal Padding:** `1.5rem`, dropping to `1rem` in dense sidebars.

### Inputs / Fields
- **Style:** `{colors.night-900}` fill, `1px` touchline border at 40% alpha, `0.375rem` radius,
  `2.75rem` tall, mono uppercase text.
- **Focus:** The standard `2px` cyan outline at `2px` offset.
- **Disabled:** 50% opacity.

### Navigation
- **Style:** A fixed left rail on the glass material, 15rem wide, with the wordmark and pitch
  mark at the top and the account chip pinned to the bottom.
- **Links:** Mono uppercase at `0.15em` tracking with a 20px monochrome stroke icon. Default is
  touchline on a transparent border; hover raises to chalk on a faint touchline wash.
- **Active:** Cyan text on an `attack/10` fill inside an `attack/60` border, `0.5rem` radius.
- **Mobile:** Below `lg`, a sticky glass top bar with a hamburger opening an animated sheet
  carrying the same links.

### Instrument Chrome (signature)
The set that defines the world, applied to panels that present measured information:
`.telemetry-frame` establishes positioning, `.telemetry-corner` places 14px L-brackets at the
four corners, `.telemetry-ruler` hangs a ticked rule outside the left edge, and
`.telemetry-readout` prints a bordered strip of real values (formation name, player count) in
mono. Readouts carry data that exists. A decorative serial number is a violation.

### Chalk Atmosphere (signature)
A fixed, tilted ghost pitch behind every page with a hand-drawn chalk play that draws itself in
coaching order (defence, midfield, attack, connecting lines, opposition marks, passing lane,
runs) over a 22 second cycle before fading. Rendered with an SVG turbulence displacement filter
so the strokes wobble like chalk. Two slow light fields drift across it on 90 second-plus cycles.
Held at very low opacity: it must never compete with content, and it is frozen entirely under
`prefers-reduced-motion`.

## Do's and Don'ts

### Do:
- **Do** put `night-950` text on any cyan, blue, or red fill.
- **Do** reuse the existing token names when the palette changes, so component classes never churn.
- **Do** give every interactive element the standard `2px` cyan focus outline at `2px` offset.
- **Do** put real data in a `.telemetry-readout`; a readout is a measurement, not an ornament.
- **Do** keep the three hues to their fixed tactical meanings, including in new features.
- **Do** freeze ambient motion under `prefers-reduced-motion`; the atmosphere is already wired for
  it and new motion must be too.
- **Do** use a pill for anything pressable and a soft rectangle for anything that holds content.

### Don't:
- **Don't** use white text on a brand-hue fill. It fails contrast on all three.
- **Don't** reach for a black drop shadow to lift an element. Use the cyan glow or an inset
  highlight.
- **Don't** introduce a second display typeface. The retired serif hero is not a variant.
- **Don't** describe or rebuild this system as light-grounded. The pale-sky phase with amber
  `#8a5c12` is retired.
- **Don't** round the instrument chrome. Corner brackets and rulers are hard-edged on purpose.
- **Don't** add a fourth accent hue. A new concept borrows an existing meaning or stays neutral.
- **Don't** let the chalk atmosphere rise in opacity until it competes with the content in front
  of it; it has been dialled back twice already for exactly that reason.
