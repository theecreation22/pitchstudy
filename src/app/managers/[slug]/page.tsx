import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getManager, managers } from "@/lib/managers";
import { getFormation } from "@/lib/formations";
import { MiniFormationDiagram } from "@/components/managers/MiniFormationDiagram";
import { AnimatedSection } from "@/components/motion/AnimatedSection";
import { ChalkDivider } from "@/components/effects/ChalkDivider";

export function generateStaticParams() {
  return managers.map((manager) => ({ slug: manager.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const manager = getManager(slug);

  return {
    title: manager ? `${manager.name} — PitchIQ` : "Manager — PitchIQ",
    description: manager?.tagline,
  };
}

export default async function ManagerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const manager = getManager(slug);

  if (!manager) {
    notFound();
  }

  const formation = getFormation(manager.signatureFormationSlug);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-10 sm:px-8 sm:py-16">
      <Link
        href="/managers"
        className="font-mono text-xs uppercase tracking-widest text-pitch-touchline hover:text-pitch-marker"
      >
        ← Back to managers
      </Link>

      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <MiniFormationDiagram formationSlug={manager.signatureFormationSlug} size="lg" animateIn />
          <div className="flex flex-col gap-1">
            <p className="font-mono text-xs uppercase tracking-widest text-pitch-marker">
              {manager.years}
            </p>
            <h1 className="font-display text-4xl font-black uppercase leading-none tracking-tight text-pitch-line sm:text-6xl">
              {manager.name}
            </h1>
          </div>
        </div>
        <p className="max-w-2xl text-lg leading-relaxed text-pitch-touchline">{manager.tagline}</p>
        <p className="font-mono text-xs uppercase tracking-widest text-pitch-touchline">
          {manager.notableTeams.join(" · ")}
        </p>
        {formation && (
          <Link
            href={`/explore?formation=${formation.slug}`}
            className="inline-flex min-h-11 w-fit items-center gap-2 rounded-full border border-pitch-marker px-4 font-mono text-xs uppercase tracking-widest text-pitch-marker transition-colors hover:bg-pitch-marker/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
          >
            View the {formation.name} on the pitch →
          </Link>
        )}
      </header>

      <ChalkDivider />

      <AnimatedSection>
        <h2 className="font-display text-xl font-bold uppercase tracking-tight text-pitch-line">
          Philosophy
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-pitch-line/90">
          {manager.philosophy}
        </p>
      </AnimatedSection>

      <ChalkDivider />

      <AnimatedSection>
        <h2 className="font-display text-xl font-bold uppercase tracking-tight text-pitch-line">
          Why it worked
        </h2>
        <ul className="mt-3 max-w-2xl space-y-2 text-sm leading-relaxed text-pitch-line/90">
          {manager.whyItWorked.map((point) => (
            <li key={point} className="flex gap-2">
              <span aria-hidden="true" className="text-pitch-marker">
                ›
              </span>
              {point}
            </li>
          ))}
        </ul>
      </AnimatedSection>

      <ChalkDivider />

      <AnimatedSection>
        <h2 className="font-display text-xl font-bold uppercase tracking-tight text-pitch-line">
          Legacy
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-pitch-line/90">{manager.legacy}</p>
      </AnimatedSection>

      <p className="border-t border-pitch-touchline/20 pt-4 text-xs leading-relaxed text-pitch-touchline">
        Independent analysis based on publicly known coaching history. Not affiliated with or
        endorsed by {manager.name} or the clubs mentioned.
      </p>
    </div>
  );
}
