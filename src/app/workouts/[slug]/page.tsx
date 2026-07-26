import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getWorkoutPlan, workoutPlans } from "@/lib/workouts";
import { WorkoutChecklist } from "@/components/workouts/WorkoutChecklist";

export function generateStaticParams() {
  return workoutPlans.map((plan) => ({ slug: plan.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const plan = getWorkoutPlan(slug);

  return {
    title: plan ? `${plan.title} — PitchIQ` : "Workout plan — PitchIQ",
    description: plan?.tagline,
  };
}

export default async function WorkoutPlanPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const plan = getWorkoutPlan(slug);

  if (!plan) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-10 sm:px-8 sm:py-16">
      <Link
        href="/workouts"
        className="font-mono text-xs uppercase tracking-widest text-pitch-touchline hover:text-pitch-marker"
      >
        ← Back to workouts
      </Link>

      <header className="flex flex-col gap-2">
        <p className="font-mono text-sm text-pitch-marker">{plan.group}</p>
        <h1 className="font-display text-4xl font-black uppercase tracking-tight text-pitch-line sm:text-6xl">
          {plan.title}
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-pitch-touchline">{plan.tagline}</p>
      </header>

      <div className="rounded-lg border border-pitch-touchline/30 bg-pitch-card p-4 text-sm leading-relaxed text-pitch-touchline">
        This plan is general fitness guidance, not medical advice. Check with a coach or medical
        professional before starting a new training program.
      </div>

      <WorkoutChecklist plan={plan} />
    </div>
  );
}
