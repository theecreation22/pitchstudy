import type { ScenarioFrame } from "./simulation";
import type { DifficultyTier, Point, Scenario, ScenarioStep, SuccessCriterion } from "./schema";

export type ScenarioOutcome = "GOAL" | "CHANCE_CREATED" | "PLAY_BROKEN_UP" | "TOO_SLOW";
export type ScenarioGrade = "bronze" | "silver" | "gold" | null;

export type ScenarioResult = {
  outcome: ScenarioOutcome;
  grade: ScenarioGrade;
  reason: string;
  brokenAt?: Point;
  brokenByOpponentId?: string;
};

/** A defender within this many pitch-units of a pass/shot's straight-line path intercepts it — deliberately generous (roughly a marker's reach), not a precision hitbox. */
const INTERCEPTION_RADIUS = 6;

function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** Shortest distance from `point` to the line segment `a`→`b`. */
function distanceToSegment(point: Point, a: Point, b: Point): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lengthSquared = dx * dx + dy * dy;
  if (lengthSquared === 0) return distance(point, a);
  const t = Math.max(0, Math.min(1, ((point.x - a.x) * dx + (point.y - a.y) * dy) / lengthSquared));
  return distance(point, { x: a.x + t * dx, y: a.y + t * dy });
}

function checkConstraints(scenario: Scenario, steps: ScenarioStep[]): ScenarioResult | null {
  const passCount = steps.filter((s) => s.kind === "pass" || s.kind === "shot").length;
  const decoyRunCount = steps.filter((s) => s.kind === "run").length;
  const lastStepIndex = steps.reduce((max, s) => Math.max(max, s.endStep ?? s.startStep + 1), 0);

  for (const constraint of scenario.constraints) {
    if (constraint.kind === "maxPasses" && passCount > constraint.value) {
      return { outcome: "TOO_SLOW", grade: null, reason: `Used ${passCount} passes — the scenario allows at most ${constraint.value}.` };
    }
    if (constraint.kind === "maxSteps" && lastStepIndex > constraint.value) {
      return { outcome: "TOO_SLOW", grade: null, reason: `Took ${lastStepIndex} steps — the scenario allows at most ${constraint.value}.` };
    }
    if (constraint.kind === "minDecoyRuns" && decoyRunCount < constraint.value) {
      return { outcome: "TOO_SLOW", grade: null, reason: `Needs at least ${constraint.value} decoy run(s) — only ${decoyRunCount} were made.` };
    }
  }
  return null;
}

/** Finds the first pass/shot whose flight path (passer's position → target, both at the step's start frame) passes within interception range of any opponent at that same frame. */
function findInterception(
  steps: ScenarioStep[],
  frames: ScenarioFrame[],
): { brokenAt: Point; brokenByOpponentId: string } | null {
  const landings = [...steps].filter((s) => s.kind === "pass" || s.kind === "shot").sort((a, b) => a.startStep - b.startStep);

  for (const step of landings) {
    const frame = frames[step.startStep];
    if (!frame) continue;
    const from = frame.playerPositions[step.playerId];
    const to = step.kind === "shot" ? step.toPoint : step.toPlayerId ? frame.playerPositions[step.toPlayerId] : step.toPoint;
    if (!from || !to) continue;

    for (const [opponentId, opponentPoint] of Object.entries(frame.opponentPositions)) {
      if (distanceToSegment(opponentPoint, from, to) <= INTERCEPTION_RADIUS) {
        return { brokenAt: opponentPoint, brokenByOpponentId: opponentId };
      }
    }
  }
  return null;
}

function nearestOpponentDistance(point: Point, frame: ScenarioFrame): number {
  const distances = Object.values(frame.opponentPositions).map((opponent) => distance(point, opponent));
  return distances.length === 0 ? Infinity : Math.min(...distances);
}

function inZone(point: Point, zone: { x: number; y: number; radius: number }): boolean {
  return distance(point, zone) <= zone.radius;
}

function checkSuccessCriteria(scenario: Scenario, steps: ScenarioStep[], frames: ScenarioFrame[]): boolean {
  return scenario.successCriteria.every((criterion) => checkOne(criterion, steps, frames));
}

function checkOne(criterion: SuccessCriterion, steps: ScenarioStep[], frames: ScenarioFrame[]): boolean {
  if (criterion.kind === "shotOnTarget") {
    const last = steps[steps.length - 1];
    return Boolean(last && last.kind === "shot");
  }

  if (criterion.kind === "receiverInSpace") {
    return steps
      .filter((s) => s.kind === "pass" && s.toPlayerId)
      .some((s) => {
        const frame = frames[s.startStep];
        const point = frame?.playerPositions[s.toPlayerId!];
        if (!point) return false;
        if (criterion.zone && !inZone(point, criterion.zone)) return false;
        return nearestOpponentDistance(point, frame) >= criterion.minOpponentDistance;
      });
  }

  // overloadAtLine — checked at the frame the ball first crosses the line.
  for (let i = 1; i < frames.length; i++) {
    const before = frames[i - 1].ballPosition.y;
    const after = frames[i].ballPosition.y;
    const crossed = (before - criterion.line) * (after - criterion.line) <= 0 && before !== after;
    if (!crossed) continue;
    const frame = frames[i];
    const attackersAhead = Object.values(frame.playerPositions).filter((p) => p.y < criterion.line).length;
    const defendersAhead = Object.values(frame.opponentPositions).filter((p) => p.y < criterion.line).length;
    if (attackersAhead - defendersAhead >= criterion.minAdvantage) return true;
  }
  return false;
}

function gradeFor(scenario: Scenario, steps: ScenarioStep[]): ScenarioGrade {
  const stepsUsed = steps.reduce((max, s) => Math.max(max, s.endStep ?? s.startStep + 1), 0);
  if (stepsUsed <= scenario.parSteps) return "gold";
  if (stepsUsed <= scenario.parSteps + 2) return "silver";
  return "bronze";
}

export function evaluateScenario(scenario: Scenario, tier: DifficultyTier, steps: ScenarioStep[], frames: ScenarioFrame[]): ScenarioResult {
  const constraintFailure = checkConstraints(scenario, steps);
  if (constraintFailure) return constraintFailure;

  const interception = findInterception(steps, frames);
  if (interception) {
    return {
      outcome: "PLAY_BROKEN_UP",
      grade: null,
      reason: "The pass was cut out before it reached its target.",
      brokenAt: interception.brokenAt,
      brokenByOpponentId: interception.brokenByOpponentId,
    };
  }

  const succeeded = checkSuccessCriteria(scenario, steps, frames);
  if (!succeeded) {
    return { outcome: "TOO_SLOW", grade: null, reason: "The defense recovered before the play created a clear opening." };
  }

  const last = steps[steps.length - 1];
  const outcome: ScenarioOutcome = last && last.kind === "shot" ? "GOAL" : "CHANCE_CREATED";
  return {
    outcome,
    grade: gradeFor(scenario, steps),
    reason: outcome === "GOAL" ? "Clean strike — the defense never got there." : "A clear chance, beating the recovery in time.",
  };
}
