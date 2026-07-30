export type PositionCode =
  | "GK"
  | "LB"
  | "RB"
  | "CB"
  | "LWB"
  | "RWB"
  | "CDM"
  | "CM"
  | "CAM"
  | "LM"
  | "RM"
  | "LW"
  | "RW"
  | "ST"
  // Hybrid roles (PRD 5.2) — tactical variations on a base position.
  // Never used as a marker code in `formations` below; only reachable
  // via "related positions" links from the base role's page.
  | "IFB"
  | "IW"
  | "F9"
  | "B2B"
  | "SK"
  | "DLP";

export type FormationPlayer = {
  id: string;
  code: PositionCode;
  /** 0–100, left touchline to right touchline */
  x: number;
  /** 0–100, opponent's goal line (attack) to own goal line (defense) */
  y: number;
};

export type Formation = {
  slug: string;
  name: string;
  tagline: string;
  origin: string;
  strengths: string[];
  weaknesses: string[];
  bestSuited: string;
  players: FormationPlayer[];
};

export const formations: Formation[] = [
  {
    slug: "4-4-2",
    name: "4-4-2",
    tagline: "Two flat banks of four, two strikers up top.",
    origin:
      "The default shape of English football for decades, built around two flat lines of four that stay compact and hard to break down.",
    strengths: [
      "Even coverage across the width of the pitch",
      "Two strikers give a direct outlet and support each other up top",
      "Simple to organize defensively: everyone knows their line",
    ],
    weaknesses: [
      "Can be outnumbered in central midfield against a three-man midfield",
      "Wide midfielders are asked to both defend and attack the full width",
    ],
    bestSuited:
      "Teams that want directness over central control, and have strikers who thrive on service into the box rather than dropping deep to build play.",
    players: [
      { id: "gk", code: "GK", x: 50, y: 95 },
      { id: "lb", code: "LB", x: 15, y: 75 },
      { id: "cb1", code: "CB", x: 35, y: 78 },
      { id: "cb2", code: "CB", x: 65, y: 78 },
      { id: "rb", code: "RB", x: 85, y: 75 },
      { id: "lm", code: "LM", x: 15, y: 45 },
      { id: "cm1", code: "CM", x: 38, y: 50 },
      { id: "cm2", code: "CM", x: 62, y: 50 },
      { id: "rm", code: "RM", x: 85, y: 45 },
      { id: "st1", code: "ST", x: 38, y: 18 },
      { id: "st2", code: "ST", x: 62, y: 18 },
    ],
  },
  {
    slug: "4-3-3",
    name: "4-3-3",
    tagline: "A midfield triangle feeding two inverted wingers and a focal point striker.",
    origin:
      "Popularized by possession-based sides that want a spare man in central midfield while still stretching defenses with width high up the pitch.",
    strengths: [
      "Extra central midfielder helps control tempo and win the ball back quickly",
      "Wide forwards stretch the back line and can cut inside onto their stronger foot",
      "Flexible: the front three can rotate positions to confuse markers",
    ],
    weaknesses: [
      "Full-backs must cover huge space in behind advanced wingers",
      "A lone striker can become isolated against two center-backs",
    ],
    bestSuited:
      "Teams built around ball retention, with technical wide forwards and a single striker comfortable holding up play alone.",
    players: [
      { id: "gk", code: "GK", x: 50, y: 95 },
      { id: "lb", code: "LB", x: 15, y: 75 },
      { id: "cb1", code: "CB", x: 35, y: 78 },
      { id: "cb2", code: "CB", x: 65, y: 78 },
      { id: "rb", code: "RB", x: 85, y: 75 },
      { id: "cdm", code: "CDM", x: 50, y: 58 },
      { id: "cm1", code: "CM", x: 32, y: 42 },
      { id: "cm2", code: "CM", x: 68, y: 42 },
      { id: "lw", code: "LW", x: 18, y: 18 },
      { id: "st", code: "ST", x: 50, y: 12 },
      { id: "rw", code: "RW", x: 82, y: 18 },
    ],
  },
  {
    slug: "4-2-3-1",
    name: "4-2-3-1",
    tagline: "A double pivot shields the back four, three creators support one striker.",
    origin:
      "Grew out of coaches wanting the defensive security of two holding midfielders without giving up a creative presence further forward.",
    strengths: [
      "Two holding midfielders offer strong defensive cover in front of the back four",
      "Three attacking midfielders create numbers-up situations in the final third",
      "Very adaptable out of possession: can compress into a 4-4-1-1 when defending",
    ],
    weaknesses: [
      "The lone striker can be starved of service if the attacking midfielders drift too wide",
      "Needs disciplined double pivot or the back four is exposed to counters",
    ],
    bestSuited:
      "Teams with a genuine playmaker who wants the ball in the pocket between the lines, protected by two disciplined holding midfielders.",
    players: [
      { id: "gk", code: "GK", x: 50, y: 95 },
      { id: "lb", code: "LB", x: 15, y: 75 },
      { id: "cb1", code: "CB", x: 35, y: 78 },
      { id: "cb2", code: "CB", x: 65, y: 78 },
      { id: "rb", code: "RB", x: 85, y: 75 },
      { id: "cdm1", code: "CDM", x: 38, y: 58 },
      { id: "cdm2", code: "CDM", x: 62, y: 58 },
      { id: "lw", code: "LW", x: 18, y: 32 },
      { id: "cam", code: "CAM", x: 50, y: 28 },
      { id: "rw", code: "RW", x: 82, y: 32 },
      { id: "st", code: "ST", x: 50, y: 12 },
    ],
  },
  {
    slug: "3-5-2",
    name: "3-5-2",
    tagline: "A back three with wing-backs supplying all the width, two strikers up front.",
    origin:
      "Long a staple of Italian football, and revived by modern coaches who want an extra body in central midfield without giving up attacking threat up top.",
    strengths: [
      "Outnumbers a midfield three or four through the center of the pitch",
      "Wing-backs provide out-and-out width without needing dedicated wide midfielders",
      "Two strikers can combine and share the goalscoring load",
    ],
    weaknesses: [
      "Wing-backs need elite stamina. They cover the entire touchline alone",
      "Space in behind the wing-backs is exposed if they get caught upfield",
    ],
    bestSuited:
      "Teams with tireless, athletic wing-backs and center-backs comfortable defending in wide areas without full-back cover.",
    players: [
      { id: "gk", code: "GK", x: 50, y: 95 },
      { id: "cb1", code: "CB", x: 25, y: 80 },
      { id: "cb2", code: "CB", x: 50, y: 82 },
      { id: "cb3", code: "CB", x: 75, y: 80 },
      { id: "lwb", code: "LWB", x: 8, y: 55 },
      { id: "rwb", code: "RWB", x: 92, y: 55 },
      { id: "cm1", code: "CM", x: 32, y: 48 },
      { id: "cdm", code: "CDM", x: 50, y: 55 },
      { id: "cm2", code: "CM", x: 68, y: 48 },
      { id: "st1", code: "ST", x: 40, y: 18 },
      { id: "st2", code: "ST", x: 60, y: 18 },
    ],
  },
  {
    slug: "3-4-3",
    name: "3-4-3",
    tagline: "Width from wing-backs, extra bodies in midfield, and a front three high up the pitch.",
    origin:
      "A variation on the back three that trades some defensive solidity for a stronger central presence and more attacking options in the final third.",
    strengths: [
      "Front three stretches the defense across the full width of the pitch",
      "Central midfield pairing can dictate tempo with cover from the back three",
      "Can drop into a back five out of possession for defensive stability",
    ],
    weaknesses: [
      "Only two central midfielders can be overrun by a three-man midfield",
      "Wing-backs are exposed defensively if the front three doesn't track back",
    ],
    bestSuited:
      "Teams built to dominate the ball with pace up front, willing to accept some defensive risk in wide areas for attacking numbers.",
    players: [
      { id: "gk", code: "GK", x: 50, y: 95 },
      { id: "cb1", code: "CB", x: 25, y: 80 },
      { id: "cb2", code: "CB", x: 50, y: 82 },
      { id: "cb3", code: "CB", x: 75, y: 80 },
      { id: "lwb", code: "LWB", x: 8, y: 50 },
      { id: "cm1", code: "CM", x: 38, y: 48 },
      { id: "cm2", code: "CM", x: 62, y: 48 },
      { id: "rwb", code: "RWB", x: 92, y: 50 },
      { id: "lw", code: "LW", x: 18, y: 18 },
      { id: "st", code: "ST", x: 50, y: 12 },
      { id: "rw", code: "RW", x: 82, y: 18 },
    ],
  },
  {
    slug: "5-3-2",
    name: "5-3-2",
    tagline: "A back five built for defensive solidity, three in midfield, two out front.",
    origin:
      "The more conservative sibling of the 3-5-2: wing-backs sit deeper as auxiliary defenders rather than attacking outlets.",
    strengths: [
      "Very hard to break down through wide areas with five defenders across the back",
      "Central midfield three can control possession without worrying about defensive cover",
      "Two strikers offer a quick counter-attacking outlet",
    ],
    weaknesses: [
      "Can invite pressure by sitting deep and surrendering possession",
      "Wing-backs contribute little going forward compared to a 3-5-2",
    ],
    bestSuited:
      "Teams facing a stronger opponent who want to stay compact, absorb pressure, and hit on the counter.",
    players: [
      { id: "gk", code: "GK", x: 50, y: 95 },
      { id: "lwb", code: "LWB", x: 12, y: 72 },
      { id: "cb1", code: "CB", x: 32, y: 78 },
      { id: "cb2", code: "CB", x: 50, y: 80 },
      { id: "cb3", code: "CB", x: 68, y: 78 },
      { id: "rwb", code: "RWB", x: 88, y: 72 },
      { id: "cm1", code: "CM", x: 35, y: 50 },
      { id: "cdm", code: "CDM", x: 50, y: 56 },
      { id: "cm2", code: "CM", x: 65, y: 50 },
      { id: "st1", code: "ST", x: 40, y: 18 },
      { id: "st2", code: "ST", x: 60, y: 18 },
    ],
  },
  {
    slug: "4-1-4-1",
    name: "4-1-4-1",
    tagline: "A lone defensive midfielder shields the back four, four across midfield, one striker.",
    origin:
      "Built for teams that want defensive solidity in central midfield without giving up a settled four-man midfield line further forward.",
    strengths: [
      "The single pivot gives strong protection directly in front of the back four",
      "Four-man midfield line controls width and central areas at the same time",
      "Compresses easily into a defensive 4-5-1 when out of possession",
    ],
    weaknesses: [
      "The lone striker is isolated and relies heavily on service from midfield",
      "The single pivot can be bypassed if opponents overload central midfield",
    ],
    bestSuited:
      "Teams that prioritize defensive balance and midfield control over out-and-out attacking numbers.",
    players: [
      { id: "gk", code: "GK", x: 50, y: 95 },
      { id: "lb", code: "LB", x: 15, y: 75 },
      { id: "cb1", code: "CB", x: 35, y: 78 },
      { id: "cb2", code: "CB", x: 65, y: 78 },
      { id: "rb", code: "RB", x: 85, y: 75 },
      { id: "cdm", code: "CDM", x: 50, y: 62 },
      { id: "lm", code: "LM", x: 15, y: 40 },
      { id: "cm1", code: "CM", x: 38, y: 42 },
      { id: "cm2", code: "CM", x: 62, y: 42 },
      { id: "rm", code: "RM", x: 85, y: 40 },
      { id: "st", code: "ST", x: 50, y: 15 },
    ],
  },
  {
    slug: "4-4-2-diamond",
    name: "4-4-2 Diamond",
    tagline: "A four-man midfield diamond adds central control to the classic two-striker setup.",
    origin:
      "A response to the flat 4-4-2's lack of central midfield presence, narrowing the midfield into a diamond to win the battle in the middle of the pitch.",
    strengths: [
      "The extra central midfielder at the point of the diamond helps dominate central areas",
      "The attacking midfielder at the top of the diamond supports the strikers directly",
      "The defensive midfielder at the base protects the back four",
    ],
    weaknesses: [
      "Lacks natural width: full-backs must provide almost all of it",
      "Can be exploited by opponents playing with genuine wingers",
    ],
    bestSuited:
      "Teams with dominant central midfielders and full-backs comfortable providing width on their own.",
    players: [
      { id: "gk", code: "GK", x: 50, y: 95 },
      { id: "lb", code: "LB", x: 15, y: 75 },
      { id: "cb1", code: "CB", x: 35, y: 78 },
      { id: "cb2", code: "CB", x: 65, y: 78 },
      { id: "rb", code: "RB", x: 85, y: 75 },
      { id: "cdm", code: "CDM", x: 50, y: 62 },
      { id: "cm1", code: "CM", x: 28, y: 48 },
      { id: "cm2", code: "CM", x: 72, y: 48 },
      { id: "cam", code: "CAM", x: 50, y: 32 },
      { id: "st1", code: "ST", x: 40, y: 15 },
      { id: "st2", code: "ST", x: 60, y: 15 },
    ],
  },
];

