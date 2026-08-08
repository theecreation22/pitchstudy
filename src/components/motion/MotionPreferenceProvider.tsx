"use client";

import { MotionConfig } from "framer-motion";
import { useMotionPreference, toReducedMotionConfig } from "@/lib/useMotionPreference";

/**
 * Applies the stored motion preference to every framer-motion component in
 * the tree.
 *
 * MotionConfig is what makes this a one-line change rather than a 40-file
 * one: every existing `useReducedMotion()` call reads from this context, so
 * no component needs to know the preference exists.
 */
export function MotionPreferenceProvider({ children }: { children: React.ReactNode }) {
  const [preference] = useMotionPreference();
  return <MotionConfig reducedMotion={toReducedMotionConfig(preference)}>{children}</MotionConfig>;
}
