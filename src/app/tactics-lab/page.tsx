import type { Metadata } from "next";
import { TacticsLab } from "@/components/tactics-lab/TacticsLab";
import { ChalkDivider } from "@/components/effects/ChalkDivider";

export const metadata: Metadata = {
  title: "Tactics Lab · PitchIQ",
  description:
    "Design your own formation, set team instructions, and get instant tactical feedback from a live analysis engine.",
};

// Whether the coach verdict is available depends on a runtime secret
// (ANTHROPIC_API_KEY) that may be configured independently of the build —
// prerendering this page statically would bake in whatever the key's
// presence was at build time, not the actual runtime environment.
export const dynamic = "force-dynamic";

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

      <TacticsLab coachAvailable={Boolean(process.env.ANTHROPIC_API_KEY)} />
    </div>
  );
}