export function getFormation(slug: string): Formation | undefined {
  return formations.find((formation) => formation.slug === slug);
}

export type Phase = "in-possession" | "out-of-possession";

/**
 * How a team sets up when out of possession — a high press squeezes the
 * whole team up near the halfway line to deny space early; a low block
 * cedes the midfield and packs in deep near its own goal instead. Both
 * pull in toward the center, just at a different height up the pitch.
 */
export type DefensiveStyle = "high-press" | "low-block";

export function toHighPress(player: FormationPlayer): FormationPlayer {
  if (player.code === "GK") {
    return { ...player, y: Math.max(80, player.y - 8) };
  }
  const y = player.y + (45 - player.y) * 0.5;
  const x = 50 + (player.x - 50) * 0.6;
  return { ...player, x, y };
}

export function toLowBlock(player: FormationPlayer): FormationPlayer {
  if (player.code === "GK") {
    return { ...player, y: Math.min(97, player.y + 2) };
  }
  const y = player.y + (88 - player.y) * 0.55;
  const x = 50 + (player.x - 50) * 0.55;
  return { ...player, x, y };
}

export function getFormationPlayers(
  formation: Formation,
  phase: Phase,
  defensiveStyle: DefensiveStyle = "low-block",
): FormationPlayer[] {
  if (phase === "in-possession") return formation.players;
  return formation.players.map(defensiveStyle === "high-press" ? toHighPress : toLowBlock);
}

