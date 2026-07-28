import type { PositionCode } from "@/lib/formations";
import type { Instructions, LabPlayer } from "./designSchema";

/** Same width:height ratio used throughout the site's pitch math — a percent of x and a percent of y cover different real distances on the taller-than-wide pitch. */
const PITCH_ASPECT = 68 / 105;

function pitchDistance(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.hypot((a.x - b.x) * PITCH_ASPECT, a.y - b.y);
}

function clamp01to100(value: number): number {
  return Math.min(100, Math.max(0, value));
}

function mean(values: number[]): number {
  return values.length === 0 ? 0 : values.reduce((sum, v) => sum + v, 0) / values.length;
}

function stdDev(values: number[]): number {
  if (values.length === 0) return 0;
  const m = mean(values);
  return Math.sqrt(mean(values.map((v) => (v - m) ** 2)));
}

type Line = "defense" | "midfield" | "attack";
type LineWeights = Partial<Record<Line, number>>;

/**
 * How much each role counts toward each line, for third/line-based
 * analysis. Most roles are 100% one line; two hybrids are deliberately
 * split, matching the brief's own example ("an inverted full-back counts
 * partly as a midfielder in possession") and the equivalent case for a
 * False 9 dropping into the midfield pocket. `null` means excluded
 * entirely — the goalkeeper (and its sweeper-keeper variation) is always
 * the deepest player and isn't part of the outfield shape analysis.
 */
const ROLE_LINE_WEIGHTS: Record<PositionCode, LineWeights | null> = {
  GK: null,
  SK: null,
  LB: { defense: 1 },
  RB: { defense: 1 },
  CB: { defense: 1 },
  LWB: { defense: 1 },
  RWB: { defense: 1 },
  IFB: { defense: 0.5, midfield: 0.5 },
  CDM: { midfield: 1 },
  CM: { midfield: 1 },
  CAM: { midfield: 0.6, attack: 0.4 },
  LM: { midfield: 1 },
  RM: { midfield: 1 },
  DLP: { midfield: 1 },
  B2B: { midfield: 1 },
  LW: { attack: 1 },
  RW: { attack: 1 },
  IW: { attack: 1 },
  ST: { attack: 1 },
  F9: { attack: 0.5, midfield: 0.5 },
};

function outfield(players: LabPlayer[]): LabPlayer[] {
  return players.filter((p) => ROLE_LINE_WEIGHTS[p.role] !== null);
}

export type ThirdCounts = { attack: number; midfield: number; defense: number };

/** Weighted count of outfield players in each third of the pitch, by role rather than raw y-position, so a withdrawn striker still reads as attacking presence. */
export function countByLine(players: LabPlayer[]): ThirdCounts {
  const counts: ThirdCounts = { attack: 0, midfield: 0, defense: 0 };
  for (const player of players) {
    const weights = ROLE_LINE_WEIGHTS[player.role];
    if (!weights) continue;
    for (const [line, weight] of Object.entries(weights) as [Line, number][]) {
      counts[line] += weight;
    }
  }
  return counts;
}

/** Population standard deviation of x among outfield players, 0–100 normalized — a tight cluster near the center scores low, players hugging both touchlines score high. */
export function widthSpreadScore(players: LabPlayer[]): number {
  const xs = outfield(players).map((p) => p.x);
  const spread = stdDev(xs);
  // A back four squeezed to a 20-unit-wide cluster has a stdDev around 6–7;
  // a team stretching touchline to touchline (x=4 to x=96) approaches 30.
  return clamp01to100(((spread - 6) / (30 - 6)) * 100);
}

/** Average distance from each outfield player to their single nearest outfield teammate, 0–100 normalized so higher = more compact. */
export function compactnessScore(players: LabPlayer[]): number {
  const list = outfield(players);
  if (list.length < 2) return 50;
  const nearestDistances = list.map((player) => {
    let best = Infinity;
    for (const other of list) {
      if (other === player) continue;
      best = Math.min(best, pitchDistance(player, other));
    }
    return best;
  });
  const avgNearest = mean(nearestDistances);
  // ~9 units apart (marker-touching close, the tightest realistic cluster)
  // scores 100; ~35 units apart (isolated, easily bypassed individually)
  // scores 0.
  return clamp01to100(100 - ((avgNearest - 9) / (35 - 9)) * 100);
}

