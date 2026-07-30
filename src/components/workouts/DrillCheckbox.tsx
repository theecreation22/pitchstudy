"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export function DrillCheckbox({
  id,
  checked,
  onToggle,
  color = "var(--attack)",
}: {
  id: string;
  checked: boolean;
  onToggle: () => void;
  /** Defaults to amber, but the drill card passes its own category color so the burst matches the spine (§8). */
  color?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <span className="relative mt-0.5 shrink-0">
      <input type="checkbox" id={id} checked={checked} onChange={onToggle} className="peer sr-only" />
      <label
        htmlFor={id}
        style={{ borderColor: checked ? color : undefined, backgroundColor: checked ? `color-mix(in srgb, ${color} 15%, transparent)` : undefined }}
        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border-2 border-pitch-touchline/50 bg-pitch-deep transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-pitch-marker"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <motion.path
            d="M5 13 L10 18 L19 7"
            pathLength={1}
            initial={false}
            animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.3, ease: "easeOut" }}
          />
        </svg>
      </label>
      <AnimatePresence>
        {checked && !reduceMotion && (
          <motion.span
            key="burst"
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-md"
            initial={{ boxShadow: `0 0 0 0px ${color}`, opacity: 0.6 }}
            animate={{ boxShadow: `0 0 0 10px ${color}`, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>
    </span>
  );
}