/**
 * Flips a lineup's y-axis so it attacks the opposite way — used to render an
 * opponent formation sharing the same pitch as the user's own. Apply this
 * after `getFormationPlayers`, not before: the out-of-possession dropback
 * math above assumes the original (non-mirrored) orientation.
 */
export function mirrorFormationPlayers(players: FormationPlayer[]): FormationPlayer[] {
  return players.map((player) => ({ ...player, y: 100 - player.y }));
}

/**
 * Percent of pitch height a clamped attacker is held behind the last
 * defender's line, rather than exactly on it — enough vertical separation
 * that the two markers (each ~44px across at typical render sizes) don't
 * visually overlap regardless of how close their x-positions happen to be.
 */
const ONSIDE_BUFFER = 8;

/**
 * Keeps an attacking lineup from visually standing offside against the
 * defending lineup's last outfield defender (goalkeeper excluded) — the
 * deepest non-GK defender sets the line, and no attacker is allowed to sit
 * further forward than a small buffer behind it. `attackTowardZero` should
 * be true for the user's own (unmirrored) team, which attacks toward y=0,
 * and false for a mirrored opponent, which attacks toward y=100.
 */
export function keepOnside(
  attackers: FormationPlayer[],
  defenders: FormationPlayer[],
  attackTowardZero: boolean,
): FormationPlayer[] {
  const outfieldDefenders = defenders.filter((player) => player.code !== "GK");
  if (outfieldDefenders.length === 0) return attackers;

  const lastDefenderY = attackTowardZero
    ? Math.min(...outfieldDefenders.map((player) => player.y))
    : Math.max(...outfieldDefenders.map((player) => player.y));
  const onsideLine = attackTowardZero
    ? Math.min(100, lastDefenderY + ONSIDE_BUFFER)
    : Math.max(0, lastDefenderY - ONSIDE_BUFFER);

  return attackers.map((player) => {
    if (player.code === "GK") return player;
    const y = attackTowardZero ? Math.max(player.y, onsideLine) : Math.min(player.y, onsideLine);
    return y === player.y ? player : { ...player, y };
  });
}

