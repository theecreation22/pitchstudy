"use client";

import { useReducedMotion } from "framer-motion";

const dots: [number, number][] = [
  [15, 85],
  [53, 85],
  [34, 68],
  [15, 45],
  [53, 45],
  [34, 30],
  [34, 12],
];

/** A small formation sketching itself in looping chalk strokes — the Academy hero's auto-playing visual. */
export function AcademyChalkLoop() {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <svg viewBox="0 0 68 105" className="mx-auto w-full max-w-[220px] opacity-50" aria-hidden="true">
        <rect x="1" y="1" width="66" height="103" rx="1.5" fill="none" stroke="var(--attack)" strokeWidth="0.6" />
        {dots.map(([x, y], index) => (
          <circle key={index} cx={x} cy={y} r="2.2" fill="var(--attack)" />
        ))}
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 68 105" className="mx-auto w-full max-w-[220px]" aria-hidden="true">
      <g fill="none" stroke="var(--attack)" strokeWidth="0.6" strokeLinecap="round">
        <rect
          className="chalk-loop"
          x="1"
          y="1"
          width="66"
          height="103"
          rx="1.5"
          pathLength={1}
          style={{ animationDelay: "0s" }}
        />
        <line
          className="chalk-loop"
          x1="1"
          y1="52.5"
          x2="67"
          y2="52.5"
          pathLength={1}
          style={{ animationDelay: "0.3s" }}
        />
        <path className="chalk-loop" d="M 15 85 L 34 68 L 15 45" pathLength={1} style={{ animationDelay: "0.6s" }} />
        <path className="chalk-loop" d="M 53 85 L 34 68 L 53 45" pathLength={1} style={{ animationDelay: "0.8s" }} />
        <path className="chalk-loop" d="M 15 45 L 34 30 L 34 12" pathLength={1} style={{ animationDelay: "1s" }} />
        <path className="chalk-loop" d="M 53 45 L 34 30" pathLength={1} style={{ animationDelay: "1.2s" }} />
      </g>
      <g fill="var(--attack)">
        {dots.map(([x, y], index) => (
          <circle
            key={index}
            className="chalk-loop-dot"
            cx={x}
            cy={y}
            r="2.2"
            style={{ animationDelay: `${1.2 + index * 0.1}s` }}
          />
        ))}
      </g>
    </svg>
  );
}
