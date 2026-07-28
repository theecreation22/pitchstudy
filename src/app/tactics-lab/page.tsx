import type { Metadata } from "next";
import { TacticsLab } from "@/components/tactics-lab/TacticsLab";
import { ChalkDivider } from "@/components/effects/ChalkDivider";

export const metadata: Metadata = {
  title: "Tactics Lab · PitchIQ",
  description:
    "Design your own formation, set team instructions, and get instant tactical feedback from a live analysis engine.",
};

export default function TacticsLabPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-4 py-10 sm:px-8 sm:py-16">
      <header className="flex flex-col gap-3">
        <p className="font-mono text-xs uppercase tracking-widest text-pitch-marker">Tactics Lab</p>
        <h1 className="font-display text-4xl font-black uppercase leading-none tracking-tight text-pitch-line sm:text-6xl">
          Build a shape. See what it&apos;s made of.
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-pitch-touchline sm:text-lg">
          Drag players into a formation, set your team instructions, and watch a live tactical
          analysis update as you build — no waiting, no network. Everything here is an
          independent read on the shape you&apos;ve built, not objective truth.
        </p>
      </header>

      <ChalkDivider />

      <TacticsLab />
    </div>
  );
}
