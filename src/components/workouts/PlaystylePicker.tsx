"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { getPlaystylesForGroup, type Attribute, type PositionGroup } from "@/lib/workouts";
import { AttributeRadar } from "./AttributeRadar";

const BALANCED_PROFILE: Record<Attribute, number> = { strength: 55, power: 55, speed: 55, agility: 55, endurance: 55, technical: 55 };

type Props = {
  positionGroup: PositionGroup;
  selectedId: string | undefined;
  onSelect: (id: string | undefined) => void;
};

/** The headline new axis (§2) — pick a playstyle within a position group and watch the radar and, via the parent regenerating the plan, the actual drill selection change with it. "Balanced" (no playstyle) is a real, equally-valid first-class option, not a fallback. */
export function PlaystylePicker({ positionGroup, selectedId, onSelect }: Props) {
  const playstyles = getPlaystylesForGroup(positionGroup);
  const selected = playstyles.find((p) => p.id === selectedId);
  const reduceMotion = useReducedMotion();

  return (
    <div className="tactics-panel flex flex-col gap-4 rounded-lg border border-pitch-touchline/30 p-5">
      <p className="font-mono text-xs uppercase tracking-widest text-pitch-marker">Train for your playstyle</p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          aria-pressed={!selectedId}
          onClick={() => onSelect(undefined)}
          className={`inline-flex min-h-11 items-center rounded-full border px-4 font-mono text-xs uppercase tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker ${
            !selectedId
              ? "border-attack bg-attack/10 text-attack"
              : "border-pitch-touchline/60 text-pitch-touchline hover:border-pitch-touchline hover:text-pitch-line"
          }`}
        >
          Balanced
        </button>
        {playstyles.map((style) => {
          const isSelected = selectedId === style.id;
          return (
            <button
              key={style.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(style.id)}
              className={`inline-flex min-h-11 items-center rounded-full border px-4 font-mono text-xs uppercase tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker ${
                isSelected
                  ? "border-attack bg-attack/10 text-attack"
                  : "border-pitch-touchline/60 text-pitch-touchline hover:border-pitch-touchline hover:text-pitch-line"
              }`}
            >
              {style.name}
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_220px] sm:items-center">
        <div className="relative flex flex-col gap-2">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={selected?.id ?? "balanced"}
              className="flex flex-col gap-2"
              initial={reduceMotion ? undefined : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: reduceMotion ? 0 : 0.25, ease: "easeOut" }}
            >
              <p className="text-sm font-semibold text-pitch-line">{selected ? selected.tagline : "An even split across every training quality — a safe, general-purpose starting point."}</p>
              <p className="text-sm leading-relaxed text-pitch-line/90">
                {selected ? selected.rationale : "Pick a playstyle above to re-weight this plan toward what that role actually demands — the drills themselves change, not just the labels."}
              </p>
              {selected?.relatedPositionCode && (
                <p className="font-mono text-[10px] uppercase tracking-widest text-pitch-touchline">
                  {`Reuses the ${selected.name} position page's own naming`}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        <AttributeRadar profile={selected?.attributeProfile ?? BALANCED_PROFILE} color={selected ? "var(--attack)" : "var(--touchline-muted)"} />
      </div>
    </div>
  );
}
