"use client";

import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  drillCategoryLabels,
  equipmentLabels,
  movementPatternLabels,
  resolvePrescription,
  type Drill,
  type DrillCategory,
  type Level,
  type PrescriptionModifiers,
} from "@/lib/workouts";
import { DrillCheckbox } from "./DrillCheckbox";

export const CATEGORY_COLOR: Record<DrillCategory, string> = {
  strength: "var(--press)",
  "speed-agility": "var(--attack)",
  endurance: "var(--defend)",
  "position-specific": "var(--touchline-muted)",
};

function CategoryIcon({ category, color }: { category: DrillCategory; color: string }) {
  const common = { fill: "none", stroke: color, strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (category === "strength") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" {...common}>
        <rect x="2" y="9" width="3" height="6" rx="1" />
        <rect x="19" y="9" width="3" height="6" rx="1" />
        <line x1="5" y1="12" x2="19" y2="12" />
        <rect x="6.5" y="7" width="2.5" height="10" rx="1" />
        <rect x="15" y="7" width="2.5" height="10" rx="1" />
      </svg>
    );
  }
  if (category === "speed-agility") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" {...common}>
        <path d="M13 2 L5 14 h5 l-2 8 10-14h-5z" />
      </svg>
    );
  }
  if (category === "endurance") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" {...common}>
        <path d="M2 12h4l2-6 4 12 3-9 2 3h5" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" {...common}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.5" fill={color} />
    </svg>
  );
}