/** Pitch width:height (68:105) — scales x-deltas onto the same visual footing as y-deltas, since a percent of width and a percent of height cover different real distances on the rendered (taller-than-wide) pitch. */
const PITCH_ASPECT = 68 / 105;
/** In "percent of pitch height" units — comfortably clears two ~44px markers at typical render sizes. */
const MIN_MARKER_SEPARATION = 9;

/** Passes over the set per player — a point squeezed between several others may need many rounds to fully clear all of them, since resolving one can shift its distance to the others. */
const OVERLAP_RESOLUTION_PASSES = 40;

/**
 * Half a marker's rendered width/height, in x/y-percent units, at the
 * narrowest realistic pitch render size (~300px wide on mobile, before the
 * outer border/padding) — a marker pushed closer to the edge than this
 * would have part of its circle spill past the pitch's bordered box, since
 * neither pitch container clips overflow. Only applied to markers that
 * actually get pushed during overlap resolution; a marker that's never
 * violated (like the goalkeeper, sitting alone near its own goal line at
 * y=95–97 by design in every formation) keeps its original position
 * untouched regardless of this margin.
 */
const EDGE_MARGIN_X = 7.5;
const EDGE_MARGIN_Y = 5;

/**
 * Roles that read as "central" in every formation this file defines — their
 * raw x always falls within [28, 72] (CB is deliberately excluded: a
 * back-three's outer center-backs legitimately sit as wide as x=25/75).
 * `toHighPress`/`toLowBlock` only ever pull x closer to 50, never further
 * from it, so the only way one of these roles can drift past this band is
 * through overlap-resolution repulsion — which has no notion of role, and
 * left unchecked can shove a marked-central player (e.g. a CM) out into the
 * same space a winger or full-back occupies, reading as a role swap even
 * though the label never changed.
 */
