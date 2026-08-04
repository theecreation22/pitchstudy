"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";

type Props = { shapeName: string };

/** Live "4-3-3" / "Custom Shape" label — the tactics-board equivalent of Football Manager naming your system as you drag players around. */
export function ShapeReadout({ shapeName }: Props) {
  const reduceMotion = useReducedMotion();
  return (
    <div className="flex items-center gap-3 rounded-sm border border-pitch-touchline/30 bg-pitch-card px-4 py-3">
      <p className="font-mono text-[10px] uppercase tracking-widest text-pitch-touchline">Recognized shape</p>
      <motion.p
        key={shapeName}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.25 }}
        className="font-display text-lg font-bold uppercase tracking-tight text-pitch-line"
      >
        {shapeName}
      </motion.p>
    </div>
  );
}
