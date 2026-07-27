"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, motionValue, useReducedMotion, type MotionValue } from "framer-motion";
import type { Formation } from "@/lib/formations";
import { PitchMarkings } from "./PitchMarkings";

function useMarkerMotionValues(count: number) {
  const [values] = useState<{ x: MotionValue<number>; y: MotionValue<number> }[]>(() =>
    Array.from({ length: count }, () => ({ x: motionValue(0), y: motionValue(0) })),
  );
  return values;
}

export function SandboxPitch({ formation }: { formation: Formation }) {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const markerMotion = useMarkerMotionValues(formation.players.length);

  function resetToFormation() {
    markerMotion.forEach(({ x, y }) => {
      animate(x, 0, { type: "spring", stiffness: 140, damping: 18 });
      animate(y, 0, { type: "spring", stiffness: 140, damping: 18 });
    });
  }

  // Snap any dragged players back home when the underlying formation changes
  // (e.g. switching formations while sandbox mode stays open).
  useEffect(() => {
    resetToFormation();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- resetToFormation is stable across renders (markerMotion never changes)
  }, [formation.slug]);

  return (
    <div className="flex flex-col gap-3">
      <div
        ref={containerRef}
        className="relative w-full touch-none select-none aspect-[68/105] rounded-xl border-2 border-pitch-touchline/25 bg-pitch-deep p-2 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.7)] sm:p-3"
      >
        <PitchMarkings />

        {formation.players.map((player, index) => (
          <motion.div
            key={player.id}
            drag={!reduceMotion}
            dragConstraints={containerRef}
            dragElastic={0.05}
            dragMomentum={false}
            whileDrag={{ scale: 1.15, zIndex: 30 }}
            style={{
              left: `${player.x}%`,
              top: `${player.y}%`,
              x: markerMotion[index].x,
              y: markerMotion[index].y,
            }}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none active:cursor-grabbing"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-pitch-line/20 bg-pitch-card font-mono text-xs font-semibold text-pitch-line shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
              {player.code}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-xs leading-relaxed text-pitch-touchline">
          Drag any player to test your own shape. Nothing here is saved.
        </p>
        <button
          type="button"
          onClick={resetToFormation}
          className="inline-flex min-h-11 w-fit shrink-0 items-center justify-center rounded-md border border-blue-volt px-4 font-display text-xs font-bold uppercase tracking-wide text-blue-volt transition-colors hover:bg-blue-volt/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
        >
          Reset to formation
        </button>
      </div>
    </div>
  );
}
