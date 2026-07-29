import type { Scenario } from "../schema";
import { counter3v2 } from "./counter-3v2";

/** New scenarios register here — nothing else needs to change to add one. */
export const scenarios: Scenario[] = [counter3v2];

export function getScenario(slug: string): Scenario | undefined {
  return scenarios.find((scenario) => scenario.slug === slug);
}
