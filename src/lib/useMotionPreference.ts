"use client";

import { useCallback } from "react";
import { useLocalStorageValue } from "./useLocalStorageValue";

const STORAGE_KEY = "pitchstudy:motion";

export type MotionPreference = "system" | "reduced" | "full";

const VALUES: MotionPreference[] = ["system", "reduced", "full"];

/**
 * A site-wide motion preference, defaulting to whatever the OS says.
 *
 * Until now the only signal was framer-motion's `useReducedMotion`, which
 * reads the `prefers-reduced-motion` media query and nothing else. That
 * leaves out anyone who wants the animation calmed down on this site
 * specifically without changing a system setting, which matters here because
 * 40 components animate.
 *
 * "full" is a deliberate third option rather than a boolean: someone whose OS
 * reduces motion globally may still want the pitch animations on, and a
 * two-state toggle cannot express that.
 */
export function useMotionPreference(): [MotionPreference, (next: MotionPreference) => void] {
  const [raw, setRaw] = useLocalStorageValue(STORAGE_KEY);
  const value = VALUES.includes(raw as MotionPreference) ? (raw as MotionPreference) : "system";
  const setValue = useCallback((next: MotionPreference) => setRaw(next), [setRaw]);
  return [value, setValue];
}

/** Maps to framer-motion's MotionConfig vocabulary, which drives every `useReducedMotion` call in the tree at once. */
export function toReducedMotionConfig(preference: MotionPreference): "user" | "always" | "never" {
  if (preference === "reduced") return "always";
  if (preference === "full") return "never";
  return "user";
}
