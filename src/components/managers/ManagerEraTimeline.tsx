"use client";

import { motion, useReducedMotion } from "framer-motion";
import { managers } from "@/lib/managers";

const nodeColors = ["var(--attack)", "var(--defend)", "var(--press)"];

function getStartYear(years: string): number {
  const match = years.match(/\d{4}/);
  return match ? Number(match[0]) : 2000;
}

/** A horizontal era timeline for the managers hero — draws itself in as it scrolls into view. */
export function ManagerEraTimeline() {
  const reduceMotion = useReducedMotion();
  const sorted = [...managers].sort((a, b) => getStartYear(a.years) - getStartYear(b.years));
  const startYears = sorted.map((manager) => getStartYear(manager.years));
  const min = Math.min(...startYears);
  const max = Math.max(...startYears);
  const span = Math.max(1, max - min);

  return (
    <div aria-hidden="true" className="relative h-32 w-full select-none">
      <motion.div
        className="absolute top-1/2 right-0 left-0 h-px origin-left bg-pitch-touchline/30"
        initial={reduceMotion ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />

      {sorted.map((manager, index) => {
        const percent = ((getStartYear(manager.years) - min) / span) * 100;
        const above = index % 2 === 0;
        return (
          <motion.div
            key={manager.slug}
            className={`absolute flex -translate-x-1/2 flex-col items-center gap-1.5 ${
              above ? "bottom-1/2 mb-2 flex-col-reverse" : "top-1/2 mt-2"
            }`}
            style={{ left: `${percent}%` }}
            initial={reduceMotion ? false : { opacity: 0, y: above ? 6 : -6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.5 + index * 0.06 }}
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
