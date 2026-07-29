import type { Scenario, ScenarioStep } from "../schema";

/**
 * A seeded solution the user can load as a starting point and tweak — carrier
 * finds the left runner immediately, the right runner sprints into the box
 * while that pass travels, and the return ball meets them right as their run
 * completes. Hand-verified to produce GOAL under the bronze tier: no
 * defender comes within the interception radius of either pass, and the
 * decisive delivery lands with both center-backs still 9+ units away.
 */
const templatePlay: ScenarioStep[] = [
  { id: "t1", kind: "pass", playerId: "carrier", startStep: 1, toPlayerId: "left-runner" },
  { id: "t2", kind: "run", playerId: "right-runner", startStep: 1, endStep: 3, toPoint: { x: 48, y: 15 } },
  { id: "t3", kind: "pass", playerId: "left-runner", startStep: 3, toPlayerId: "right-runner" },
  { id: "t4", kind: "shot", playerId: "right-runner", startStep: 4, toPoint: { x: 50, y: 2 } },
];

export const counter3v2: Scenario = {
  slug: "counter-3v2",
  family: "counter-attack",
  name: "3-v-2 Break",
  brief: "You've just won the ball back in your own half with a numerical advantage. Break before the defense recovers and get a clean shot away.",
  parSteps: 4,
  stage: {
    ballStart: { x: 50, y: 62 },
    players: [
      { id: "carrier", code: "CM", start: { x: 50, y: 62 } },
      { id: "left-runner", code: "LW", start: { x: 22, y: 52 } },
      { id: "right-runner", code: "RW", start: { x: 78, y: 52 } },
    ],
    opponents: [
      {
        id: "cb1",
        code: "CB",
        start: { x: 38, y: 30 },
        behavior: { kind: "recovery-runner", target: { x: 38, y: 18 } },
        speed: 5,
      },
      {
        id: "cb2",
        code: "CB",
        start: { x: 62, y: 30 },
        behavior: { kind: "recovery-runner", target: { x: 62, y: 18 } },
        speed: 5,
      },
    ],
  },
  constraints: [{ kind: "maxSteps", value: 6 }],
  successCriteria: [
    { kind: "receiverInSpace", zone: { x: 50, y: 20, radius: 25 }, minOpponentDistance: 9 },
    { kind: "shotOnTarget" },
  ],
  tiers: {
    bronze: { speedMultiplier: 1, reactionDelayDelta: 0 },
    silver: { speedMultiplier: 1.25, reactionDelayDelta: 0 },
    gold: { speedMultiplier: 1.5, reactionDelayDelta: -1 },
  },
  templatePlay,
};
