"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { positions, positionMarkerPoint, type PositionInfo } from "@/lib/positions";
import type { PositionCode } from "@/lib/formations";
import { PitchMarkings } from "@/components/pitch/PitchMarkings";

/** Base positions only — the 6 tactical variations (IFB, IW, F9, B2B, SK, DLP) are Step 2's playstyle flavor, not a 2nd overlapping dot on the same spot here. */
const BASE_CODES: PositionCode[] = ["GK", "LB", "CB", "RB", "LWB", "RWB", "CDM", "CM", "CAM", "LM", "RM", "LW", "ST", "RW"];

type Entry = { code: PositionCode; info: PositionInfo; point: { x: number; y: number } };

function useOrderedPositions(): Entry[] {
  return useMemo(() => {
    const entries = BASE_CODES.map((code) => ({ code, info: positions[code], point: positionMarkerPoint(positions[code]) }));
    // Reading order (top-to-bottom, left-to-right) — arrow keys walk this list rather than solving a true 2D grid, since the pitch's zones aren't a rectangular grid.
    return entries.sort((a, b) => a.point.y - b.point.y || a.point.x - b.point.x);
  }, []);
}

type Props = {
  value?: PositionCode;
  onSelect: (code: PositionCode) => void;
};

/** "Where do you play?" (§3 Trial Day step 1) — the pitch itself as an input. Tapping (or Enter/Space on a focused zone) drops the player dot with a plant animation; arrow keys / Home / End rove focus between zones. */
export function TrialDayPitchPicker({ value, onSelect }: Props) {
  const entries = useOrderedPositions();
  const reduceMotion = useReducedMotion();
  const initialIndex = Math.max(
    0,
    entries.findIndex((e) => e.code === value),
  );
  const [focusIndex, setFocusIndex] = useState(initialIndex);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function moveFocus(nextIndex: number) {
    const clamped = (nextIndex + entries.length) % entries.length;
    setFocusIndex(clamped);
    buttonRefs.current[clamped]?.focus();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      moveFocus(index + 1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      moveFocus(index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      moveFocus(0);
    } else if (event.key === "End") {
      event.preventDefault();
      moveFocus(entries.length - 1);
    }
  }

  const selected = entries.find((e) => e.code === value);

  return (
    <div className="relative mx-auto aspect-[68/105] w-full max-w-xs">
      <PitchMarkings />
      <div className="absolute inset-0">
        {entries.map((entry, index) => {
          const isSelected = entry.code === value;
          return (
            <button
              key={entry.code}
              ref={(el) => {
                buttonRefs.current[index] = el;
              }}
              type="button"
              tabIndex={index === focusIndex ? 0 : -1}
              onFocus={() => setFocusIndex(index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              onClick={() => onSelect(entry.code)}
              aria-pressed={isSelected}
              aria-label={`${entry.info.name} (${entry.code})`}
              className="group absolute flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
              style={{ left: `${entry.point.x}%`, top: `${entry.point.y}%` }}
            >
              <span
                aria-hidden="true"
                className={`absolute inset-0 rounded-full border transition-colors ${
                  isSelected
                    ? "border-attack bg-attack/20"
                    : "border-pitch-touchline/40 bg-pitch-deep/60 group-hover:border-pitch-marker group-hover:bg-pitch-marker/10"
                }`}
              />
              <span
                className={`relative font-mono text-[10px] uppercase tracking-widest ${
                  isSelected ? "text-attack" : "text-pitch-touchline group-hover:text-pitch-line"
                }`}
              >
                {entry.code}
              </span>
            </button>
          );
        })}

        <AnimatePresence>
          {selected && (
            <motion.div
              key={selected.code}
              aria-hidden="true"
              className="pointer-events-none absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-attack shadow-[0_0_16px_4px_var(--attack)]"
              style={{ left: `${selected.point.x}%`, top: `${selected.point.y}%` }}
              initial={reduceMotion ? undefined : { scale: 0 }}
              animate={{ scale: reduceMotion ? 1 : [0, 1.4, 1] }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.45, ease: "easeOut", times: [0, 0.6, 1] }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
