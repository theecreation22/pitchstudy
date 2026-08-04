import type { Metadata } from "next";
import { TacticsLab } from "@/components/tactics-lab/TacticsLab";

export const metadata: Metadata = {
  title: "Tactics Lab · PitchStudy",
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
    <div className="dossier mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-4 py-10 sm:px-8 sm:py-16">
      {/*
        THESIS: Tactics analysis as a private paper trail, not a broadcast graphic — a coach's
          own working document, not a polished product screen.
        OWN-WORLD: Manila/carbon-paper ground, sepia typewriter ink, rubber-stamp verdicts
          in Priority/Carbon/Risk ink; rectangular file-card surfaces, stamped-box controls,
          no pill radii, no colored glow — offset paper-lift shadows only.
        STORY: A manager opens a case file on this formation, reads its typed assessment,
          stamps a verdict, and files it back into the Playbook.
        FIRST VIEWPORT: Plain eyebrow-plus-heading, matching the sitewide header pattern —
          the case-file card/stamp treatment was tried and reverted by request; the mode
          switcher below still reads as a tabbed folder divider, not a pill track.
        FORM: Scouting Dossier — assigned direction, seed key 57a4348d, candidate 3 of 7.
        FINISH: unreviewed and undocumented is unfinished; this build ends with the finish
          review, the verdict, and DESIGN.md.
      */}
      <header className="flex flex-col gap-3">
        <p className="font-mono text-xs uppercase tracking-widest text-pitch-marker">Tactics Lab</p>
        <h1 className="font-display text-4xl font-black uppercase leading-none tracking-tight text-pitch-line sm:text-6xl">
          Build a shape. See what it&apos;s made of.
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-pitch-touchline sm:text-lg">
          Drag players into a formation, set your team instructions, and read a live tactical
          assessment as you build — no waiting, no network. Everything here is one analyst&apos;s
          read on the shape you&apos;ve built, not objective truth.
        </p>
      </header>

      <TacticsLab coachAvailable={Boolean(process.env.ANTHROPIC_API_KEY)} />
    </div>
  );
}
