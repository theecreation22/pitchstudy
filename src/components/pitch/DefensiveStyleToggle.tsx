"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { DefensiveStyle } from "@/lib/formations";

type Props = {
  style: DefensiveStyle;
  onChange: (style: DefensiveStyle) => void;
  /**
   * Whether the control is currently meaningful. `defensiveStyle` only moves
   * players when a team is out of possession (see getFormationPlayers), so
   * callers pass the out-of-possession check here rather than rendering the
   * toggle conditionally themselves — keeping the component mounted is what
   * lets AnimatePresence play the exit animation.
   */
  visible?: boolean;
};

/** Chooses how whichever team is currently out of possession sets up — a high press near the halfway line, or a low block deep near its own goal. Fades and slides in when it becomes relevant, rather than sitting inert while in possession. */
export function DefensiveStyleToggle({ style, onChange, visible = true }: Props) {
  const reduceMotion = useReducedMotion();
  const isLowBlock = style === "low-block";

  return (
    <AnimatePresence initial={false}>
      {visible && (
        <motion.div
          className="inline-flex items-center gap-3 overflow-hidden rounded-full border border-pitch-touchline/30 bg-pitch-card px-3 py-2"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, x: -10 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, x: -10 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <span
            className={`font-mono text-xs uppercase tracking-widest ${!isLowBlock ? "text-press" : "text-pitch-touchline"}`}
          >
            High press
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={isLowBlock}
            aria-label="Toggle high press / low block"
            onClick={() => onChange(isLowBlock ? "high-press" : "low-block")}
            className="relative h-7 w-14 shrink-0 rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-line"
            // Same --grad-pill-* ramps the SegmentedTabs pills use, so the two
            // high-press/low-block controls in the app read as one language.
            style={{
              backgroundColor: isLowBlock ? "var(--defend)" : "var(--press)",
              backgroundImage: isLowBlock ? "var(--grad-pill-defend)" : "var(--grad-pill-press)",
            }}
          >
            <motion.span
              className="absolute top-1 left-1 h-5 w-5 rounded-full bg-pitch-line shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
              animate={{ x: isLowBlock ? 24 : 0 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.2, ease: "easeOut" }}
            />
          </button>
          <span
            className={`font-mono text-xs uppercase tracking-widest ${isLowBlock ? "text-defend-bright" : "text-pitch-touchline"}`}
          >
            Low block
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
