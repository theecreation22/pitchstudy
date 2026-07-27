import type { Metadata } from "next";
import Link from "next/link";
import { modules } from "@/lib/curriculum";
import { AcademyDashboard } from "@/components/curriculum/AcademyDashboard";
import { AcademyChalkLoop } from "@/components/curriculum/AcademyChalkLoop";

export const metadata: Metadata = {
  title: "Academy — PitchIQ",
  description: "Structured football lessons with knowledge checks, module quizzes, XP, and badges.",
};

export default function AcademyPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-4 py-10 sm:px-8 sm:py-16">
      <section className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
        <header className="flex flex-col gap-3 lg:flex-1">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.15em] text-attack">
            Academy
          </p>
          <h1 className="text-grad-kickoff font-display text-4xl font-black uppercase leading-none tracking-tight sm:text-6xl">
            Six modules. Your pace.
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-pitch-touchline sm:text-lg">
            Short, interactive lessons with a knowledge check built in, followed by a module quiz
            once you&apos;re ready. Progress saves on this device only — no account needed.
          </p>
        </header>

        <div className="mx-auto w-full max-w-xs sm:max-w-sm lg:mx-0 lg:max-w-sm">
          <AcademyChalkLoop />
        </div>
      </section>

      <AcademyDashboard modules={modules} />

      <p className="text-sm leading-relaxed text-pitch-touchline">
        Prefer a quick, format-specific quiz instead?{" "}
        <Link href="/quiz" className="text-defend-bright hover:underline">
          Try the classic Formations / Positions / Managers quizzes →
        </Link>
      </p>
    </div>
  );
}
