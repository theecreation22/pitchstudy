"use client";

import { useMemo, useState } from "react";
import { generateProgram, type GeneratedProgram } from "@/lib/workouts";
import { PlaystylePicker } from "./PlaystylePicker";
import { WorkoutChecklist } from "./WorkoutChecklist";

/**
 * Ties the playstyle picker to the checklist — selecting a playstyle
 * regenerates the plan live (client-side, via the same deterministic
 * `generateProgram` the Plan Builder will use) so the drill selection
 * itself measurably changes, not just the radar (§2's acceptance bar).
 * This is exploratory for now: the choice isn't persisted across a reload
 * yet — that's the Plan Builder's "My Program" save, coming in a later phase.
 */
export function WorkoutPlanView({ initialPlan }: { initialPlan: GeneratedProgram }) {
  const [playstyleId, setPlaystyleId] = useState<string | undefined>(initialPlan.playstyleId);

  const plan = useMemo(() => {
    if (!playstyleId) return initialPlan;
    return generateProgram({
      positionGroup: initialPlan.positionGroup,
      playstyleId,
      level: initialPlan.level,
      equipment: initialPlan.equipment,
      slug: initialPlan.slug,
    });
  }, [playstyleId, initialPlan]);

  return (
    <div className="flex flex-col gap-8">
      <PlaystylePicker positionGroup={initialPlan.positionGroup} selectedId={playstyleId} onSelect={setPlaystyleId} />
      <WorkoutChecklist plan={plan} />
    </div>
  );
}
