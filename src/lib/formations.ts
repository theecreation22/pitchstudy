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
      "The default shape of English football for decades — built around two flat lines of four that stay compact and hard to break down.",
    strengths: [
      "Even coverage across the width of the pitch",
      "Two strikers give a direct outlet and support each other up top",
      "Simple to organize defensively — everyone knows their line",
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
      "Flexible — the front three can rotate positions to confuse markers",
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
      "Very adaptable out of possession — can compress into a 4-4-1-1 when defending",
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
      "Wing-backs need elite stamina — they cover the entire touchline alone",
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
      "The more conservative sibling of the 3-5-2 — wing-backs sit deeper as auxiliary defenders rather than attacking outlets.",
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
      "A response to the flat 4-4-2's lack of central midfield presence — narrows the midfield into a diamond to win the battle in the middle of the pitch.",
    strengths: [
      "The extra central midfielder at the point of the diamond helps dominate central areas",
      "The attacking midfielder at the top of the diamond supports the strikers directly",
      "The defensive midfielder at the base protects the back four",
    ],
    weaknesses: [
      "Lacks natural width — full-backs must provide almost all of it",
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

function toHighPress(player: FormationPlayer): FormationPlayer {
  if (player.code === "GK") {
    return { ...player, y: Math.max(80, player.y - 8) };
  }
  const y = player.y + (45 - player.y) * 0.5;
  const x = 50 + (player.x - 50) * 0.6;
  return { ...player, x, y };
}

function toLowBlock(player: FormationPlayer): FormationPlayer {
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
