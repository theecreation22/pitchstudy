import type { PositionCode } from "@/lib/formations";

export type Point = { x: number; y: number };
export type Zone = { x: number; y: number; radius: number };

export type OpponentBehavior =
  /** Slides horizontally to track the ball's current x, holding its own y — a defensive line shuffling across. */
  | { kind: "ball-shifter" }
  /** Holds the zone's center until an attacker enters it, then steps toward that attacker to engage. */
  | { kind: "zone-holder"; zone: Zone }
  /** Chases a specific attacker's position from `reactionDelay` steps ago — never knows where they are right now. */
  | { kind: "man-tracker"; trackId: string; reactionDelay: number }
  /** Sprints in a straight line toward a fixed recovery point, ignoring everything else — the counter-attack chaser. */
  | { kind: "recovery-runner"; target: Point };

export type ScenarioOpponent = {
  id: string;
  code: PositionCode;
  start: Point;
  behavior: OpponentBehavior;
  /** Pitch-units covered per step at the Bronze baseline; tiers scale this. */
  speed: number;
};

export type ScenarioPlayer = { id: string; code: PositionCode; start: Point };

export type SuccessCriterion =
  /** A teammate receives the ball with no opponent within `minOpponentDistance` pitch-units, optionally only counting a delivery into `zone`. */
  | { kind: "receiverInSpace"; zone?: Zone; minOpponentDistance: number }
  /** The ball crosses a y-line with at least `minAdvantage` more attackers than defenders ahead of it. */
  | { kind: "overloadAtLine"; line: number; minAdvantage: number }
  /** The final action must be an uncontested shot. */
  | { kind: "shotOnTarget" };

export type DifficultyTier = "bronze" | "silver" | "gold";
export type TierModifiers = { speedMultiplier: number; reactionDelayDelta: number };

export type ScenarioFamily = "set-piece" | "counter-attack" | "build-up" | "low-block" | "wide-play";

export type Scenario = {
  slug: string;
  family: ScenarioFamily;
  name: string;
  brief: string;
  /** The step count a clean solution should take — grading compares the user's actual step count against this. */
  parSteps: number;
  stage: {
    ballStart: Point;
    players: ScenarioPlayer[];
    opponents: ScenarioOpponent[];
  };
  successCriteria: SuccessCriterion[];
  tiers: Record<DifficultyTier, TierModifiers>;
  /** A known routine (near-post corner, give-and-go, overlap) seeded as a starting point the user edits, rather than a blank stage. */
  templatePlay?: ScenarioStep[];
};

export type ScenarioActionKind = "pass" | "run" | "shot";

/**
 * One choreographed action. Passes and shots land at a single `startStep`.
 * Runs span `startStep` to `endStep` — this is what lets a run begun on step
 * 1 arrive exactly when a pass played on step 2 does, the core timing puzzle:
 * the runner's position is linearly interpolated between the two steps, so
 * a receiver "meets" a through-ball only if their run is timed to land there.
 */
export type ScenarioStep = {
  id: string;
  kind: ScenarioActionKind;
  playerId: string;
  startStep: number;
  endStep?: number; // runs only; defaults to startStep + 1 if omitted
  toPlayerId?: string;
  toPoint?: Point;
};
