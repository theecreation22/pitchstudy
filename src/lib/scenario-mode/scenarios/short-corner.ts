import type { Scenario, ScenarioStep } from "../schema";

/**
 * Combine short rather than launching it in: the taker finds the short
 * option before the near-corner marker can close them down, the option
 * relays it into a runner arriving from deep, and that runner shoots before
 * the tracking center-back catches up. Hand-verified to produce GOAL under
 * bronze: the first pass beats the marker by a slim margin (by design — a
 * blind, slower combination gets shut down), and the delivery to the runner
 * lands with the tracker still outside interception range.
 */
const templatePlay: ScenarioStep[] = [
  { id: "t1", kind: "pass", playerId: "taker", startStep: 1, toPlayerId: "short-option" },
  { id: "t2", kind: "run", playerId: "runner", startStep: 1, endStep: 2, toPoint: { x: 52, y: 9 } },
  { id: "t3", kind: "pass", playerId: "short-option", startStep: 2, toPlayerId: "runner" },
  { id: "t4", kind: "shot", playerId: "runner", startStep: 3, toPoint: { x: 52, y: 2 } },
];

export const shortCorner: Scenario = {
  slug: "short-corner",
  family: "set-piece",
  name: "Short Corner Routine",
  brief: "Combine short to create a crossing or shooting angle, rather than launching it straight into a packed box.",
  parSteps: 4,
  stage: {
    ballStart: { x: 99, y: 2 },
    players: [
      { id: "taker", code: "RW", start: { x: 99, y: 2 } },
      { id: "short-option", code: "RB", start: { x: 85, y: 12 } },
      { id: "runner", code: "ST", start: { x: 58, y: 30 } },
    ],
    opponents: [
      {
        id: "corner-marker",
        code: "CB",
        // Approaches from directly behind the short option rather than
        // across the eventual relay lane — a marker closing in from the
        // side would sit right on top of the shortOption-to-runner pass.
        start: { x: 85, y: 28 },
        behavior: { kind: "zone-holder", zone: { x: 85, y: 12, radius: 20 } },
        speed: 4,
      },
      {
        id: "box-defender",
        code: "CB",
        start: { x: 50, y: 22 },
        behavior: { kind: "man-tracker", trackId: "runner", reactionDelay: 1 },
        speed: 5,
      },
    ],
  },
  successCriteria: [
    { kind: "receiverInSpace", zone: { x: 55, y: 12, radius: 20 }, minOpponentDistance: 9 },
    { kind: "shotOnTarget" },
  ],
  tiers: {
    bronze: { speedMultiplier: 1, reactionDelayDelta: 0 },
    silver: { speedMultiplier: 1.25, reactionDelayDelta: 0 },
    gold: { speedMultiplier: 1.5, reactionDelayDelta: -1 },
  },
  templatePlay,
};
