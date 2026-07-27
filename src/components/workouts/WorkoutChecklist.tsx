"use client";

import { useCallback, useMemo, useState } from "react";
import {
  drillCategoryLabels,
  getAllDrills,
  type DrillCategory,
  type WorkoutPlan,
} from "@/lib/workouts";
import { useLocalStorageValue } from "@/lib/useLocalStorageValue";

type CategoryFilter = DrillCategory | "all";

const categoryFilters: CategoryFilter[] = [
  "all",
  "strength",
  "speed-agility",
  "endurance",
  "position-specific",
];

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
          <span className="text-pitch-marker">
            {completedCount} / {allDrills.length} drills
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-pitch-slate">
          <div
            className="h-full rounded-full bg-pitch-marker transition-[width] duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
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
                  ? "border-pitch-marker bg-pitch-marker/10 text-pitch-marker"
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
                Week {week.weekNumber} — {week.focus}
              </h2>
              <ul className="mt-4 flex flex-col gap-3">
                {drills.map((drill) => {
                  const isChecked = completed.has(drill.id);
                  return (
                    <li
                      key={drill.id}
                      className="flex items-start gap-3 rounded-lg border border-pitch-touchline/30 bg-pitch-card p-4"
                    >
                      <input
                        type="checkbox"
                        id={drill.id}
                        checked={isChecked}
                        onChange={() => toggleDrill(drill.id)}
                        className="mt-1 h-4 w-4 shrink-0 accent-pitch-marker focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
                      />
                      <label htmlFor={drill.id} className="flex flex-1 flex-col gap-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <span
                            className={`font-medium ${isChecked ? "text-pitch-touchline line-through" : "text-pitch-line"}`}
                          >
                            {drill.name}
                          </span>
                          <span className="rounded-full border border-pitch-touchline/40 px-2 py-0.5 font-mono text-xs uppercase tracking-wide text-pitch-touchline">
                            {drillCategoryLabels[drill.category]}
                          </span>
                        </span>
                        <span className="text-sm leading-relaxed text-pitch-touchline">
                          {drill.description}
                        </span>
                        <span className="font-mono text-xs text-pitch-marker">{drill.dosage}</span>
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