/** The single largest vertical gap between the three lines' weighted centroid y-positions — a big defense-to-midfield gap is exactly the space a through-ball exploits. */
export function largestLineGap(players: LabPlayer[]): number {
  const byLine: Record<Line, { ySum: number; weight: number }> = {
    attack: { ySum: 0, weight: 0 },
    midfield: { ySum: 0, weight: 0 },
    defense: { ySum: 0, weight: 0 },
  };
  for (const player of players) {
    const weights = ROLE_LINE_WEIGHTS[player.role];
    if (!weights) continue;
    for (const [line, weight] of Object.entries(weights) as [Line, number][]) {
      byLine[line].ySum += player.y * weight;
      byLine[line].weight += weight;
    }
  }
  const centroids = (["attack", "midfield", "defense"] as Line[])
    .map((line) => (byLine[line].weight > 0 ? byLine[line].ySum / byLine[line].weight : null))
    .filter((y): y is number => y !== null);
  if (centroids.length < 2) return 0;
  centroids.sort((a, b) => a - b);
  let largest = 0;
  for (let i = 1; i < centroids.length; i++) largest = Math.max(largest, centroids[i] - centroids[i - 1]);
  return largest;
}

/** How many outfield players sit deeper (higher y) than the team's own attacking line's centroid — the cover left behind if possession is lost high up the pitch. */
export function restDefenseCount(players: LabPlayer[]): number {
  const list = outfield(players);
  const attackYs: number[] = [];
  for (const player of list) {
    const weight = ROLE_LINE_WEIGHTS[player.role]?.attack;
    if (weight) attackYs.push(player.y);
  }
  if (attackYs.length === 0) return list.length;
  const attackLineY = mean(attackYs);
  return list.filter((p) => p.y > attackLineY + 5).length;
}

/** Outfield players in the central channel (x 35–65) vs the two wide channels combined. */
export function centralWideBalance(players: LabPlayer[]): { central: number; wide: number } {
  const list = outfield(players);
  const central = list.filter((p) => p.x >= 35 && p.x <= 65).length;
  return { central, wide: list.length - central };
}

/** Distance (in pitch units) within which two players are considered a viable short-pass link. */
const PASS_LINK_DISTANCE = 24;

export type Connectivity = { edges: number; triangles: number };

/** Counts viable short-pass links between all 11 players (goalkeeper included — it's part of the first pass) and how many form a mutual triangle, a rough proxy for how easily the team can retain the ball under pressure. */
export function passingConnectivity(players: LabPlayer[]): Connectivity {
  const edges: [number, number][] = [];
  for (let i = 0; i < players.length; i++) {
    for (let j = i + 1; j < players.length; j++) {
      if (pitchDistance(players[i], players[j]) <= PASS_LINK_DISTANCE) edges.push([i, j]);
    }
  }
  const edgeSet = new Set(edges.map(([i, j]) => `${i}-${j}`));
  const hasEdge = (i: number, j: number) => i !== j && edgeSet.has(i < j ? `${i}-${j}` : `${j}-${i}`);
  let triangles = 0;
  for (let i = 0; i < players.length; i++) {
    for (let j = i + 1; j < players.length; j++) {
      if (!hasEdge(i, j)) continue;
      for (let k = j + 1; k < players.length; k++) {
        if (hasEdge(i, k) && hasEdge(j, k)) triangles++;
      }
    }
  }
  return { edges: edges.length, triangles };
}

const MENTALITY_RISK_FACTOR: Record<Instructions["mentality"], number> = {
  defensive: 0.6,
  balanced: 1,
  attacking: 1.35,
};
const LINE_RISK_FACTOR: Record<Instructions["line"], number> = {
  deep: 0.7,
  medium: 1,
  high: 1.4,
};

/** 0–100 risk of being caught out on the counter: fewer players behind the ball, a high line, and an attacking mentality all compound. */
export function transitionRiskScore(players: LabPlayer[], instructions: Instructions): number {
  const behind = restDefenseCount(players);
  const list = outfield(players);
  // Fewer than ~4 behind the ball is already thin cover in open play.
  const thinness = clamp01to100(((4 - behind) / 4) * 100);
  const risk = thinness * MENTALITY_RISK_FACTOR[instructions.mentality] * LINE_RISK_FACTOR[instructions.line];
  return clamp01to100(list.length === 0 ? 0 : risk);
}

