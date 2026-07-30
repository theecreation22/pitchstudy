"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Phase } from "@/lib/formations";

export function PhaseToggle({ phase, onChange }: { phase: Phase; onChange: (phase: Phase) => void }) {
  const reduceMotion = useReducedMotion();
  const isOut = phase === "out-of-possession";

  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-pitch-touchline/30 bg-pitch-card px-3 py-2">
      <span
        className={`font-mono text-xs uppercase tracking-widest ${!isOut ? "text-attack" : "text-pitch-touchline"}`}
      >
        In possession
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={isOut}
        aria-label="Toggle in possession / out of possession"
        onClick={() => onChange(isOut ? "in-possession" : "out-of-possession")}
        className="relative h-7 w-14 shrink-0 rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-line"
        style={{ background: isOut ? "var(--defend)" : "var(--attack)" }}
      >
        <motion.span
          className="absolute top-1 left-1 h-5 w-5 rounded-full bg-pitch-line shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
          animate={{ x: isOut ? 24 : 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.2, ease: "easeOut" }}
        />
      </button>
      <span
        className={`font-mono text-xs uppercase tracking-widest ${isOut ? "text-defend-bright" : "text-pitch-touchline"}`}
      >
        Out of possession
      </span>
    </div>
  );
}
