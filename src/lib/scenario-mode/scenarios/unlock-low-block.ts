import type { Scenario, ScenarioStep } from "../schema";

/**
 * A different puzzle from the counter: the block is dense (three overlapping
 * zones covering the width of the box) but slow to react. The winger's
 * delivery draws the covering center-back toward the wide area; the relay to
 * the third man has to go quickly, before that defender — chasing the
 * winger — ends up standing in the passing lane back. Waiting for the
 * runner to fully arrive first (rather than meeting a quicker ball) gives
 * the defender time to close down the winger completely and cuts the relay
 * out no matter which direction it goes.
 */
const templatePlay: ScenarioStep[] = [
  { id: "t1", kind: "pass", playerId: "playmaker", startStep: 1, toPlayerId: "winger" },
  { id: "t2", kind: "run", playerId: "third-man", startStep: 1, endStep: 2, toPoint: { x: 58, y: 14 } },
  { id: "t3", kind: "pass", playerId: "winger", startStep: 2, toPlayerId: "third-man" },
  { id: "t4", kind: "shot", playerId: "third-man", startStep: 3, toPoint: { x: 55, y: 3 } },
];

export const unlockLowBlock: Scenario = {
  slug: "unlock-low-block",
  family: "low-block",
  name: "Unlock a Low Block",
  brief: "A patient combination plus a third-man run to create a chance against a compact, slow-to-react defense.",
  parSteps: 3,
  stage: {
    ballStart: { x: 50, y: 40 },
    players: [
      { id: "playmaker", code: "CM", start: { x: 50, y: 40 } },
      { id: "winger", code: "RW", start: { x: 78, y: 25 } },
      { id: "third-man", code: "CAM", start: { x: 35, y: 40 } },
    ],
    opponents: [
      {
        id: "cb1",
        code: "CB",
        start: { x: 35, y: 14 },
        behavior: { kind: "zone-holder", zone: { x: 35, y: 14, radius: 9 } },
        speed: 2.5,
      },
      {
        id: "cb2",
        code: "CB",
        // A wide zone that covers both the central gap and the winger's
        // area — this is the defender the delivery is meant to draw out.
        start: { x: 68, y: 8 },
        behavior: { kind: "zone-holder", zone: { x: 70, y: 20, radius: 18 } },
        speed: 2.5,
      },
      {
        id: "dm",
        code: "CDM",
        start: { x: 50, y: 24 },
        behavior: { kind: "zone-holder", zone: { x: 50, y: 24, radius: 10 } },
        speed: 2.5,
      },
    ],
  },
  successCriteria: [
    { kind: "receiverInSpace", zone: { x: 55, y: 15, radius: 20 }, minOpponentDistance: 8 },
    { kind: "shotOnTarget" },
  ],
  tiers: {
    bronze: { speedMultiplier: 1, reactionDelayDelta: 0 },
    silver: { speedMultiplier: 1.3, reactionDelayDelta: 0 },
    gold: { speedMultiplier: 1.6, reactionDelayDelta: -1 },
  },
  templatePlay,
};
