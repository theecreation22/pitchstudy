"use client";

import { motion, useReducedMotion } from "framer-motion";
import { managers } from "@/lib/managers";

const nodeColors = ["var(--attack)", "var(--defend)", "var(--press)"];

function getStartYear(years: string): number {
  const match = years.match(/\d{4}/);
  return match ? Number(match[0]) : 2000;
}

const EDGE_INSET = 3; // percent — keeps the first/last label from clipping the container edge
const NEAR_OFFSET = 8; // px from the line, inner stagger tier
const FAR_OFFSET = 48; // px from the line, outer stagger tier

/** A horizontal era timeline for the managers hero — draws itself in as it scrolls into view. */
export function ManagerEraTimeline() {
  const reduceMotion = useReducedMotion();
  const sorted = [...managers].sort((a, b) => getStartYear(a.years) - getStartYear(b.years));

  return (
    <div aria-hidden="true" className="relative h-48 w-full select-none">
      <motion.div
        className="absolute top-1/2 right-0 left-0 h-px origin-left bg-pitch-touchline/30"
        initial={reduceMotion ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />

      {sorted.map((manager, index) => {
        // Spaced evenly by chronological rank rather than scaled to each
        // manager's exact year: with managers spanning 1944-present, over
        // half of them fall in the last 25 years, so true-to-scale spacing
        // piled their labels on top of each other. Order is still left to
        // right, oldest to newest — just not distance-proportional.
        const percent =
          sorted.length > 1
            ? EDGE_INSET + (index / (sorted.length - 1)) * (100 - EDGE_INSET * 2)
            : 50;
        const above = index % 2 === 0;
        const tier = Math.floor(index / 2) % 2;
        const offset = tier === 0 ? NEAR_OFFSET : FAR_OFFSET;

        return (
          <motion.div
            key={manager.slug}
            className={`absolute flex -translate-x-1/2 flex-col items-center gap-1.5 ${
              above ? "bottom-1/2 flex-col-reverse" : "top-1/2"
            }`}
            style={{
              left: `${percent}%`,
              marginBottom: above ? offset : undefined,
              marginTop: above ? undefined : offset,
            }}
            initial={reduceMotion ? false : { opacity: 0, y: above ? 6 : -6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.5 + index * 0.05 }}
          >
            <span
              className="h-3 w-3 shrink-0 rounded-full ring-2 ring-pitch-slate"
              style={{ background: nodeColors[index % nodeColors.length] }}
            />
            <span className="font-mono text-[10px] whitespace-nowrap uppercase tracking-wide text-pitch-touchline">
              {manager.name.split(" ").pop()}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
