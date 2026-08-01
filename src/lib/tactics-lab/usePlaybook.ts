"use client";

import { useCallback, useMemo } from "react";
import { useLocalStorageValue } from "@/lib/useLocalStorageValue";
import { PLAYBOOK_SCHEMA_VERSION, type PlaybookEntry } from "./playbookSchema";

const STORAGE_KEY = "pitchstudy:tactics-lab:playbook:v1";
/** Generous but bounded — localStorage isn't infinite (§7). Oldest entries drop first, matching the scenario-mode playbook's own cap. */
const MAX_ENTRIES = 200;

function isPlaybookEntry(value: unknown): value is PlaybookEntry {
  if (!value || typeof value !== "object") return false;
  const entry = value as Partial<PlaybookEntry>;
  return (
    entry.schemaVersion === PLAYBOOK_SCHEMA_VERSION &&
    (entry.type === "formation" || entry.type === "play") &&
    typeof entry.id === "string" &&
    typeof entry.number === "number"
  );
}

/** Corrupt or future-schema entries fail soft (§7) — skipped rather than crashing the whole gallery. */
function parsePlaybook(raw: string | null): PlaybookEntry[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((entry) => {
      const valid = isPlaybookEntry(entry);
      if (!valid) console.warn("Skipping unreadable Playbook entry", entry);
      return valid;
    });
  } catch {
    return [];
  }
}

export function lowestFreeNumber(entries: PlaybookEntry[], type: "formation" | "play", excludeId?: string): number {
  const taken = new Set(entries.filter((entry) => entry.type === type && entry.id !== excludeId).map((entry) => entry.number));
  for (let candidate = 1; candidate <= 99; candidate += 1) {
    if (!taken.has(candidate)) return candidate;
  }
  return 99;
}

export function useTacticsPlaybook() {
  const [raw, setRaw] = useLocalStorageValue(STORAGE_KEY);
  const entries = useMemo(() => parsePlaybook(raw), [raw]);

  const persist = useCallback((next: PlaybookEntry[]) => setRaw(JSON.stringify(next)), [setRaw]);

  const findByNumber = useCallback(
    (type: "formation" | "play", number: number) => entries.find((entry) => entry.type === type && entry.number === number) ?? null,
    [entries],
  );

  /** Creates a new entry or updates an existing one by id — the save sheet decides which via its own save/save-as-new UI. */
  const upsert = useCallback(
    (entry: PlaybookEntry) => {
      const now = new Date().toISOString();
      const existingIndex = entries.findIndex((existing) => existing.id === entry.id);
      const stamped: PlaybookEntry = {
        ...entry,
        updatedAt: now,
        createdAt: existingIndex >= 0 ? entries[existingIndex].createdAt : now,
      };
      const next =
        existingIndex >= 0 ? entries.map((existing, i) => (i === existingIndex ? stamped : existing)) : [...entries, stamped];
      const trimmed = next.length > MAX_ENTRIES ? next.slice(next.length - MAX_ENTRIES) : next;
      persist(trimmed);
      return stamped;
    },
    [entries, persist],
  );

  /** Swaps the `number` field between two same-type entries — the save sheet's "swap numbers" offer when a chosen number is taken. */
  const swapNumbers = useCallback(
    (aId: string, bId: string) => {
      const a = entries.find((entry) => entry.id === aId);
      const b = entries.find((entry) => entry.id === bId);
      if (!a || !b) return;
      persist(
        entries.map((entry) =>
          entry.id === aId ? { ...entry, number: b.number } : entry.id === bId ? { ...entry, number: a.number } : entry,
        ),
      );
    },
    [entries, persist],
  );

  const remove = useCallback((id: string) => persist(entries.filter((entry) => entry.id !== id)), [entries, persist]);

  /** Re-inserts an entry exactly as given, with no restamping — for the delete-undo toast, not a real edit. */
  const restore = useCallback((entry: PlaybookEntry) => persist([...entries, entry]), [entries, persist]);

  const rename = useCallback(
    (id: string, name: string) =>
      persist(entries.map((entry) => (entry.id === id ? { ...entry, name, updatedAt: new Date().toISOString() } : entry))),
    [entries, persist],
  );

  const renumber = useCallback(
    (id: string, number: number) =>
      persist(entries.map((entry) => (entry.id === id ? { ...entry, number, updatedAt: new Date().toISOString() } : entry))),
    [entries, persist],
  );

  const duplicate = useCallback(
    (id: string) => {
      const source = entries.find((entry) => entry.id === id);
      if (!source) return null;
      const now = new Date().toISOString();
      const copy: PlaybookEntry = {
        ...source,
        id: crypto.randomUUID(),
        number: lowestFreeNumber(entries, source.type),
        name: `${source.name} (copy)`,
        createdAt: now,
        updatedAt: now,
      };
      persist([...entries, copy]);
      return copy;
    },
    [entries, persist],
  );

  // Writes the whole playbook wholesale — used by sync's merge step, which
  // has already unioned local and cloud entries and just needs it stored.
  const replaceAll = useCallback((next: PlaybookEntry[]) => persist(next), [persist]);

  return { entries, upsert, swapNumbers, remove, restore, rename, renumber, duplicate, findByNumber, replaceAll };
}
