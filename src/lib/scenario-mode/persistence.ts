"use client";

import { useCallback, useMemo } from "react";
import { useLocalStorageValue } from "@/lib/useLocalStorageValue";
import type { DifficultyTier, ScenarioStep } from "./schema";
import type { ScenarioGrade } from "./evaluation";

const PLAYBOOK_KEY = "pitchiq:scenario-mode:playbook:v1";
/** Caps the playbook so it can't grow unbounded across a long session — oldest entries drop first, matching the coach-verdict cache's own cap. */
const MAX_PLAYBOOK_ENTRIES = 30;

export type SavedPlay = {
  id: string;
  scenarioSlug: string;
  tier: DifficultyTier;
  name: string;
  steps: ScenarioStep[];
  grade: ScenarioGrade;
  createdAt: number;
};

function parsePlaybook(raw: string | null): SavedPlay[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as SavedPlay[]) : [];
  } catch {
    return [];
  }
}

export function usePlaybook() {
  const [raw, setRaw] = useLocalStorageValue(PLAYBOOK_KEY);
  const plays = useMemo(() => parsePlaybook(raw), [raw]);

  const savePlay = useCallback(
    (play: Omit<SavedPlay, "id" | "createdAt">) => {
      const entry: SavedPlay = { ...play, id: crypto.randomUUID(), createdAt: Date.now() };
      const next = [...plays, entry];
      const trimmed = next.length > MAX_PLAYBOOK_ENTRIES ? next.slice(next.length - MAX_PLAYBOOK_ENTRIES) : next;
      setRaw(JSON.stringify(trimmed));
      return entry.id;
    },
    [plays, setRaw],
  );

  const deletePlay = useCallback(
    (id: string) => {
      setRaw(JSON.stringify(plays.filter((play) => play.id !== id)));
    },
    [plays, setRaw],
  );

  const duplicatePlay = useCallback(
    (id: string, name: string) => {
      const source = plays.find((play) => play.id === id);
      if (!source) return null;
      return savePlay({ scenarioSlug: source.scenarioSlug, tier: source.tier, steps: source.steps, grade: source.grade, name });
    },
    [plays, savePlay],
  );

  return { plays, savePlay, deletePlay, duplicatePlay };
}

export type SharedPlay = { scenarioSlug: string; tier: DifficultyTier; steps: ScenarioStep[] };

/** Encodes just the scenario slug, tier, and steps — the stage itself is re-derived from the scenario registry, keeping the link short. No backend: the whole play lives in the URL. */
export function encodeSharedPlay(play: SharedPlay): string {
  return encodeURIComponent(JSON.stringify(play));
}

export function decodeSharedPlay(encoded: string): SharedPlay | null {
  try {
    const parsed = JSON.parse(decodeURIComponent(encoded)) as Partial<SharedPlay>;
    if (typeof parsed.scenarioSlug !== "string" || !Array.isArray(parsed.steps)) return null;
    const tier: DifficultyTier = parsed.tier === "silver" || parsed.tier === "gold" ? parsed.tier : "bronze";
    return { scenarioSlug: parsed.scenarioSlug, tier, steps: parsed.steps };
  } catch {
    return null;
  }
}