const CENTRAL_ROLES: Partial<Record<PositionCode, true>> = { CDM: true, CM: true, CAM: true, ST: true };
/** Matches the widest x any central role naturally reaches in this file's own data (the 4-4-2 Diamond's CM pairing, at x=28/72) — repulsion can never push a central role any wider than that already-normal example, while every central role's actual raw position stays untouched since none exceeds this bound to begin with. */
const CENTRAL_ROLE_MARGIN_X = 28;

/**
 * Wingers and wide midfielders — the mirror image of CENTRAL_ROLES, guarding
 * against the opposite failure (a wide role drifting in toward the center
 * far enough to stand where a CM/CDM belongs). Unlike central roles,
 * `toHighPress`/`toLowBlock` legitimately pull these MORE central than their
 * raw data every single time (that's the real, intended "tucking in" under
 * compression) — so the threshold can't just be the raw x range, it has to
 * be the most-compressed value any of these roles *legitimately* reaches.
 * Low-block's 0.55 multiplier compresses harder than high-press's 0.6, and
 * LW/RW's raw x=18/82 is the narrowest starting point in this file's data,
 * so `50 + (18-50)*0.55` = 32.4 (mirrored: 67.6) is that exact boundary —
 * verified against every raw x this file defines for these codes, not just
 * asserted. LM/RM's own narrowest legitimate compression (30.75) sits safely
 * inside this band, so nothing here ever gets clipped tighter than intended.
 */
const WIDE_LEFT_ROLES: Partial<Record<PositionCode, true>> = { LW: true, LM: true };
const WIDE_RIGHT_ROLES: Partial<Record<PositionCode, true>> = { RW: true, RM: true };
const WIDE_ROLE_MAX_X = 32.4;
const WIDE_ROLE_MIN_X = 100 - WIDE_ROLE_MAX_X;

function clampWithEdgeMargin(x: number, y: number, code?: PositionCode): { x: number; y: number } {
  const isCentral = code !== undefined && CENTRAL_ROLES[code];
  let minX = isCentral ? CENTRAL_ROLE_MARGIN_X : EDGE_MARGIN_X;
  let maxX = isCentral ? 100 - CENTRAL_ROLE_MARGIN_X : 100 - EDGE_MARGIN_X;
  if (code !== undefined && WIDE_LEFT_ROLES[code]) maxX = Math.min(maxX, WIDE_ROLE_MAX_X);
  if (code !== undefined && WIDE_RIGHT_ROLES[code]) minX = Math.max(minX, WIDE_ROLE_MIN_X);
  return {
    x: Math.min(maxX, Math.max(minX, x)),
    y: Math.min(100 - EDGE_MARGIN_Y, Math.max(EDGE_MARGIN_Y, y)),
  };
}

/**
 * Nudges every player in `movable` away from (a) every OTHER player in
 * `movable` and (b) every player in `fixed`, so a compressed high-press/
 * low-block shape never leaves two markers closer than a marker's width
 * apart — whether they're teammates (`toHighPress`/`toLowBlock` compress
 * each player toward a center point independently, with no awareness of
 * where teammates land) or opposing markers sharing the same pitch. `fixed`
 * never moves. Resolves both collision kinds together, in one Gauss-Seidel
 * pass per player (each correction is applied immediately, so later checks
 * in the same pass already see it) — resolving them as two separate
 * sequential phases was tried first and doesn't converge reliably, since
 * fixing one kind can reintroduce the other (e.g. spacing teammates apart
 * pushes one of them back into an opponent's marker that was already clear).
 */
