import type { Scenario } from "../schema";
import { counter3v2 } from "./counter-3v2";
import { shortCorner } from "./short-corner";
import { unlockLowBlock } from "./unlock-low-block";
import { buildUpPress } from "./build-up-press";
import { overlapCross } from "./overlap-cross";

/** New scenarios register here — nothing else needs to change to add one. */
export const scenarios: Scenario[] = [counter3v2, shortCorner, buildUpPress, unlockLowBlock, overlapCross];

export function getScenario(slug: string): Scenario | undefined {
  return scenarios.find((scenario) => scenario.slug === slug);
}
