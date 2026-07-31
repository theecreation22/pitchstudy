"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  buildWhyItDiffersNote,
  DRILL_XP,
  drillCategoryLabels,
  getDrill,
  getPlaystyle,
  instanceKey,
  movementPatternLabels,
  type DrillCategory,
  type GeneratedProgram,
  type GeneratedWeek,
  type MovementPattern,
} from "@/lib/workouts";
import { useProgress } from "@/lib/progress";
import { DrillCard } from "./DrillCard";
import { WeekProgressRing } from "./WeekProgressRing";
import { SessionMode } from "./SessionMode";

type CategoryFilter = DrillCategory | "all";
type FilterLens = "attribute" | "movement";

const categoryFilters: CategoryFilter[] = ["all", "strength", "speed-agility", "endurance", "position-specific"];

export function WorkoutChecklist({ plan }: { plan: GeneratedProgram }) {
  const { isDrillComplete, toggleDrillCompletion } = useProgress();
  const [lens, setLens] = useState<FilterLens>("attribute");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [movementFilter, setMovementFilter] = useState<MovementPattern | "all">("all");
  const [milestoneWeek, setMilestoneWeek] = useState<number | null>(null);
  const [milestoneBlock, setMilestoneBlock] = useState(false);
  const [sessionWeek, setSessionWeek] = useState<GeneratedWeek | undefined>(undefined);

  useEffect(() => {
    if (milestoneWeek === null) return;
    const timeout = setTimeout(() => {
      setMilestoneWeek(null);
      setMilestoneBlock(false);
    }, 3200);
    return () => clearTimeout(timeout);
  }, [milestoneWeek]);

  const playstyle = plan.playstyleId ? getPlaystyle(plan.playstyleId) : undefined;
  const signatureIds = useMemo(() => new Set(playstyle?.signatureDrillIds ?? []), [playstyle]);
  const whyItDiffers = playstyle ? buildWhyItDiffersNote(playstyle) : undefined;

  const allDrillIds = useMemo(() => plan.weeks.flatMap((week) => week.drillIds), [plan]);
  const allInstanceKeys = useMemo(
    () => plan.weeks.flatMap((week) => week.drillIds.map((id) => instanceKey(plan.slug, week.weekNumber, id))),
    [plan],
  );
  const completedCount = allInstanceKeys.filter((key) => isDrillComplete(key)).length;
  const progressPercent = allInstanceKeys.length === 0 ? 0 : Math.round((completedCount / allInstanceKeys.length) * 100);

  function handleToggle(week: GeneratedProgram["weeks"][number], drillId: string) {
    const key = instanceKey(plan.slug, week.weekNumber, drillId);
    const isChecking = !isDrillComplete(key);
    const weekKeys = week.drillIds.map((id) => instanceKey(plan.slug, week.weekNumber, id));
    const completedInWeek = weekKeys.filter((k) => isDrillComplete(k)).length;
    const weekJustCompleted = isChecking && completedInWeek + 1 === weekKeys.length;
    const blockJustCompleted = isChecking && completedCount + 1 === allInstanceKeys.length;
    toggleDrillCompletion(key, { xpAward: DRILL_XP, weekJustCompleted, blockJustCompleted });
    if (blockJustCompleted) {
      setMilestoneBlock(true);
      setMilestoneWeek(week.weekNumber);
    } else if (weekJustCompleted) {
      setMilestoneWeek(week.weekNumber);
    }
  }

  const movementOptions = useMemo(() => {
    const set = new Set<MovementPattern>();
    allDrillIds.forEach((id) => getDrill(id)?.movementPatterns.forEach((m) => set.add(m)));
    return Array.from(set);
  }, [allDrillIds]);

  return (
    <div className="flex flex-col gap-8">
      {whyItDiffers && (
        <p className="rounded-lg border border-attack/30 bg-attack/10 px-4 py-3 text-sm leading-relaxed text-pitch-line/90">
          <span className="font-mono text-[10px] uppercase tracking-widest text-attack">Why this plan differs — </span>
          {whyItDiffers}
        </p>
      )}

      <div className="flex flex-col gap-3 rounded-lg border border-pitch-touchline/30 bg-pitch-card p-6">
        <div className="flex items-center justify-between font-mono text-xs uppercase tracking-widest text-pitch-touchline">
          <span>Progress</span>
          <span className="text-attack">
            {completedCount} / {allDrillIds.length} drills
          </span>
        </div>
        <div className="relative h-3 w-full overflow-hidden rounded-full bg-pitch-slate">
          <motion.div
            className="relative h-full rounded-full bg-attack"
            initial={false}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ boxShadow: progressPercent > 0 ? "0 0 12px 1px var(--attack)" : undefined }}
          >
            <motion.span
              key={progressPercent}
              aria-hidden="true"
              className="absolute inset-y-0 right-0 w-6 bg-gradient-to-r from-transparent to-attack-hi"
              initial={{ opacity: 0.9 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
            />
          </motion.div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div role="tablist" aria-label="Filter lens" className="inline-flex w-fit gap-1 rounded-full border border-pitch-touchline/30 bg-pitch-card p-1">
          {(["attribute", "movement"] as FilterLens[]).map((option) => (
            <button
              key={option}
              type="button"
              role="tab"
              aria-selected={lens === option}
              onClick={() => setLens(option)}
              className={`relative min-h-9 rounded-full px-4 font-mono text-xs uppercase tracking-widest transition-colors ${
                lens === option ? "text-night-950" : "text-pitch-touchline hover:text-pitch-line"
              }`}
            >
              {lens === option && (
                <motion.span layoutId="lens-highlight" className="absolute inset-0 rounded-full bg-attack" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
              )}
              <span className="relative">{option === "attribute" ? "Train by Attribute" : "Train by Movement"}</span>
            </button>
          ))}
        </div>

        {lens === "attribute" ? (
          <div role="group" aria-label="Filter by training type" className="flex flex-wrap gap-2">
            {categoryFilters.map((category) => {
              const isSelected = categoryFilter === category;
              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setCategoryFilter(category)}
                  className={`relative inline-flex min-h-11 items-center rounded-full border px-3 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker ${
                    isSelected
                      ? "border-attack text-attack"
                      : "border-pitch-touchline/60 text-pitch-touchline hover:border-pitch-touchline hover:text-pitch-line"
                  }`}
                >
                  {isSelected && (
                    <motion.span layoutId="category-highlight" className="absolute inset-0 rounded-full bg-attack/10" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
                  )}
                  <span className="relative">{category === "all" ? "All" : drillCategoryLabels[category]}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div role="group" aria-label="Filter by movement pattern" className="flex flex-wrap gap-2">
            {(["all", ...movementOptions] as (MovementPattern | "all")[]).map((movement) => {
              const isSelected = movementFilter === movement;
              return (
                <button
                  key={movement}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setMovementFilter(movement)}
                  className={`relative inline-flex min-h-11 items-center rounded-full border px-3 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker ${
                    isSelected
                      ? "border-attack text-attack"
                      : "border-pitch-touchline/60 text-pitch-touchline hover:border-pitch-touchline hover:text-pitch-line"
                  }`}
                >
                  {isSelected && (
                    <motion.span layoutId="movement-highlight" className="absolute inset-0 rounded-full bg-attack/10" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
                  )}
                  <span className="relative">{movement === "all" ? "All" : movementPatternLabels[movement]}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-10">
        {plan.weeks.map((week) => {
          const weekDrills = week.drillIds
            .map((id) => getDrill(id))
            .filter((drill): drill is NonNullable<typeof drill> => {
              if (!drill) return false;
              if (lens === "attribute") return categoryFilter === "all" || drill.category === categoryFilter;
              return movementFilter === "all" || drill.movementPatterns.includes(movementFilter);
            });
          if (weekDrills.length === 0) return null;

          const weekKeys = week.drillIds.map((id) => instanceKey(plan.slug, week.weekNumber, id));
          const weekDone = weekKeys.filter((k) => isDrillComplete(k)).length;

          return (
            <section key={week.weekNumber}>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-pitch-line">
                  Week {week.weekNumber}: {week.focus}
                </h2>
                <WeekProgressRing done={weekDone} total={week.drillIds.length} />
                <button
                  type="button"
                  onClick={() => setSessionWeek(week)}
                  className="ml-auto inline-flex min-h-9 items-center rounded-full border border-attack/50 px-4 font-mono text-xs uppercase tracking-widest text-attack hover:border-attack"
                >
                  Start Session
                </button>
              </div>
              <ul className="mt-4 flex flex-col gap-3">
                <AnimatePresence mode="popLayout" initial={false}>
                  {weekDrills.map((drill, i) => {
                    const key = instanceKey(plan.slug, week.weekNumber, drill.id);
                    return (
                      <DrillCard
                        key={key}
                        drill={drill}
                        level={plan.level}
                        checked={isDrillComplete(key)}
                        onToggle={() => handleToggle(week, drill.id)}
                        isSignature={signatureIds.has(drill.id)}
                        prescriptionModifiers={playstyle?.prescriptionModifiers}
                        xpAward={DRILL_XP}
                        enterIndex={i}
                      />
                    );
                  })}
                </AnimatePresence>
              </ul>
            </section>
          );
        })}
      </div>

      <AnimatePresence>
        {milestoneWeek !== null && (
          <motion.div
            role="status"
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-lg border border-attack/40 bg-pitch-card px-5 py-4 shadow-[0_0_24px_-4px_var(--attack)]"
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <span className="font-display text-lg font-bold uppercase tracking-tight text-attack">
              {milestoneBlock ? "Block Complete" : `Week ${milestoneWeek} Complete`}
            </span>
            <span className="font-mono text-xs uppercase tracking-widest text-pitch-touchline">
              {milestoneBlock ? "Block Complete badge earned — new card, new block whenever you're ready" : "Match Fit badge earned"}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {sessionWeek && <SessionMode plan={plan} week={sessionWeek} onClose={() => setSessionWeek(undefined)} />}
      </AnimatePresence>
    </div>
  );
}