function EquipmentGlyph({ equipment }: { equipment: Drill["equipment"] }) {
  if (equipment === "bodyweight") {
    return (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="4.5" r="2" />
        <path d="M12 7v6M8 10l4-1 4 1M9 20l3-7 3 7" />
      </svg>
    );
  }
  if (equipment === "minimal") {
    return (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" aria-hidden="true">
        <circle cx="7" cy="12" r="3" />
        <circle cx="17" cy="12" r="3" />
        <line x1="10" y1="12" x2="14" y2="12" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" aria-hidden="true">
      <rect x="3" y="10" width="3" height="4" rx="0.5" />
      <rect x="18" y="10" width="3" height="4" rx="0.5" />
      <line x1="6" y1="12" x2="18" y2="12" />
    </svg>
  );
}

type Props = {
  drill: Drill;
  level: Level;
  checked: boolean;
  onToggle: () => void;
  /** True when this drill is one of the selected playstyle's signature drills (§A5) — flagged with a small role-accent badge. */
  isSignature?: boolean;
  /** The selected playstyle's sets/reps/rest/RPE shift, applied on top of the level-adjusted variant (§A4 step 4). */
  prescriptionModifiers?: PrescriptionModifiers;
  /** XP this drill awards on completion — shown as a floating "+XP" chip the instant it's checked (§B3). Omit to suppress the chip. */
  xpAward?: number;
  /** Position within the currently visible (filtered) list — staggers this card's entrance slightly behind the ones above it (§B5). */
  enterIndex?: number;
};

/** The redesigned drill card (§7) — a category spine + icon, scannable when collapsed, full depth on expand: execution, football-why, cue, mistake, and the level-appropriate progression/regression. Warm-up/cool-down drills get a visually distinct, quieter treatment so they read as bookends rather than main work. */
export function DrillCard({ drill, level, checked, onToggle, isSignature, prescriptionModifiers, xpAward, enterIndex = 0 }: Props) {
  const [expanded, setExpanded] = useState(false);
  const reduceMotion = useReducedMotion();
  const color = CATEGORY_COLOR[drill.category];
  const detailId = useId();
  const variant = resolvePrescription(drill, level, prescriptionModifiers);
  const isBookend = drill.isWarmup || drill.isCooldown;

  // Render-time prop comparison (not an effect) to catch the false->true
  // transition — the same pattern SiteNav uses for its pathname reset, kept
  // here so this doesn't trip react-hooks/set-state-in-effect.
  const [lastChecked, setLastChecked] = useState(checked);
  const [showXpBurst, setShowXpBurst] = useState(false);
  if (checked !== lastChecked) {
    setLastChecked(checked);
    if (checked) setShowXpBurst(true);
  }
  useEffect(() => {
    if (!showXpBurst) return;
    const timeout = setTimeout(() => setShowXpBurst(false), 900);
    return () => clearTimeout(timeout);
  }, [showXpBurst]);

  return (
    <motion.li
      layout={!reduceMotion}
      initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reduceMotion ? undefined : { opacity: 0, y: -6, scale: 0.98 }}
      transition={{ duration: reduceMotion ? 0 : 0.25, ease: "easeOut", delay: reduceMotion ? 0 : Math.min(enterIndex, 6) * 0.03 }}
      className={`overflow-hidden rounded-lg border bg-pitch-card ${isBookend ? "border-pitch-touchline/15 opacity-90" : "border-pitch-touchline/30"}`}
      style={{ borderLeftWidth: 4, borderLeftColor: color }}
    >
      <div className="flex items-start gap-3 p-4">
        <span className="relative">
          <DrillCheckbox id={`${detailId}-check`} checked={checked} onToggle={onToggle} color={color} />
          <AnimatePresence>
            {showXpBurst && xpAward && !reduceMotion && (
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute top-0 left-8 whitespace-nowrap font-mono text-xs font-bold text-attack"
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: [0, 1, 1, 0], y: -14 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: "easeOut", times: [0, 0.15, 0.6, 1] }}
              >
                +{xpAward} XP
              </motion.span>
            )}
          </AnimatePresence>
        </span>

        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
          aria-controls={detailId}
          className="flex flex-1 flex-col gap-1.5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="relative inline-block">
              <span className={`font-medium ${checked ? "text-pitch-touchline" : "text-pitch-line"}`}>{drill.name}</span>
              <motion.span
                aria-hidden="true"
                className="absolute top-1/2 left-0 h-[1.5px] bg-pitch-touchline"
                initial={false}
                animate={{ width: checked ? "100%" : "0%" }}
                transition={{ duration: reduceMotion ? 0 : 0.25, ease: "easeOut" }}
              />
            </span>
            {isBookend && (
              <span className="rounded-full border border-pitch-touchline/30 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-pitch-touchline">
                {drill.isWarmup ? "Warm-up" : "Cool-down"}
              </span>
            )}
            {isSignature && (
              <span className="rounded-full border border-attack/50 bg-attack/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-attack">
                Non-negotiable for your role
              </span>
            )}
            <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-xs uppercase tracking-wide" style={{ borderColor: color, color }}>
              <CategoryIcon category={drill.category} color={color} />
              {drillCategoryLabels[drill.category]}
            </span>
          </div>

          <p className="text-sm leading-relaxed text-pitch-line/90">{drill.shortDescription}</p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-pitch-touchline">
            <span className="text-attack">
              {variant.prescription.sets} x {variant.prescription.reps}
            </span>
            <span>Rest {variant.prescription.restSeconds}s</span>
            <span>RPE {variant.prescription.effortRPE}/10</span>
            <span className="inline-flex items-center gap-1" title={equipmentLabels[drill.equipment]}>
              <EquipmentGlyph equipment={drill.equipment} />
              {equipmentLabels[drill.equipment]}
            </span>
            <span>{movementPatternLabels[drill.movementPatterns[0]]}</span>
          </div>
        </button>
      </div>

      <motion.div
        id={detailId}
        initial={false}
        animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.3, ease: "easeOut" }}
        style={{ overflow: "hidden" }}
      >
        <div className="flex flex-col gap-4 border-t border-pitch-touchline/15 px-4 py-4 pl-[calc(1rem+2px)]">
          <div>
            <p className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-pitch-touchline">How to do it</p>
            <ol className="flex flex-col gap-1">
              {drill.execution.map((step, i) => (
                <li key={i} className="flex gap-2 text-sm leading-relaxed text-pitch-line/90">
                  <span className="font-mono text-xs text-attack">{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <p className="text-sm leading-relaxed text-pitch-line/90">
            <span className="font-mono text-[10px] uppercase tracking-widest text-pitch-touchline">Why it matters — </span>
            {drill.footballWhy}
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border border-attack/30 bg-attack/10 px-3 py-2 text-sm text-pitch-line/90">
              <span className="font-mono text-[10px] uppercase tracking-widest text-attack">Cue — </span>
              {drill.coachingCue}
            </div>
            <div className="rounded-md border border-press/30 bg-press/10 px-3 py-2 text-sm text-pitch-line/90">
              <span className="font-mono text-[10px] uppercase tracking-widest text-press">Not that — </span>
              {drill.commonMistake}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border border-pitch-touchline/25 px-3 py-2 text-sm text-pitch-line/90">
              <span className="font-mono text-[10px] uppercase tracking-widest text-pitch-touchline">{drill.progression.label} — </span>
              {drill.progression.change}
            </div>
            <div className="rounded-md border border-pitch-touchline/25 px-3 py-2 text-sm text-pitch-line/90">
              <span className="font-mono text-[10px] uppercase tracking-widest text-pitch-touchline">{drill.regression.label} — </span>
              {drill.regression.change}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.li>
  );
}
