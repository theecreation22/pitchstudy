"use client";

import { motion, useReducedMotion } from "framer-motion";

/** A hand-drawn horizontal chalk line — draws itself in as it scrolls into view. Used as a section divider in place of a plain border. */
export function ChalkDivider({ className = "" }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <svg
      viewBox="0 0 400 12"
      preserveAspectRatio="none"
      className={`h-3 w-full overflow-visible ${className}`}
      aria-hidden="true"
    >
      <motion.path
        d="M2 6 Q40 3, 80 7 T160 5 T240 7 T320 4 T398 6"
        fill="none"
        stroke="var(--pitch-touchline)"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeOpacity="0.55"
        pathLength={1}
        initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />
    </svg>
  );
}
