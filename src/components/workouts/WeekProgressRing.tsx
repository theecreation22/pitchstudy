"use client";

import { motion, useReducedMotion } from "framer-motion";

const SIZE = 36;
const STROKE = 3.5;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** A compact per-week completion ring next to the week heading — the program bar already shows overall progress; this is the "am I done with *this* week" signal (§B3). */
export function WeekProgressRing({ done, total }: { done: number; total: number }) {
  const reduceMotion = useReducedMotion();
  const fraction = total === 0 ? 0 : done / total;
  const isComplete = total > 0 && done === total;

  return (
    <div className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center" aria-hidden="true">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-9 w-9 -rotate-90">
        <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" stroke="var(--pitch-touchline)" strokeOpacity={0.25} strokeWidth={STROKE} />
        <motion.circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={isComplete ? "var(--attack)" : "var(--attack)"}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          initial={false}
          animate={{ strokeDashoffset: CIRCUMFERENCE * (1 - fraction) }}
          transition={{ duration: reduceMotion ? 0 : 0.4, ease: "easeOut" }}
          style={{ filter: isComplete ? "drop-shadow(0 0 3px var(--attack))" : undefined }}
        />
      </svg>
      <span className="absolute font-mono text-[9px] font-semibold text-pitch-touchline">
        {done}/{total}
      </span>
    </div>
  );
}
