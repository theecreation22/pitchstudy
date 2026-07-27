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
        className="relative h-7 w-14 shrink-0 rounded-full border-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-line"
        style={{
          background: show ? "var(--defend-deep)" : "var(--pitch-card)",
          borderColor: show ? "var(--defend)" : "var(--pitch-touchline)",
          borderStyle: show ? "dashed" : "solid",
        }}
      >
        <motion.span
          className="absolute top-1 h-5 w-5 rounded-full bg-pitch-line shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
          animate={{ left: show ? "calc(100% - 1.5rem)" : "0.25rem" }}
          transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 30 }}
        />
      </button>
    </div>
  );
}
