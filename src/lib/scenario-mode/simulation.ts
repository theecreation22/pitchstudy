import type { DifficultyTier, Point, Scenario, ScenarioOpponent, ScenarioStep } from "./schema";

export type ScenarioFrame = {
  playerPositions: Record<string, Point>;
  opponentPositions: Record<string, Point>;
  ballPosition: Point;
};

function lerp(from: Point, to: Point, t: number): Point {
  return { x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t };
}

function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function moveToward(current: Point, target: Point, maxDistance: number): Point {
  const remaining = distance(current, target);
  if (remaining <= maxDistance || remaining === 0) return { ...target };
  const t = maxDistance / remaining;
  return lerp(current, target, t);
}

/** The last step index any action touches — frames run 0..stepCount inclusive. */
function stepCountOf(steps: ScenarioStep[]): number {
  let max = 0;
  for (const step of steps) {
    max = Math.max(max, step.startStep, step.endStep ?? step.startStep + 1);
  }
  return max;
}

/**
 * A player's position at a given frame, folding in every run assigned to
 * them in step order. A run's target is only reached once `frameIndex`
 * reaches its `endStep`; in between, position is linearly interpolated —
 * this is what lets a run timed to end exactly when a pass lands read as
 * "arriving onto the ball" rather than a teleport.
 */
function playerPositionAtFrame(startPoint: Point, playerId: string, steps: ScenarioStep[], frameIndex: number): Point {
  const runs = steps
    .filter((s) => s.kind === "run" && s.playerId === playerId && s.toPoint)
    .map((s) => ({ ...s, endStep: s.endStep ?? s.startStep + 1 }))
    .sort((a, b) => a.startStep - b.startStep);

  let position = startPoint;
  for (const run of runs) {
    if (frameIndex <= run.startStep) break;
    if (frameIndex >= run.endStep) {
      position = run.toPoint!;
      continue;
    }
    const progress = (frameIndex - run.startStep) / (run.endStep - run.startStep);
    position = lerp(position, run.toPoint!, progress);
    break;
  }
  return position;
}

function ballPositionAtFrame(
  scenario: Scenario,
  steps: ScenarioStep[],
  playerStartPoints: Record<string, Point>,
  frameIndex: number,
): Point {
  const landings = steps
    .filter((s) => (s.kind === "pass" || s.kind === "shot") && s.startStep <= frameIndex)
    .sort((a, b) => a.startStep - b.startStep);
  if (landings.length === 0) return scenario.stage.ballStart;

  const last = landings[landings.length - 1];
  if (last.kind === "shot") return last.toPoint ?? scenario.stage.ballStart;
  if (last.toPlayerId) {
    // The ball arrives wherever the receiver was AT the moment of reception —
    // it doesn't keep tracking them if they run further afterward, matching
    // the free-form Play Designer's same simplification.
    const receiverStart = playerStartPoints[last.toPlayerId];
    if (!receiverStart) return scenario.stage.ballStart;
    return playerPositionAtFrame(receiverStart, last.toPlayerId, steps, last.startStep);
  }
  return last.toPoint ?? scenario.stage.ballStart;
}

function resolveOpponentTarget(
  opponent: ScenarioOpponent,
  frame: number,
  reactionDelayDelta: number,
  ballAt: (frame: number) => Point,
  playersAt: (frame: number) => Record<string, Point>,
): Point {
  const behavior = opponent.behavior;
  if (behavior.kind === "recovery-runner") return behavior.target;
  if (behavior.kind === "ball-shifter") return { x: ballAt(frame).x, y: opponent.start.y };
  if (behavior.kind === "zone-holder") {
    const players = playersAt(frame);
    for (const point of Object.values(players)) {
      if (distance(point, behavior.zone) <= behavior.zone.radius) return point;
    }
    return { x: behavior.zone.x, y: behavior.zone.y };
  }
  // man-tracker
  const delay = Math.max(0, behavior.reactionDelay + reactionDelayDelta);
  const trackedFrame = Math.max(0, frame - delay);
  const players = playersAt(trackedFrame);
  return players[behavior.trackId] ?? opponent.start;
}

/**
 * Folds a scenario + its steps into one frame per step index (frame 0 is the
 * stage's starting picture), matching the free-form Play Designer's own
 * "frame per step, animate the transition" convention. Opponents are
 * resolved after players/ball are fully known for every frame, since their
 * behaviors only ever read player/ball state, never the other way around.
 */
export function computeScenarioFrames(scenario: Scenario, tier: DifficultyTier, steps: ScenarioStep[]): ScenarioFrame[] {
  const stepCount = stepCountOf(steps);
  const modifiers = scenario.tiers[tier];
  const playerStartPoints = Object.fromEntries(scenario.stage.players.map((p) => [p.id, p.start]));

  const playersAt = (frame: number) =>
    Object.fromEntries(scenario.stage.players.map((p) => [p.id, playerPositionAtFrame(p.start, p.id, steps, frame)]));

  const ballAtCache = new Map<number, Point>();
  const ballAt = (frame: number) => {
    if (!ballAtCache.has(frame)) ballAtCache.set(frame, ballPositionAtFrame(scenario, steps, playerStartPoints, frame));
    return ballAtCache.get(frame)!;
  };

  const frames: ScenarioFrame[] = [];
  const opponentPositions: Record<string, Point> = Object.fromEntries(
    scenario.stage.opponents.map((o) => [o.id, o.start]),
  );

  for (let frame = 0; frame <= stepCount; frame++) {
    const playerPositions = playersAt(frame);
    const ballPosition = ballAt(frame);

    if (frame > 0) {
      for (const opponent of scenario.stage.opponents) {
        const target = resolveOpponentTarget(opponent, frame, modifiers.reactionDelayDelta, ballAt, playersAt);
        const maxDistance = opponent.speed * modifiers.speedMultiplier;
        opponentPositions[opponent.id] = moveToward(opponentPositions[opponent.id], target, maxDistance);
      }
    }

    frames.push({ playerPositions, opponentPositions: { ...opponentPositions }, ballPosition });
  }

  return frames;
}
