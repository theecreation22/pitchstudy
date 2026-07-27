import type { Metadata } from "next";
import { ChallengeMode } from "@/components/curriculum/ChallengeMode";

export const metadata: Metadata = {
  title: "Challenge — PitchIQ",
  description: "Random questions drawn from the Academy modules you've completed, with a best-streak score.",
};

export default function ChallengePage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-4 py-10 sm:px-8 sm:py-16">
      <header className="flex flex-col gap-2">
        <p className="font-mono text-xs uppercase tracking-widest text-press">Challenge</p>
        <h1 className="font-display text-4xl font-black uppercase leading-none tracking-tight text-pitch-line sm:text-6xl">
          Keep the streak alive.
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-pitch-touchline">
          Random questions from every Academy module you&apos;ve completed. One wrong answer
          resets the streak — how far can you go?
        </p>
      </header>

      <ChallengeMode />
    </div>
  );
}
