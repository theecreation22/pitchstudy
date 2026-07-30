import type { Metadata } from "next";
import Link from "next/link";
import { MyProgramView } from "@/components/workouts/MyProgramView";
import { ChalkDivider } from "@/components/effects/ChalkDivider";

export const metadata: Metadata = {
  title: "My Program · PitchStudy",
  description: "Your saved, custom-built four-week training program.",
};

export default function MyProgramPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-10 sm:px-8 sm:py-16">
      <Link href="/workouts" className="font-mono text-xs uppercase tracking-widest text-pitch-touchline hover:text-pitch-marker">
        ← Back to workouts
      </Link>

      <header className="flex flex-col gap-2">
        <h1 className="font-display text-4xl font-black uppercase leading-none tracking-tight text-pitch-line sm:text-6xl">
          My Program
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-pitch-touchline">Your saved, custom-built training plan.</p>
      </header>

      <div className="rounded-lg border border-pitch-touchline/30 bg-pitch-card p-4 text-sm leading-relaxed text-pitch-touchline">
        This plan is general fitness guidance, not medical advice. Check with a coach or medical professional before
        starting a new training program.
      </div>

      <ChalkDivider />

      <MyProgramView />
    </div>
  );
}
