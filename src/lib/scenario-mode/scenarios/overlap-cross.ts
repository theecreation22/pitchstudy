import type { Scenario, ScenarioStep } from "../schema";

/**
 * The winger holds it just long enough for the overlapping full-back to
 * make their run, then releases it into the space beyond — the cross goes
 * in the moment the striker's near-post run arrives, not before (a cross
 * played too early has no one to meet it; the striker starting the run
 * only once the overlap is in full flow is what makes the timing read as
 * a genuine near-post arrival rather than a coincidence).
 */
const templatePlay: ScenarioStep[] = [
  { id: "t1", kind: "run", playerId: "full-back", startStep: 1, endStep: 2, toPoint: { x: 88, y: 28 } },
  { id: "t2", kind: "pass", playerId: "winger", startStep: 2, toPlayerId: "full-back" },
  { id: "t3", kind: "run", playerId: "striker", startStep: 2, endStep: 3, toPoint: { x: 65, y: 8 } },
  { id: "t4", kind: "pass", playerId: "full-back", startStep: 3, toPlayerId: "striker" },
  { id: "t5", kind: "shot", playerId: "striker", startStep: 4, toPoint: { x: 65, y: 2 } },
];

export const overlapCross: Scenario = {
  slug: "overlap-cross",
  family: "wide-play",
  name: "Overlap & Cross",
  brief: "Combine down the flank to free a runner for a cross, timed onto a near-post run.",
  parSteps: 4,
  stage: {
    ballStart: { x: 75, y: 45 },
    players: [
      { id: "winger", code: "RW", start: { x: 75, y: 45 } },
      { id: "full-back", code: "RB", start: { x: 68, y: 62 } },
      { id: "striker", code: "ST", start: { x: 50, y: 28 } },
    ],
    opponents: [
      {
        id: "wide-defender",
        code: "LB",
        start: { x: 85, y: 58 },
        behavior: { kind: "man-tracker", trackId: "full-back", reactionDelay: 1 },
        speed: 4.5,
      },
      {
        id: "box-defender",
        code: "CB",
        start: { x: 50, y: 14 },
        behavior: { kind: "zone-holder", zone: { x: 50, y: 12, radius: 14 } },
        speed: 4,
      },
    ],
  },
  successCriteria: [
    { kind: "receiverInSpace", zone: { x: 62, y: 10, radius: 18 }, minOpponentDistance: 8 },
    { kind: "shotOnTarget" },
  ],
  tiers: {
    bronze: { speedMultiplier: 1, reactionDelayDelta: 0 },
    silver: { speedMultiplier: 1.25, reactionDelayDelta: 0 },
    gold: { speedMultiplier: 1.5, reactionDelayDelta: -1 },
  },
  templatePlay,
};
