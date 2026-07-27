"use client";

import { motion, useReducedMotion } from "framer-motion";

export function OpponentToggle({
  show,
  onChange,
}: {
  show: boolean;
  onChange: (show: boolean) => void;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-pitch-touchline/30 bg-pitch-card px-3 py-2">
      <span
        className={`font-mono text-xs uppercase tracking-widest ${show ? "text-defend-bright" : "text-pitch-touchline"}`}
      >
        Show opponent
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={show}
        aria-label="Toggle the opponent overlay"
        onClick={() => onChange(!show)}
        className="relative h-7 w-14 shrink-0 rounded-full border-2 border-dashed border-defend transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-line"
        style={{ background: show ? "var(--defend-deep)" : "transparent" }}
      >
        <motion.span
          className="absolute top-1 left-1 h-5 w-5 rounded-full bg-pitch-line shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
          animate={{ x: show ? 24 : 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.2, ease: "easeOut" }}
        />
      </button>
    </div>
  );
}