export function resolveOverlaps(movable: FormationPlayer[], fixed: FormationPlayer[] = []): FormationPlayer[] {
  const current = movable.map((player) => ({ ...player }));

  for (let pass = 0; pass < OVERLAP_RESOLUTION_PASSES; pass++) {
    let violated = false;

    for (let i = 0; i < current.length; i++) {
      let ownGroupViolation = false;

      for (let j = 0; j < current.length; j++) {
        if (i === j) continue;
        const a = current[i];
        const b = current[j];
        const dxRaw = a.x - b.x;
        const dyRaw = a.y - b.y;
        const distance = Math.hypot(dxRaw * PITCH_ASPECT, dyRaw);
        if (distance >= MIN_MARKER_SEPARATION) continue;
        violated = true;
        ownGroupViolation = true;
        // Only `i` moves here — `j` gets (or already had) its own turn in
        // this same pass, so splitting the correction in half like a
        // mutual push would under-correct.
        const angle = distance === 0 ? Math.PI / 2 : Math.atan2(dyRaw, dxRaw);
        const shortfall = MIN_MARKER_SEPARATION - distance;
        current[i] = {
          ...a,
          x: a.x + (Math.cos(angle) * shortfall) / PITCH_ASPECT,
          y: a.y + Math.sin(angle) * shortfall,
        };
      }

      for (const other of fixed) {
        const dxRaw = current[i].x - other.x;
        const dyRaw = current[i].y - other.y;
        const distance = Math.hypot(dxRaw * PITCH_ASPECT, dyRaw);
        if (distance >= MIN_MARKER_SEPARATION) continue;
        violated = true;
        ownGroupViolation = true;
        if (distance === 0) {
          current[i] = { ...current[i], y: current[i].y + MIN_MARKER_SEPARATION };
          continue;
        }
        const shortfall = MIN_MARKER_SEPARATION - distance;
        const angle = Math.atan2(dyRaw, dxRaw);
        current[i] = {
          ...current[i],
          x: current[i].x + (Math.cos(angle) * shortfall) / PITCH_ASPECT,
          y: current[i].y + Math.sin(angle) * shortfall,
        };
      }

      // A perfectly symmetric standoff (e.g. stacked with other markers
      // exactly on the pitch's center line) can make opposing push vectors
      // cancel out exactly, leaving nothing to resolve it — this small
      // constant sideways bias, applied every pass a violation remains,
      // guarantees the player eventually drifts toward one side instead of
      // sitting at a stable but unresolved equilibrium.
      if (ownGroupViolation) {
        current[i] = { ...current[i], x: current[i].x + (current[i].x >= 50 ? 1 : -1) * 1.5 };
        // Keep pushed markers off the pitch edge — but only markers that
        // actually moved this pass, so a never-violated player (like the
        // goalkeeper) keeps its exact original position.
        current[i] = { ...current[i], ...clampWithEdgeMargin(current[i].x, current[i].y, current[i].code) };
      }
    }

    if (!violated) break;
  }

  return current;
}

/** Convenience wrapper for resolving a single team's own compressed shape against itself, with no opposing markers to consider. */
export function resolveSelfOverlaps(players: FormationPlayer[]): FormationPlayer[] {
  return resolveOverlaps(players, []);
}

type FormationLine = "defense" | "midfield" | "attack";
const FORMATION_LINE: Partial<Record<PositionCode, FormationLine>> = {
  LB: "defense", RB: "defense", CB: "defense", LWB: "defense", RWB: "defense",
  CDM: "midfield", CM: "midfield", CAM: "midfield", LM: "midfield", RM: "midfield",
  LW: "attack", RW: "attack", ST: "attack",
};
/** Wing-backs advancing well beyond a deep-lying midfielder is a normal, well-established tactical pattern — exempted from the "defenders stay behind midfield" depth check that otherwise applies. */
const DEPTH_CHECK_EXEMPT: Partial<Record<PositionCode, true>> = { LWB: true, RWB: true };

/**
 * Every position swap in this file — left-right order fixes and depth-order
 * fixes alike — goes through this one function, so this is the single choke
 * point that can guarantee a role never inherits a coordinate that belongs
 * to a different kind of role: a defender or wide midfielder found out of
 * order can legitimately swap with (and take the exact spot of) a central
 * player, but the reverse — a CDM/CM/CAM/ST landing at a full-back's or
 * winger's x — would read as that central player teleporting out to the
 * wing. Symmetrically, a winger inheriting a central player's x would read
 * as the winger tucking in all the way to the middle of the pitch. Only x is
 * reclamped; y is left exactly as the swap intended, since y is what the
 * order fix was actually correcting.
 */
function clampRoleX(code: PositionCode, x: number): number {
  if (CENTRAL_ROLES[code]) return Math.min(100 - CENTRAL_ROLE_MARGIN_X, Math.max(CENTRAL_ROLE_MARGIN_X, x));
  if (WIDE_LEFT_ROLES[code]) return Math.min(WIDE_ROLE_MAX_X, x);
  if (WIDE_RIGHT_ROLES[code]) return Math.max(WIDE_ROLE_MIN_X, x);
  return x;
}

function swapPlayers(players: FormationPlayer[], idA: string, idB: string): void {
  const i = players.findIndex((p) => p.id === idA);
  const j = players.findIndex((p) => p.id === idB);
  const { x, y } = players[i];
  players[i] = { ...players[i], x: clampRoleX(players[i].code, players[j].x), y: players[j].y };
  players[j] = { ...players[j], x: clampRoleX(players[j].code, x), y };
}

