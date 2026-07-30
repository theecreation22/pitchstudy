"use client";

import Link from "next/link";
import { useMyProgram } from "@/lib/workouts/myProgram";
import { WorkoutPlanView } from "./WorkoutPlanView";

/** Reads the Plan Builder's saved inputs and regenerates the plan client-side — there's no server-side data to prerender since this is per-visitor localStorage. */
export function MyProgramView() {
  const { program } = useMyProgram();

  if (!program) {
    return (
      <div className="flex flex-col items-start gap-4 rounded-lg border border-pitch-touchline/30 bg-pitch-card p-8">
        <p className="text-lg font-semibold text-pitch-line">You haven&apos;t built a program yet.</p>
        <p className="max-w-md text-sm leading-relaxed text-pitch-touchline">
          The Plan Builder walks through your role, playstyle, level, and equipment, then generates a four-week program
          you can save and come back to.
        </p>
        <Link
          href="/workouts/build"
          className="inline-flex min-h-11 items-center rounded-full bg-attack px-6 font-mono text-xs font-semibold uppercase tracking-widest text-night-950"
        >
          Build your program
        </Link>
      </div>
    );
  }

  return <WorkoutPlanView initialPlan={program} />;
}
