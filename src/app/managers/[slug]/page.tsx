import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getInfluenced, getManager, managers } from "@/lib/managers";
import { getFormation } from "@/lib/formations";
import { getLesson, getModule } from "@/lib/curriculum";
import { MiniFormationDiagram } from "@/components/managers/MiniFormationDiagram";
import { MechanicDiagram } from "@/components/managers/MechanicDiagram";
import { CoachingTree } from "@/components/managers/CoachingTree";
import { ManagerChallengeQuestion } from "@/components/managers/ManagerChallengeQuestion";
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
    title: manager ? `${manager.name} · PitchStudy` : "Manager · PitchStudy",
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
  const hasLineage = (manager.influencedBy?.length ?? 0) > 0 || getInfluenced(manager.slug).length > 0;
  const academyModule = getModule(manager.academyLink.moduleSlug);
  const academyLesson = getLesson(manager.academyLink.moduleSlug, manager.academyLink.lessonSlug);

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

      {manager.signatureMechanics && manager.signatureMechanics.length > 0 && (
        <>
          <AnimatedSection>
            <h2 className="font-display text-xl font-bold uppercase tracking-tight text-pitch-line">
              Signature mechanics
            </h2>
            <div className="mt-3 flex flex-col gap-4">
              {manager.signatureMechanics.map((mechanic) => (
                <div
                  key={mechanic.id}
                  className="flex flex-col gap-4 rounded-lg border border-pitch-touchline/20 bg-pitch-card/60 p-4 sm:flex-row"
                >
                  <MechanicDiagram mechanic={mechanic} />
                  <div className="flex flex-col gap-1.5">
                    <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-pitch-marker">
                      {mechanic.name}
                    </h3>
                    <p className="text-sm leading-relaxed text-pitch-line/90">{mechanic.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>

          <ChalkDivider />
        </>
      )}

      {manager.whyItWorked.length > 0 && (
        <>
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
        </>
      )}

      <AnimatedSection>
        <h2 className="font-display text-xl font-bold uppercase tracking-tight text-pitch-line">
          Where it&apos;s vulnerable
        </h2>
        <ul className="mt-3 max-w-2xl space-y-2 text-sm leading-relaxed text-pitch-line/90">
          {manager.vulnerabilities.map((point) => (
            <li key={point} className="flex gap-2">
              <span aria-hidden="true" className="text-defend-bright">
                ›
              </span>
              {point}
            </li>
          ))}
        </ul>
      </AnimatedSection>

      <ChalkDivider />

      {hasLineage && (
        <>
          <AnimatedSection>
            <h2 className="font-display text-xl font-bold uppercase tracking-tight text-pitch-line">
              Influences &amp; Influenced
            </h2>
            <div className="mt-3">
              <CoachingTree slug={manager.slug} />
            </div>
          </AnimatedSection>

          <ChalkDivider />
        </>
      )}

      <AnimatedSection>
        <h2 className="font-display text-xl font-bold uppercase tracking-tight text-pitch-line">
          Legacy
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-pitch-line/90">{manager.legacy}</p>
      </AnimatedSection>

      <ChalkDivider />

      <AnimatedSection>
        <h2 className="font-display text-xl font-bold uppercase tracking-tight text-pitch-line">
          Keep learning
        </h2>
        <div className="mt-3 flex flex-col gap-4">
          {formation && (
            <Link
              href={`/explore?formation=${formation.slug}`}
              className="inline-flex min-h-11 w-fit items-center gap-2 rounded-full border border-pitch-marker px-4 font-mono text-xs uppercase tracking-widest text-pitch-marker transition-colors hover:bg-pitch-marker/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
            >
              View the {formation.name} on the pitch →
            </Link>
          )}

          {academyModule && academyLesson && (
            <Link
              href={`/academy/${academyModule.slug}/${academyLesson.slug}`}
              className="flex flex-col gap-1 rounded-lg border border-pitch-touchline/20 bg-pitch-card/60 p-4 transition-colors hover:border-pitch-marker/50"
            >
              <span className="font-mono text-xs uppercase tracking-widest text-pitch-touchline">
                Academy Module {academyModule.order}: {academyModule.title}
              </span>
              <span className="text-sm font-medium text-pitch-line">{academyLesson.title} →</span>
            </Link>
          )}

          <div className="rounded-lg border border-pitch-touchline/20 bg-pitch-card/60 p-4">
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-pitch-touchline">
              Test yourself
            </p>
            <ManagerChallengeQuestion question={manager.challengeQuestion} />
            <Link
              href="/challenge"
              className="mt-3 inline-block font-mono text-xs uppercase tracking-widest text-defend-bright hover:underline"
            >
              Try the full Challenge Mode →
            </Link>
          </div>
        </div>
      </AnimatedSection>

      <p className="border-t border-pitch-touchline/20 pt-4 text-xs leading-relaxed text-pitch-touchline">
        Independent analysis based on publicly known coaching history. Not affiliated with or
        endorsed by {manager.name} or the clubs mentioned.
      </p>
    </div>
  );
}
