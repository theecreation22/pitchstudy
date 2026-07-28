import type { LabPlayer } from "./designSchema";

export type PlayActionKind = "pass" | "run" | "shot";

/**
 * One choreographed action, in sequence order. `playerId` is always the
 * player performing the action. A pass targets either a named teammate
 * (`toPlayerId`) or open space (`toPoint`); a run or shot always targets a
 * point (a run moves the player themselves; a shot moves the ball toward
 * goal without transferring it to anyone). Ball-possession consistency
 * (you can only pass/shoot if you're the current carrier) is deliberately
 * not enforced — validating that would add real friction to sketching out
 * an idea, and the frame computation below doesn't need it to produce a
 * sensible animation either way.
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
  ballCarrierId: string | null;
};

/** Where the ball sits before any step has been recorded — a neutral, roughly central starting point rather than tied to any one player. */
const DEFAULT_BALL_POSITION = { x: 50, y: 60 };

/**
 * Folds a step sequence into a full list of frames, one per step plus the
 * initial state (`frames[0]`), so `frames.length === steps.length + 1` and
 * `frames[i]` is always "the state after step i has happened" for i > 0.
 * This lets the UI jump to or animate toward any point in the sequence
 * without re-deriving anything — every frame is a complete snapshot.
 */
export function computePlayFrames(initialPlayers: LabPlayer[], steps: PlayStep[]): StepFrame[] {
  let positions: Record<string, { x: number; y: number }> = Object.fromEntries(
    initialPlayers.map((p) => [p.id, { x: p.x, y: p.y }]),
  );
  let ballPosition = { ...DEFAULT_BALL_POSITION };
  let ballCarrierId: string | null = null;

  const frames: StepFrame[] = [{ positions: { ...positions }, ballPosition: { ...ballPosition }, ballCarrierId }];

  for (const step of steps) {
    if (step.kind === "run") {
      if (step.toPoint) positions = { ...positions, [step.playerId]: { ...step.toPoint } };
    } else if (step.kind === "pass") {
      const target = step.toPlayerId ? positions[step.toPlayerId] : step.toPoint;
      if (target) ballPosition = { ...target };
      ballCarrierId = step.toPlayerId ?? null;
    } else if (step.kind === "shot") {
      if (step.toPoint) ballPosition = { ...step.toPoint };
      ballCarrierId = null;
    }
    frames.push({ positions: { ...positions }, ballPosition: { ...ballPosition }, ballCarrierId });
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
