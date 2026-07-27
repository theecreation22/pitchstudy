"use client";

import { motion, useReducedMotion } from "framer-motion";

type Pool = {
  color: string;
  top: string;
  left: string;
  size: number;
  driftX: number;
  driftY: number;
  duration: number;
  delay: number;
};

const pools: Pool[] = [
  { color: "var(--red-flare)", top: "-10%", left: "8%", size: 620, driftX: 40, driftY: 30, duration: 70, delay: 0 },
  { color: "var(--gold-flood)", top: "-5%", left: "55%", size: 700, driftX: -50, driftY: 25, duration: 85, delay: 0.15 },
  { color: "var(--blue-volt)", top: "10%", left: "85%", size: 640, driftX: -35, driftY: -30, duration: 95, delay: 0.3 },
];

export function FloodlightAmbient() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {pools.map((pool, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full"
          style={{
            top: pool.top,
            left: pool.left,
            width: pool.size,
            height: pool.size,
            background: `radial-gradient(circle, ${pool.color} 0%, transparent 65%)`,
            opacity: 0.05,
            filter: "blur(40px)",
          }}
          initial={reduceMotion ? false : { opacity: 0, scale: 0.85 }}
          animate={
            reduceMotion
              ? { opacity: 0.05 }
              : {
                  opacity: [0, 0.09, 0.045, 0.07, 0.05],
                  scale: [0.85, 1.05, 1],
                  x: [0, pool.driftX, 0, -pool.driftX, 0],
                  y: [0, pool.driftY, 0, -pool.driftY, 0],
                }
          }
          transition={
            reduceMotion
              ? undefined
              : {
                  opacity: { duration: 1.1, delay: pool.delay, times: [0, 0.3, 0.5, 0.7, 1] },
                  scale: { duration: 1.1, delay: pool.delay },
                  x: { duration: pool.duration, delay: pool.delay + 1.1, repeat: Infinity, ease: "easeInOut" },
                  y: { duration: pool.duration * 1.2, delay: pool.delay + 1.1, repeat: Infinity, ease: "easeInOut" },
                }
          }
        />
      ))}
    </div>
  );
}
