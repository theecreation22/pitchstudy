"use client";

import { motion, useReducedMotion } from "framer-motion";

const SIZE = 160;
const STROKE = 6;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** A chalk countdown ring with a tracing ball-dot (§B4) — the ring itself eases smoothly through each second via a 1s linear tween triggered by the state tick, rather than needing its own separate rAF loop. */
export function CountdownRing({ totalSeconds, remainingSeconds, color }: { totalSeconds: number; remainingSeconds: number; color: string }) {
  const reduceMotion = useReducedMotion();
  const fraction = totalSeconds === 0 ? 0 : Math.max(0, Math.min(1, remainingSeconds / totalSeconds));
  const angle = (1 - fraction) * 2 * Math.PI;
  const dotX = SIZE / 2 + Math.cos(angle) * RADIUS;
  const dotY = SIZE / 2 + Math.sin(angle) * RADIUS;

  return (
    <div className="relative inline-flex h-40 w-40 items-center justify-center">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-40 w-40 -rotate-90">
        <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" stroke="var(--pitch-touchline)" strokeOpacity={0.2} strokeWidth={STROKE} />
        <motion.circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          initial={false}
          animate={{ strokeDashoffset: CIRCUMFERENCE * (1 - fraction) }}
          transition={{ duration: reduceMotion ? 0 : 1, ease: "linear" }}
        />
        {!reduceMotion && (
          <circle cx={dotX} cy={dotY} r={STROKE + 2} fill={color} stroke="var(--pitch-card)" strokeWidth={2} />
        )}
      </svg>
      <span className="absolute font-mono text-3xl font-bold text-pitch-line">{remainingSeconds}</span>
    </div>
  );
}
