export type PositionCode =
  | "GK"
  | "LB"
  | "RB"
  | "CB"
  | "CDM"
  | "CM"
  | "CAM"
  | "LM"
  | "RM"
  | "LW"
  | "RW"
  | "ST";

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
];

export function getFormation(slug: string): Formation | undefined {
  return formations.find((formation) => formation.slug === slug);
}
