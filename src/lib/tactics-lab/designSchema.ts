import { getFormation, type PositionCode } from "@/lib/formations";
import type { PlayStep } from "./playSchema";

/** A single designed player: freely placed (not tied to any one canonical formation), in the same 0–100 pitch-percent space as FormationPlayer. */
export type LabPlayer = {
  id: string;
  role: PositionCode;
  x: number;
  y: number;
};

export type Mentality = "defensive" | "balanced" | "attacking";
export type PressStyle = "contain" | "balanced" | "high-press";
export type LineHeight = "deep" | "medium" | "high";

/** Team instructions — kept to five, per the spec's own "resist bloat" note. Tempo/width are 0–100 spectrum sliders; the rest are named 3-way choices, which read more clearly on a tactics board than an unlabeled slider. */
export type Instructions = {
  mentality: Mentality;
  tempo: number;
  width: number;
  press: PressStyle;
  line: LineHeight;
};

export const DEFAULT_INSTRUCTIONS: Instructions = {
  mentality: "balanced",
  tempo: 50,
  width: 50,
  press: "balanced",
  line: "medium",
};

export type Design = {
  players: LabPlayer[];
  instructions: Instructions;
  /** The formation slug this design started from, if seeded from a template — purely informational, not re-derived. */
  seededFrom?: string;
  /** A choreographed move built on top of this formation's starting positions, in Play Designer mode. Absent until the user adds a first step. */
  play?: PlayStep[];
  /** Where the ball sits before step one — placed by the user in Play Designer. Absent means the neutral default (see DEFAULT_BALL_START), which is what plays authored before ball placement existed replay from. */
  ballStart?: { x: number; y: number };
  /** The opponent formation slug selected in Opponent Sim, if any — absent means no opponent overlay is shown. */
  opponentFormationSlug?: string;
};

export function createEmptyPlayer(id: string, role: PositionCode, x: number, y: number): LabPlayer {
  return { id, role, x, y };
}

/** Seeds the board from one of the 8 canonical formations — most people design by editing an existing shape, not from a blank pitch. Falls back to the 4-4-2 if the slug is unrecognized. */
export function seedFromFormation(slug: string): LabPlayer[] {
  const formation = getFormation(slug) ?? getFormation("4-4-2")!;
  return formation.players.map((player) => ({ id: player.id, role: player.code, x: player.x, y: player.y }));
}
