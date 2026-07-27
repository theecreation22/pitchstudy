"use client";

import { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  drillCategoryLabels,
  getAllDrills,
  type DrillCategory,
  type WorkoutPlan,
} from "@/lib/workouts";
import { useLocalStorageValue } from "@/lib/useLocalStorageValue";
import { DrillCheckbox } from "./DrillCheckbox";

type CategoryFilter = DrillCategory | "all";

const categoryFilters: CategoryFilter[] = [
  "all",
  "strength",
  "speed-agility",
  "endurance",
  "position-specific",
];

const categoryColor: Record<DrillCategory, string> = {
  strength: "var(--press)",
  "speed-agility": "var(--attack)",
  endurance: "var(--defend)",
  "position-specific": "var(--touchline-muted)",
};

function storageKey(slug: string) {
  return `pitchiq:workout:${slug}`;
}

function useCompletedDrills(slug: string): [Set<string>, (id: string) => void] {
  const [raw, setRaw] = useLocalStorageValue(storageKey(slug));
  const completed = useMemo(() => new Set<string>(raw ? (JSON.parse(raw) as string[]) : []), [raw]);

  const toggle = useCallback(
    (id: string) => {
      const next = new Set(completed);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      setRaw(JSON.stringify([...next]));
    },
    [completed, setRaw],
  );

  return [completed, toggle];
}

export function WorkoutChecklist({ plan }: { plan: WorkoutPlan }) {
  const [completed, toggleDrill] = useCompletedDrills(plan.slug);
  const [filter, setFilter] = useState<CategoryFilter>("all");
  const allDrills = useMemo(() => getAllDrills(plan), [plan]);

  const completedCount = allDrills.filter((drill) => completed.has(drill.id)).length;
  const progressPercent = allDrills.length === 0 ? 0 : Math.round((completedCount / allDrills.length) * 100);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3 rounded-lg border border-pitch-touchline/30 bg-pitch-card p-6">
        <div className="flex items-center justify-between font-mono text-xs uppercase tracking-widest text-pitch-touchline">
          <span>Progress</span>
          <span className="text-attack">
            {completedCount} / {allDrills.length} drills
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

      <div role="group" aria-label="Filter by training type" className="flex flex-wrap gap-2">
        {categoryFilters.map((category) => {
          const isSelected = filter === category;
          return (
            <button
              key={category}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setFilter(category)}
              className={`inline-flex min-h-11 items-center rounded-full border px-3 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker ${
                isSelected
                  ? "border-attack bg-attack/10 text-attack"
                  : "border-pitch-touchline/60 text-pitch-touchline hover:border-pitch-touchline hover:text-pitch-line"
              }`}
            >
              {category === "all" ? "All" : drillCategoryLabels[category]}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-10">
        {plan.weeks.map((week) => {
          const drills = week.drills.filter(
            (drill) => filter === "all" || drill.category === filter,
          );
          if (drills.length === 0) return null;

          return (
            <section key={week.weekNumber}>
              <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-pitch-line">
                Week {week.weekNumber}: {week.focus}
              </h2>
              <ul className="mt-4 flex flex-col gap-3">
                {drills.map((drill) => {
                  const isChecked = completed.has(drill.id);
                  return (
                    <li
                      key={drill.id}
                      className="flex items-start gap-3 rounded-lg border border-pitch-touchline/30 bg-pitch-card p-4"
                    >
                      <DrillCheckbox
                        id={drill.id}
                        checked={isChecked}
                        onToggle={() => toggleDrill(drill.id)}
                      />
                      <label htmlFor={drill.id} className="flex flex-1 cursor-pointer flex-col gap-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="relative inline-block">
                            <span
                              className={`font-medium ${isChecked ? "text-pitch-touchline" : "text-pitch-line"}`}
                            >
                              {drill.name}
                            </span>
                            <motion.span
                              aria-hidden="true"
                              className="absolute top-1/2 left-0 h-[1.5px] bg-pitch-touchline"
                              initial={false}
                              animate={{ width: isChecked ? "100%" : "0%" }}
                              transition={{ duration: 0.25, ease: "easeOut" }}
                            />
                          </span>
                          <span
                            className="rounded-full border px-2 py-0.5 font-mono text-xs uppercase tracking-wide"
                            style={{ borderColor: categoryColor[drill.category], color: categoryColor[drill.category] }}
                          >
                            {drillCategoryLabels[drill.category]}
                          </span>
                        </span>
                        <span className="text-sm leading-relaxed text-pitch-touchline">
                          {drill.description}
                        </span>
                        <span className="font-mono text-xs text-attack">{drill.dosage}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
