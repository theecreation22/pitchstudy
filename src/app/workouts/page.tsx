import type { Metadata } from "next";
import Link from "next/link";
import { getAllDrillIds, positionGroupLabels, workoutPlans } from "@/lib/workouts";
import { TiltCard } from "@/components/motion/TiltCard";

export const metadata: Metadata = {
  title: "Workouts · PitchStudy",
  description:
    "Position-specific training plans for goalkeepers, defenders, midfielders, and attackers.",
};

export default function WorkoutsPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-4 py-10 sm:px-8 sm:py-16">
      <header className="flex flex-col gap-3">
        <h1 className="font-display text-4xl font-black uppercase leading-none tracking-tight text-pitch-line sm:text-6xl">
          Train for your role.
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-pitch-touchline sm:text-lg">
          Four-week foundations plans, one per position group: strength, speed and agility,
          endurance, and drills built for the specific demands of the role.
        </p>
      </header>

      <div className="rounded-lg border border-pitch-touchline/30 bg-pitch-card p-4 text-sm leading-relaxed text-pitch-touchline">
        These plans are general fitness guidance, not medical advice. Check with a coach or
        medical professional before starting a new training program.
      </div>

      <div className="flex flex-wrap gap-3 rounded-lg border border-attack/30 bg-attack/10 p-6">
        <div className="flex flex-1 flex-col gap-1">
          <p className="font-mono text-xs uppercase tracking-widest text-attack">Want something more specific?</p>
          <p className="text-sm leading-relaxed text-pitch-line/90">
            Build a program tuned to your exact role, playstyle, level, and equipment.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/workouts/my-program"
            className="inline-flex min-h-11 items-center rounded-full border border-attack/50 px-5 font-mono text-xs uppercase tracking-widest text-attack hover:border-attack"
          >
            My Program
          </Link>
          <Link
            href="/workouts/build"
            className="inline-flex min-h-11 items-center rounded-full bg-attack px-5 font-mono text-xs font-semibold uppercase tracking-widest text-night-950"
          >
            Build Your Program
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {workoutPlans.map((plan) => (
          <TiltCard
            key={plan.slug}
            href={`/workouts/${plan.slug}`}
            className="group flex flex-col gap-3 rounded-lg border border-pitch-touchline/30 bg-pitch-card p-6 transition-colors hover:border-pitch-marker focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
          >
            <p className="font-mono text-xs uppercase tracking-widest text-pitch-marker">
              {positionGroupLabels[plan.positionGroup]}
            </p>
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-pitch-line group-hover:text-pitch-marker">
              {plan.title}
            </h2>
            <p className="text-sm leading-relaxed text-pitch-touchline">{plan.tagline}</p>
            <p className="mt-auto font-mono text-xs text-pitch-touchline">
              {plan.weeks.length} weeks · {getAllDrillIds(plan).length} drills
            </p>
          </TiltCard>
        ))}
      </div>
    </div>
  );
}