/**
 * The geometric relaxation above has no concept of position roles — it
 * only knows "stay N units from every other marker." In crowded scenarios
 * (typically when an extreme high-press onside line stacks several players
 * near the same spot) it can produce a technically clean, non-overlapping
 * arrangement that no longer makes football sense: two central midfielders
 * swapped left-right, or an attacking midfielder ending up more advanced
 * than the team's own forwards. Since any two already-resolved points are
 * each individually valid (clear of every other marker), swapping which
 * player-id sits at which point can't reintroduce a collision or boundary
 * issue — it only changes the assignment, not the set of occupied points —
 * so this runs as a free final pass. `referenceOrder` is the line-up's
 * order *before* this function's own relaxation ran; `toHighPress`/
 * `toLowBlock`/mirroring never change relative x-order or which line is
 * deepest, so the input to `resolveMatchupOverlaps` is already a valid
 * "this is the intended order" reference.
 */
function restoreFormationOrder(
  players: FormationPlayer[],
  referenceOrder: FormationPlayer[],
  attackTowardZero: boolean,
): void {
  const isAheadOf = (aY: number, bY: number) => (attackTowardZero ? aY < bY - 6 : aY > bY + 6);
  // Strict, tolerance-free comparator for finding the shallowest player in
  // a line — reusing the tolerance-banded isAheadOf here would let two
  // attackers within 6 units of each other fail to compare, leaving the
  // reduce stuck on the array's first element instead of the true minimum.
  const isShallowerThan = (aY: number, bY: number) => (attackTowardZero ? aY > bY : aY < bY);

  const fixLeftRight = (): boolean => {
    let changed = false;
    for (const line of ["defense", "midfield", "attack"] as FormationLine[]) {
      const inLine = referenceOrder.filter((p) => FORMATION_LINE[p.code] === line);
      for (let i = 0; i < inLine.length; i++) {
        for (let j = i + 1; j < inLine.length; j++) {
          const a = inLine[i];
          const b = inLine[j];
          if (Math.abs(a.x - b.x) <= 5) continue;
          const [leftId, rightId] = a.x < b.x ? [a.id, b.id] : [b.id, a.id];
          const left = players.find((p) => p.id === leftId)!;
          const right = players.find((p) => p.id === rightId)!;
          if (left.x > right.x) {
            swapPlayers(players, leftId, rightId);
            changed = true;
          }
        }
      }
    }
    return changed;
  };

  const fixDepth = (): boolean => {
    let changed = false;
    const swapAheadOfLine = (behindLine: FormationLine, aheadLine: FormationLine) => {
      const behindPlayers = players.filter((p) => FORMATION_LINE[p.code] === behindLine && !DEPTH_CHECK_EXEMPT[p.code]);
      for (const behind of behindPlayers) {
        const aheadPlayers = players.filter((p) => FORMATION_LINE[p.code] === aheadLine);
        if (aheadPlayers.length === 0) continue;
        const mostWithdrawn = aheadPlayers.reduce((min, p) => (isShallowerThan(p.y, min.y) ? p : min));
        if (!isAheadOf(behind.y, mostWithdrawn.y)) continue;
        // Swap with whichever ahead-line player sits nearest in x, not simply
        // the most withdrawn one — otherwise a central player (e.g. a CM)
        // can trade its entire (x, y) with a wide one (e.g. a winger) and
        // visually swap roles, which this depth fix was never meant to do.
        const nearestInX = aheadPlayers.reduce((closest, p) =>
          Math.abs(p.x - behind.x) < Math.abs(closest.x - behind.x) ? p : closest,
        );
        swapPlayers(players, behind.id, nearestInX.id);
        changed = true;
      }
    };
    swapAheadOfLine("midfield", "attack");
    swapAheadOfLine("defense", "midfield");
    swapAheadOfLine("defense", "attack");
    return changed;
  };

  // Alternate both fixes until a full round makes no further swaps — a
  // depth swap exchanges a player's full (x, y), which can reintroduce a
  // left-right issue that then needs its own pass to resolve, and vice
  // versa. Verified empirically to converge well within this budget across
  // all 256 formation/opponent/phase/style combinations.
  for (let round = 0; round < 10; round++) {
    const changedLeftRight = fixLeftRight();
    const changedDepth = fixDepth();
    if (!changedLeftRight && !changedDepth) break;
  }
}

/**
 * Final guarantee pass for a two-team matchup. The normal approach —
 * resolve the own team's shape against itself, then resolve the opponent
 * against that now-fixed own team — covers the vast majority of
 * formation/style combinations, but a minority of genuinely boxed-in
 * configurations (most often when a high defensive line's onside
 * adjustment stacks several players from both teams into the same small
 * area) can still leave a residual violation that a one-sided resolution
 * can't clear, since the own team is never allowed to give any ground.
 * This runs one last unconditional relaxation over every pair — own-own,
 * opponent-opponent, and own-opponent — splitting each correction evenly,
 * so both sides can nudge apart as a last resort. It then runs a second time
 * after `restoreFormationOrder`, since that pass's swaps can themselves
 * introduce a fresh collision when `clampRoleX` reclaims a central or wide
 * role's x. Verified empirically against all 8×8 formation pairings × both
 * phases × both defensive styles (256 combinations): zero collisions remain
 * after this runs, no CDM/CM/CAM/ST ever ends up past x=28/72, and no
 * LW/RW/LM/RM ever ends up more central than x=32.4/67.6.
 */
