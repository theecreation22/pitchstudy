"use client";

import { useCallback, useMemo } from "react";
import { useLocalStorageValue } from "../useLocalStorageValue";
import { generateProgram, type GenerateProgramInput, type GeneratedProgram } from "./plans";

const STORAGE_KEY = "pitchstudy:workouts:my-program";
const MY_PROGRAM_SLUG = "my-program";

/**
 * Only the Plan Builder's *inputs* are persisted, not the expanded 4-week
 * program — `generateProgram` is already deterministic (same inputs, same
 * output), so regenerating from these on load keeps the saved plan "stable
 * and re-loadable" without duplicating drill data that could drift from the
 * library.
 */
export type SavedProgramInput = GenerateProgramInput & { createdAt: string };

function parseSaved(raw: string | null): SavedProgramInput | undefined {
  if (!raw) return undefined;
  try {
    return JSON.parse(raw) as SavedProgramInput;
  } catch {
    return undefined;
  }
}

export function useMyProgram(): {
  input: SavedProgramInput | undefined;
  program: GeneratedProgram | undefined;
  save: (input: Omit<GenerateProgramInput, "slug" | "title">) => void;
  clear: () => void;
} {
  const [raw, setRaw] = useLocalStorageValue(STORAGE_KEY);
  const input = useMemo(() => parseSaved(raw), [raw]);
  const program = useMemo(
    () => (input ? generateProgram({ ...input, slug: MY_PROGRAM_SLUG, title: "My Program" }) : undefined),
    [input],
  );

  const save = useCallback(
    (nextInput: Omit<GenerateProgramInput, "slug" | "title">) => {
      const toSave: SavedProgramInput = { ...nextInput, createdAt: new Date().toISOString() };
      setRaw(JSON.stringify(toSave));
    },
    [setRaw],
  );

  const clear = useCallback(() => setRaw(""), [setRaw]);

  return { input, program, save, clear };
}