export type EngineScores = {
  defensiveSolidity: number;
  attackingThreat: number;
  widthAndStretch: number;
  compactness: number;
  pressResistance: number;
  counterVulnerability: number;
  tacticalBalance: number;
};

export function computeScores(players: LabPlayer[], instructions: Instructions): EngineScores {
  const thirds = countByLine(players);
  const gap = largestLineGap(players);
  const behind = restDefenseCount(players);
  const connectivity = passingConnectivity(players);
  const width = widthSpreadScore(players);
  const compactness = compactnessScore(players);
  const counterVulnerability = transitionRiskScore(players, instructions);

  // A defensive-third gap wider than ~22 units is already enough room for a
  // midfielder to receive and turn unchallenged between the lines.
  const gapPenalty = clamp01to100(((gap - 10) / (35 - 10)) * 100);
  const defensiveSolidity = clamp01to100(
    thirds.defense * 14 + behind * 6 - gapPenalty * 0.5 + (LINE_RISK_FACTOR[instructions.line] < 1 ? 10 : 0),
  );

  const attackMentalityBoost = instructions.mentality === "attacking" ? 10 : instructions.mentality === "defensive" ? -10 : 0;
  const attackingThreat = clamp01to100(
    thirds.attack * 16 + width * 0.2 + instructions.tempo * 0.2 + attackMentalityBoost,
  );

  const pressResistance = clamp01to100(connectivity.edges * 4 + connectivity.triangles * 8 + thirds.midfield * 6);

  const tacticalBalance = clamp01to100(
    (defensiveSolidity + attackingThreat + pressResistance + (100 - counterVulnerability)) / 4 -
      Math.abs(50 - width) * 0.1 -
      gapPenalty * 0.15,
  );

  return {
    defensiveSolidity,
    attackingThreat,
    widthAndStretch: width,
    compactness,
    pressResistance,
    counterVulnerability,
    tacticalBalance,
  };
}

export type EngineNote = { severity: "good" | "warn" | "bad"; text: string };

/** Threshold-rule notes in plain language — 2–4 of the most relevant, not an exhaustive dump. */
export function generateNotes(players: LabPlayer[], instructions: Instructions, scores: EngineScores): EngineNote[] {
  const notes: EngineNote[] = [];
  const thirds = countByLine(players);
  const gap = largestLineGap(players);
  const behind = restDefenseCount(players);
  const balance = centralWideBalance(players);

  if (thirds.midfield < 2.5) {
    notes.push({ severity: "bad", text: `Only ${thirds.midfield.toFixed(1)} in midfield — likely to be overrun centrally against three or more.` });
  } else if (thirds.midfield >= 4.5) {
    notes.push({ severity: "good", text: "A strong central midfield presence should help control tempo and win the ball back." });
  }

  if (gap > 24) {
    notes.push({ severity: "bad", text: "A big gap between midfield and defense invites runners into space between the lines." });
  }

  if (behind <= 2 && instructions.mentality !== "defensive") {
    notes.push({ severity: "warn", text: `Only ${behind} players sit behind the attacking line — a lost ball here is a fast break the other way.` });
  }

  if (balance.central <= 1 && thirds.defense + thirds.midfield + thirds.attack >= 8) {
    notes.push({ severity: "warn", text: "The middle channel is thin — an opponent playing through the center may find little resistance." });
  } else if (balance.central >= 6) {
    notes.push({ severity: "good", text: "A heavy central overload should dominate the middle of the pitch." });
  }

  if (scores.compactness < 30) {
    notes.push({ severity: "bad", text: "The shape is stretched thin — easy to play through with a simple pass." });
  }

  if (scores.counterVulnerability > 70) {
    notes.push({ severity: "bad", text: "High counter-attack risk: an attacking mentality and high line with thin cover behind the ball." });
  }

  if (notes.length === 0) {
    notes.push({ severity: "good", text: "A balanced, well-connected shape with no obvious structural weakness." });
  }

  return notes.slice(0, 4);
}
