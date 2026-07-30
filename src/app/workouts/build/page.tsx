import type { Metadata } from "next";
import Link from "next/link";
import { PlanBuilderWizard } from "@/components/workouts/PlanBuilderWizard";
import { ChalkDivider } from "@/components/effects/ChalkDivider";

export const metadata: Metadata = {
  title: "Build your program · PitchStudy",
  description: "A guided wizard that generates a four-week training program for your role, playstyle, level, and equipment.",
};

export default function PlanBuilderPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-10 sm:px-8 sm:py-16">
      <Link href="/workouts" className="font-mono text-xs uppercase tracking-widest text-pitch-touchline hover:text-pitch-marker">
        ← Back to workouts
      </Link>

      <header className="flex flex-col gap-2">
        <h1 className="font-display text-4xl font-black uppercase leading-none tracking-tight text-pitch-line sm:text-6xl">
          Build your program.
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-pitch-touchline">
          A few quick questions, then a four-week plan built specifically for your role and playstyle.
        </p>
      </header>

      <ChalkDivider />

      <PlanBuilderWizard />
    </div>
  );
}
