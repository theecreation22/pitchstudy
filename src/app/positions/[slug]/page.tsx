import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPosition, positions } from "@/lib/positions";
import { getWorkoutPlanForPosition } from "@/lib/workouts";
import { ZoneDiagram } from "@/components/pitch/ZoneDiagram";

export function generateStaticParams() {
  return Object.keys(positions).map((code) => ({ slug: code.toLowerCase() }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const position = getPosition(slug.toUpperCase());

  return {
    title: position ? `${position.name} (${position.code}) · PitchStudy` : "Position · PitchStudy",
    description: position?.summary,
  };
}

export default async function PositionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const position = getPosition(slug.toUpperCase());

  if (!position) {
    notFound();
  }

  const workoutPlan = getWorkoutPlanForPosition(position.code);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-10 sm:px-8 sm:py-16">
      <Link
        href="/explore"
        className="font-mono text-xs uppercase tracking-widest text-pitch-touchline hover:text-pitch-marker"
      >
        ← Back to the pitch
      </Link>

      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <p className="font-mono text-sm text-pitch-marker">{position.code}</p>
          {position.isHybrid && (
            <span className="rounded-full border border-pitch-touchline/40 px-2 py-0.5 font-mono text-xs uppercase tracking-widest text-pitch-touchline">
              Hybrid role
            </span>
          )}
        </div>
        <h1 className="font-display text-4xl font-black uppercase leading-none tracking-tight text-pitch-line sm:text-6xl">
          {position.name}
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-pitch-touchline">
          {position.summary}
        </p>
        {workoutPlan && (
          <Link
            href={`/workouts/${workoutPlan.slug}`}
            className="mt-2 inline-flex min-h-11 w-fit items-center gap-2 rounded-full border border-pitch-marker px-4 font-mono text-xs uppercase tracking-widest text-pitch-marker transition-colors hover:bg-pitch-marker/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
          >
            Train for this position →
          </Link>
        )}
      </header>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
        <div className="flex flex-col gap-8 lg:flex-1">
          <section className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-pitch-touchline">
                In possession
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-pitch-line/90">
                {position.inPossession}
              </p>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-pitch-touchline">
                Out of possession
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-pitch-line/90">
                {position.outOfPossession}
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold uppercase tracking-tight text-pitch-line">
              How to play it
            </h2>
            <ul className="mt-3 max-w-2xl space-y-2 text-sm leading-relaxed text-pitch-line/90">
              {position.howToPlay.map((step) => (
                <li key={step} className="flex gap-2">
                  <span aria-hidden="true" className="text-pitch-marker">
                    ›
                  </span>
                  {step}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold uppercase tracking-tight text-pitch-line">
              Common mistakes
            </h2>
            <ul className="mt-3 max-w-2xl space-y-2 text-sm leading-relaxed text-pitch-line/90">
              {position.commonMistakes.map((mistake) => (
                <li key={mistake} className="flex gap-2">
                  <span aria-hidden="true" className="text-pitch-touchline">
                    −
                  </span>
                  {mistake}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="flex w-full flex-col gap-6 rounded-lg border border-pitch-touchline/30 bg-pitch-card p-6 lg:w-80">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-pitch-touchline">
              Strong suits
            </h3>
            <ul className="mt-2 flex flex-wrap gap-2">
              {position.strongSuits.map((suit) => (
                <li
                  key={suit}
                  className="rounded-full border border-pitch-touchline/40 px-3 py-1 font-mono text-xs text-pitch-line"
                >
                  {suit}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-pitch-touchline">
              Typical zone
            </h3>
            <div className="mt-3">
              <ZoneDiagram zones={position.zones} />
            </div>
          </div>

          {position.related.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-pitch-touchline">
                Related positions
              </h3>
              <ul className="mt-2 flex flex-col gap-3">
                {position.related.map((related) => {
                  const relatedPosition = getPosition(related.code);
                  return (
                    <li key={related.code}>
                      <Link
                        href={`/positions/${related.code.toLowerCase()}`}
                        className="font-mono text-xs text-pitch-marker hover:underline"
                      >
                        {relatedPosition?.name ?? related.code}
                      </Link>
                      <p className="mt-0.5 text-sm leading-relaxed text-pitch-touchline">
                        {related.note}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </aside>
      </div>

      <p className="text-xs text-pitch-touchline">Coming soon: video drill demos for this role.</p>
    </div>
  );
}
