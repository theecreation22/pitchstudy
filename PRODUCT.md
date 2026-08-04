# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Five confirmed segments, served deliberately in parallel rather than one being primary:
- **New fans** — people new to watching football who want to follow tactics while watching a match.
- **Youth players (13–18)** and **amateur/Sunday league adults** — want position guides and workout plans to actually get better.
- **Entry-level coaches** — want clear formation explanations to teach their own teams.
- **Curious learners** — casual users exploring for its own sake.

The product deliberately does not subordinate one segment's needs to another's: Academy (tactics literacy), Training (position-specific fitness/skill work), and Tactics Lab (a sandbox tactics tool) are all built out as first-class, not as one flagship surface with the others as filler.

## Product Purpose

Teaches football (soccer) formations, positions, and tactics through a hands-on, visual interface, positioned against the fragmented state of football education online (scattered YouTube videos, blogs, forums) with no single structured "learn football" destination — the explicit comparison point is what Duolingo is for languages or Chess.com's lessons are for chess.

Success: a first-time visitor can explain the difference between a 4-3-3 and a 4-2-3-1 after one session; a youth player can find a workout plan for their position in under 2 minutes; users return to explore more (repeat visits).

## Positioning

Interactivity over articles: users manipulate formations on a virtual pitch, click into positions to explore them, build and test their own tactics in a sandbox, and follow structured training tied to the role they want to play — rather than reading static explainer content, which is what every existing competitor offers.

## Operating Context

Browser-based, mobile-responsive (used both one-handed while half-watching a match, and at a desk for deeper Tactics Lab / Academy sessions). Self-directed, solo use — no social, multiplayer, or forum layer. Accounts are optional and only add cross-device sync of progress, playbook, and player card; every core learning and building feature works fully as a guest with no account.

## Capabilities and Constraints

Shipped surfaces (well past the original MVP scope):
- **Academy** — a multi-module curriculum of lessons with end-of-module quizzes, tracked as progress/XP/badges.
- **Explore** and **Positions** — the position encyclopedia (role summary, strong suits, how to play it, related positions).
- **Managers** — profiles of influential managers: tactical philosophy in original wording, notable teams, a linked "signature formation" viewable on the pitch tool, plus era timeline and challenge questions.
- **Training (Workouts)** — position-specific workout plans with a session mode, completion checklist, and a first-run "Trial Day" onboarding flow.
- **Challenge** — a distinct scored/streak mode separate from Academy quizzes.
- **Tactics Lab** — the sandbox: Formation Designer, Play Designer, Scenario Mode (with an opponent-formation overlay and tactical-balance scoring), and a Playbook to save/browse custom formations and plays.
- **Accounts ("Join the Club")** — optional, via Supabase: Google OAuth or username+password, magic-link login, an admin dashboard (usage stats, registered-user list) gated to one operator email.

Hard legal constraints (non-negotiable, not stylistic):
- No real player names, likenesses, club crests, kits, or league logos anywhere — role labels (e.g., "LW," "CDM") and generic/abstract markers only.
- All written content (position descriptions, manager tactical analysis, drills) must be original wording — never paraphrase-copied from an existing source.
- Manager profiles: factual/biographical information and original tactical analysis only, no implied endorsement, no paparazzi/agency photos.
- Workout/training content must carry a general-fitness disclaimer — not medical advice.

Explicitly undecided (do not invent an answer):
- Monetization model (free / ad-supported / freemium premium plans / sponsorships) — no monetization feature has been built.
- Football vs. "soccer" terminology by visitor region — not built; the site currently defaults to "football" throughout (an implementation fact, not a confirmed product decision).

## Brand Commitments

Name: **PitchStudy**, live at pitchstudy.com. Site voice leans into football-club culture in its UX copy (e.g., "Join the Club," "Training Ground," "Trial Day," squad numbers) rather than generic SaaS phrasing — an established, binding voice choice, not open for reinterpretation without discussion.

## Evidence on Hand

The Academy curriculum, manager profiles, position pages, and workout plans are real, original, already-written content in the live product (not placeholders) — dozens of managers and a full multi-module lesson set with quizzes. No user-facing testimonials, case studies, press, or third-party metrics exist yet; future work must not fabricate any.

## Product Principles

1. Interactivity is the differentiator — every major surface (pitch, Tactics Lab, checklists) invites manipulation, not just reading.
2. Legal-safe abstraction is absolute — no real club/player IP, ever, regardless of how much more "authentic" it would look.
3. Accounts are additive, never gating — guest mode is a fully real, permanent mode, not a nag-to-register funnel.
4. Originality of written content is enforced, not assumed — facts can be reused, phrasing cannot.
5. Built for a dual audience on purpose — new fans and aspiring players/coaches are both primary, not one primary and one secondary.

## Accessibility & Inclusion

WCAG 2.1 AA is a confirmed requirement, including full keyboard navigation of interactive pitch markers (not just mouse/touch drag) — verified and actively maintained via a dedicated accessibility audit pass (focus-visible states, contrast, keyboard nudge controls on pitch markers, labelled form fields).