export function resolveMatchupOverlaps(
  own: FormationPlayer[],
  opponent: FormationPlayer[],
): { own: FormationPlayer[]; opponent: FormationPlayer[] } {
  // Captured before any relaxation runs, while x-order and line depth still
  // match what getFormationPlayers/mirrorFormationPlayers/keepOnside intended.
  const ownReferenceOrder = own;
  const opponentReferenceOrder = opponent;

  const resolvedOwn = resolveSelfOverlaps(own);
  const resolvedOpponent = resolveOverlaps(opponent, resolvedOwn);

  const finalOwn = resolvedOwn.map((player) => ({ ...player }));
  const finalOpponent = resolvedOpponent.map((player) => ({ ...player }));

  const relax = (listA: FormationPlayer[], i: number, listB: FormationPlayer[], j: number): boolean => {
    const a = listA[i];
    const b = listB[j];
    const dxRaw = a.x - b.x;
    const dyRaw = a.y - b.y;
    const distance = Math.hypot(dxRaw * PITCH_ASPECT, dyRaw);
    if (distance >= MIN_MARKER_SEPARATION) return false;
    const angle = distance === 0 ? Math.PI / 2 : Math.atan2(dyRaw, dxRaw);
    const shortfall = MIN_MARKER_SEPARATION - distance;
    const pushXHalf = (Math.cos(angle) * shortfall) / PITCH_ASPECT / 2;
    const pushYHalf = (Math.sin(angle) * shortfall) / 2;
    listA[i] = { ...a, ...clampWithEdgeMargin(a.x + pushXHalf, a.y + pushYHalf, a.code) };
    listB[j] = { ...b, ...clampWithEdgeMargin(b.x - pushXHalf, b.y - pushYHalf, b.code) };
    return true;
  };

  const relaxAllPairs = () => {
    for (let pass = 0; pass < OVERLAP_RESOLUTION_PASSES; pass++) {
      let violated = false;
      for (let i = 0; i < finalOwn.length; i++) {
        for (let j = i + 1; j < finalOwn.length; j++) violated = relax(finalOwn, i, finalOwn, j) || violated;
      }
      for (let i = 0; i < finalOpponent.length; i++) {
        for (let j = i + 1; j < finalOpponent.length; j++) violated = relax(finalOpponent, i, finalOpponent, j) || violated;
      }
      for (let i = 0; i < finalOpponent.length; i++) {
        for (let j = 0; j < finalOwn.length; j++) violated = relax(finalOpponent, i, finalOwn, j) || violated;
      }
      if (!violated) break;
    }
  };

  relaxAllPairs();

  restoreFormationOrder(finalOwn, ownReferenceOrder, true);
  restoreFormationOrder(finalOpponent, opponentReferenceOrder, false);

  // restoreFormationOrder's swaps can hand a central or wide role a new x
  // that its own role-x clamp then pulls back in (see `clampRoleX`) — a
  // correction to that single coordinate, not a re-check against whichever
  // teammate or opponent now sits nearby. Re-running the same relaxation
  // catches any collision that clamp introduced, same as it already covers
  // the rare boxed-in cases described above.
  relaxAllPairs();

  return { own: finalOwn, opponent: finalOpponent };
}

export type PlayerPair = { from: FormationPlayer; to: FormationPlayer };

/**
 * Greedy nearest-neighbor pairing between two formations' 11 players, used
 * to draw "ghost overlay" connecting lines in compare mode. There's no
 * canonical role mapping between e.g. a 4-4-2 and a 3-4-3, so this just
 * pairs whichever players are spatially closest — in practice that reliably
 * matches defenders to defenders and attackers to attackers.
 */
export function matchFormationPlayers(from: FormationPlayer[], to: FormationPlayer[]): PlayerPair[] {
  const remaining = [...to];
  return from.map((fromPlayer) => {
    let bestIndex = 0;
    let bestDistance = Infinity;
    remaining.forEach((candidate, index) => {
      const distance = Math.hypot(fromPlayer.x - candidate.x, fromPlayer.y - candidate.y);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = index;
      }
    });
    const [toPlayer] = remaining.splice(bestIndex, 1);
    return { from: fromPlayer, to: toPlayer };
  });
}
