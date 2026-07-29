import type { Scenario, ScenarioStep } from "../schema";

/**
 * No shot required here — the win condition is escaping the press cleanly,
 * matching the brief's own "without going long." The holding midfielder
 * sits in the gap between the two pressing forwards (each man-marking a
 * center-back with zero reaction delay, an aggressive high press), so the
 * second pass only needs to be quick, not far.
 */
const templatePlay: ScenarioStep[] = [
  { id: "t1", kind: "pass", playerId: "gk", startStep: 1, toPlayerId: "cb1" },
  { id: "t2", kind: "pass", playerId: "cb1", startStep: 2, toPlayerId: "dm" },
];

export const buildUpPress: Scenario = {
  slug: "build-up-press",
  family: "build-up",
  name: "Play Out Under a High Press",
  brief: "Beat the first line of pressure from a goal kick without going long.",
  parSteps: 2,
  stage: {
    ballStart: { x: 50, y: 92 },
    players: [
      { id: "gk", code: "GK", start: { x: 50, y: 92 } },
      { id: "cb1", code: "CB", start: { x: 25, y: 78 } },
      { id: "cb2", code: "CB", start: { x: 75, y: 78 } },
      { id: "dm", code: "CDM", start: { x: 50, y: 68 } },
    ],
    opponents: [
      {
        id: "press1",
        code: "ST",
        start: { x: 35, y: 58 },
        behavior: { kind: "man-tracker", trackId: "cb1", reactionDelay: 0 },
        speed: 5,
      },
      {
        id: "press2",
        code: "ST",
        start: { x: 65, y: 58 },
        behavior: { kind: "man-tracker", trackId: "cb2", reactionDelay: 0 },
        speed: 5,
      },
    ],
  },
  constraints: [{ kind: "maxSteps", value: 5 }],
  successCriteria: [{ kind: "receiverInSpace", zone: { x: 50, y: 65, radius: 20 }, minOpponentDistance: 9 }],
  tiers: {
    bronze: { speedMultiplier: 1, reactionDelayDelta: 0 },
    silver: { speedMultiplier: 1.3, reactionDelayDelta: 0 },
    gold: { speedMultiplier: 1.6, reactionDelayDelta: 0 },
  },
  templatePlay,
};
