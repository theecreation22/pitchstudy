"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { getFormation } from "@/lib/formations";

const containerVariants: Variants = {
  rest: {},
  hover: { transition: { staggerChildren: 0.035 } },
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.2 } },
};

const dotVariants: Variants = {
  rest: { scale: 1, opacity: 1 },
  hover: { scale: [1, 1.7, 1], opacity: 1, transition: { duration: 0.45, ease: "easeInOut" } },
  hidden: { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
};

export function MiniFormationDiagram({
  formationSlug,
  size = "md",
  animateIn = false,
}: {
  formationSlug: string;
  size?: "md" | "lg";
  /** Play a stagger-in "assembling" reveal once, when scrolled into view (detail-page hero usage). */
  animateIn?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const formation = getFormation(formationSlug);
  const width = size === "lg" ? 72 : 52;
  const height = width * (105 / 68);

  if (!formation) return null;

  return (
    <div
      aria-hidden="true"
      className="shrink-0 rounded-md border border-pitch-touchline/30 bg-pitch-deep p-1"
      style={{ width, height }}
    >
      <motion.svg
        viewBox="0 0 68 105"
        className="h-full w-full"
        initial={animateIn && !reduceMotion ? "hidden" : "rest"}
        whileInView={animateIn && !reduceMotion ? "visible" : undefined}
        viewport={animateIn ? { once: true } : undefined}
        whileHover={reduceMotion ? undefined : "hover"}
        variants={containerVariants}
      >
        <rect
          x="1"
          y="1"
          width="66"
          height="103"
          rx="2"
          fill="none"
          stroke="var(--pitch-touchline)"
          strokeOpacity="0.4"
          strokeWidth="1.2"
        />
        <line
          x1="1"
          y1="52.5"
          x2="67"
          y2="52.5"
          stroke="var(--pitch-touchline)"
          strokeOpacity="0.4"
          strokeWidth="1"
        />
        {formation.players.map((player) => (
          <motion.circle
            key={player.id}
            variants={dotVariants}
            cx={(player.x / 100) * 68}
            cy={(player.y / 100) * 105}
            r="3.4"
            fill="var(--attack)"
          />
        ))}
      </motion.svg>
    </div>
  );
}
