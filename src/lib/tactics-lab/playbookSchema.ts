import type { Instructions, LabPlayer } from "./designSchema";
import type { PlayStep } from "./playSchema";
import type { DifficultyTier } from "@/lib/scenario-mode/schema";
import type { ScenarioGrade } from "@/lib/scenario-mode/evaluation";
import type { ScenarioStep } from "@/lib/scenario-mode/schema";
import type { Formation } from "@/lib/formations";

/** Namespaces a saved formation's id so it can share the Opponent Sim dropdown's single `value` string with the canonical formation slugs (§6) without ever colliding with one. */
export const PLAYBOOK_OPPONENT_PREFIX = "playbook:";

export const PLAYBOOK_SCHEMA_VERSION = 1;

type PlaybookEntryBase = {
  id: string;
  schemaVersion: 1;
  /** 1-99, unique within `type` (a Formation No. 7 and a Play No. 7 can coexist). */
  number: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type PlaybookFormationEntry = PlaybookEntryBase & {
  type: "formation";
  players: LabPlayer[];
  instructions: Instructions;
  /** Captured at save time (via recognizeShape) — not re-derived on load, so a save always shows what it looked like when named. */
  shapeName: string;
};

/**
 * Two origins, since Play Designer's freeform choreography (no opponents,
 * no timing) and Scenario Mode's scripted puzzle (opponents with reactive
 * behaviors, `startStep`/`endStep` timing) are genuinely different replay
 * models under the hood — unifying them at the data level would mean
 * building a lossy adapter in one direction or the other. Unifying only
 * here, at the gallery/metadata layer, means loading correctly routes to
 * whichever designer can actually replay the entry's own step type.
 */
export type PlaybookPlayEntry = PlaybookEntryBase &
  (
    | {
        type: "play";
        origin: "designer";
        players: LabPlayer[];
        instructions: Instructions;
        steps: PlayStep[];
        seededFrom?: string;
      }
    | {
        type: "play";
        origin: "scenario";
        scenarioSlug: string;
        tier: DifficultyTier;
        steps: ScenarioStep[];
        grade: ScenarioGrade;
      }
  );

export type PlaybookEntry = PlaybookFormationEntry | PlaybookPlayEntry;

export function isFormationEntry(entry: PlaybookEntry): entry is PlaybookFormationEntry {
  return entry.type === "formation";
}

export function isDesignerPlayEntry(entry: PlaybookEntry): entry is Extract<PlaybookPlayEntry, { origin: "designer" }> {
  return entry.type === "play" && entry.origin === "designer";
}

export function isScenarioPlayEntry(entry: PlaybookEntry): entry is Extract<PlaybookPlayEntry, { origin: "scenario" }> {
  return entry.type === "play" && entry.origin === "scenario";
}

/** Builds a minimal, on-the-fly Formation from a saved formation entry — only `players` matters to `getFormationPlayers`/`mirrorFormationPlayers`, so the descriptive fields are just placeholders. */
export function formationEntryToFormation(entry: PlaybookFormationEntry): Formation {
  return {
    slug: `${PLAYBOOK_OPPONENT_PREFIX}${entry.id}`,
    name: entry.name,
    tagline: "",
    origin: "",
    strengths: [],
    weaknesses: [],
    bestSuited: "",
    players: entry.players.map((player) => ({ id: player.id, code: player.role, x: player.x, y: player.y })),
  };
}
