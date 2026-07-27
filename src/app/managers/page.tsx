import type { Metadata } from "next";
import Link from "next/link";
import { managers } from "@/lib/managers";
import { MiniFormationDiagram } from "@/components/managers/MiniFormationDiagram";
import { ManagerEraTimeline } from "@/components/managers/ManagerEraTimeline";

export const metadata: Metadata = {
  title: "Managers & Tactics — PitchIQ",
  description:
    "Factual profiles of influential football managers and the tactical systems they became known for.",
};

export default function ManagersPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-4 py-10 sm:px-8 sm:py-16">
      <header className="flex flex-col gap-3">
        <h1 className="font-display text-4xl font-black uppercase leading-none tracking-tight text-pitch-line sm:text-6xl">
          Tactics through history.
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-pitch-touchline sm:text-lg">
          How {managers.length} influential managers shaped the way their teams set up — and the
          formation each is best known for.
        </p>
      </header>

      <ManagerEraTimeline />

      <p className="border-t border-pitch-touchline/20 pt-4 text-xs leading-relaxed text-pitch-touchline">
        Independent tactical analysis based on publicly known coaching history. Not affiliated
        with or endorsed by the coaches or clubs described.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {managers.map((manager) => (
          <Link
            key={manager.slug}
            href={`/managers/${manager.slug}`}
            className="group flex flex-col gap-4 rounded-lg border border-pitch-touchline/30 bg-pitch-card p-6 transition-colors hover:border-pitch-marker focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
          >
            <div className="flex items-center gap-4">
              <MiniFormationDiagram formationSlug={manager.signatureFormationSlug} />
              <div>
                <h2 className="font-display text-xl font-bold uppercase tracking-tight text-pitch-line group-hover:text-pitch-marker">
                  {manager.name}
                </h2>
                <p className="font-mono text-xs text-pitch-touchline">
                  {manager.notableTeams.join(" · ")}
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-pitch-touchline">{manager.tagline}</p>
            <p className="mt-auto font-mono text-xs uppercase tracking-widest text-pitch-marker">
              Signature: {manager.signatureFormationSlug}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
