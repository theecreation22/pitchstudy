import type { Metadata } from "next";
import { WorkoutsEntry } from "@/components/workouts/WorkoutsEntry";

export const metadata: Metadata = {
  title: "The Training Ground · PitchStudy",
  description: "Your personal training hub — a Player Card, a role-built four-week block, and a guided session whenever you're ready.",
};

export default function TrainingGroundPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-10 sm:px-8 sm:py-16">
      <div className="rounded-lg border border-pitch-touchline/30 bg-pitch-card p-4 text-sm leading-relaxed text-pitch-touchline">
        General fitness guidance, not medical advice. Check with a coach or medical professional before starting a
        new training program.
      </div>

      <WorkoutsEntry />
    </div>
  );
}
