import type { LabPlayer } from "./designSchema";

export type PlayActionKind = "pass" | "run" | "shot";

/**
 * One choreographed action, in sequence order. `playerId` is always the
 * player performing the action. A pass targets either a named teammate
 * (`toPlayerId`) or open space (`toPoint`); a run or shot always targets a
 * point (a run moves the player themselves; a shot moves the ball toward
 * goal without transferring it to anyone). Ball-possession consistency IS
 * enforced at the UI layer (see `getCarrierId` below) — only whoever is
 * actually on the ball can pass or shoot it; a run has no such restriction.
 */
export type PlayStep = {
  id: string;
  kind: PlayActionKind;
  playerId: string;
  toPlayerId?: string;
  toPoint?: { x: number; y: number };
};

export type StepFrame = {
  positions: Record<string, { x: number; y: number }>;
  ballPosition: { x: number; y: number };
};

/** Where the ball sits before any step has been recorded, for a design that hasn't placed it itself — a neutral, roughly central starting point rather than tied to any one player. */
export const DEFAULT_BALL_START = { x: 50, y: 60 };

/** How close a player must be to the ball to count as its carrier — small enough to require an actual, specific owner, generous enough to tolerate the ball sitting slightly off a player's exact marker. */
const CARRIER_PROXIMITY = 3;

/** Whoever is nearest the ball in this frame, within `CARRIER_PROXIMITY` — null means the ball currently belongs to no one, so nobody can pass or shoot it yet. Purely positional (not a tracked "who last touched it" label), so a player who's since run away from a reception point correctly stops counting as the carrier. Nearest rather than first-found matters once the ball can be placed by hand: dropping it exactly on a player must name that player, never a neighbour who merely happens to be listed earlier. */
export function getCarrierId(frame: StepFrame): string | null {
  let carrierId: string | null = null;
  let bestDistance = CARRIER_PROXIMITY;
  for (const [id, position] of Object.entries(frame.positions)) {
    const distance = Math.hypot(position.x - frame.ballPosition.x, position.y - frame.ballPosition.y);
    if (distance <= bestDistance) {
      bestDistance = distance;
      carrierId = id;
    }
  }
  return carrierId;
}

/**
 * Folds a step sequence into a full list of frames, one per step plus the
 * initial state (`frames[0]`), so `frames.length === steps.length + 1` and
 * `frames[i]` is always "the state after step i has happened" for i > 0.
 * This lets the UI jump to or animate toward any point in the sequence
 * without re-deriving anything — every frame is a complete snapshot.
 *
 * `ballStart` is where the design says the play kicks off from; omitting it
 * falls back to the neutral default, which is what every play authored
 * before ball placement existed relies on.
 */
export function computePlayFrames(
  initialPlayers: LabPlayer[],
  steps: PlayStep[],
  ballStart: { x: number; y: number } = DEFAULT_BALL_START,
): StepFrame[] {
  let positions: Record<string, { x: number; y: number }> = Object.fromEntries(
    initialPlayers.map((p) => [p.id, { x: p.x, y: p.y }]),
  );
  let ballPosition = { ...ballStart };

  const frames: StepFrame[] = [{ positions: { ...positions }, ballPosition: { ...ballPosition } }];

  for (const step of steps) {
    if (step.kind === "run") {
      if (step.toPoint) positions = { ...positions, [step.playerId]: { ...step.toPoint } };
    } else if (step.kind === "pass") {
      const target = step.toPlayerId ? positions[step.toPlayerId] : step.toPoint;
      if (target) ballPosition = { ...target };
    } else if (step.kind === "shot") {
      if (step.toPoint) ballPosition = { ...step.toPoint };
    }
    frames.push({ positions: { ...positions }, ballPosition: { ...ballPosition } });
  }

  return frames;
}

/** A short, plain-language description of a step for the timeline card — e.g. "CM passes to RM", "RB makes a run", "ST shoots". */
export function describeStep(step: PlayStep, players: LabPlayer[]): string {
  const actorRole = players.find((p) => p.id === step.playerId)?.role ?? "Player";
  if (step.kind === "run") return `${actorRole} makes a run`;
  if (step.kind === "shot") return `${actorRole} shoots`;
  const targetRole = step.toPlayerId ? players.find((p) => p.id === step.toPlayerId)?.role : null;
  return targetRole ? `${actorRole} passes to ${targetRole}` : `${actorRole} plays a pass into space`;
}
