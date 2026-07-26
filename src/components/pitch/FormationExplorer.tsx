"use client";

import { useState } from "react";
import { formations, getFormation } from "@/lib/formations";
import { Pitch } from "./Pitch";
import { FormationSelector } from "./FormationSelector";

export function FormationExplorer() {
  const [selectedSlug, setSelectedSlug] = useState(formations[0].slug);
  const formation = getFormation(selectedSlug) ?? formations[0];

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
      <div className="flex flex-col gap-4 lg:flex-1">
        <FormationSelector
          formations={formations}
          selectedSlug={selectedSlug}
          onSelect={setSelectedSlug}
        />
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          <Pitch players={formation.players} formationName={formation.name} />
        </div>
      </div>

      <aside
        className="w-full rounded-lg border border-pitch-touchline/30 bg-pitch-card p-6 lg:w-80"
        aria-live="polite"
      >
        <p className="font-mono text-xs uppercase tracking-widest text-pitch-marker">
          Coach&apos;s notes
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-pitch-line">
          {formation.name}
        </h2>
        <p className="mt-1 text-sm text-pitch-touchline">{formation.tagline}</p>

        <h3 className="mt-5 text-xs font-semibold uppercase tracking-wide text-pitch-touchline">
          Origin
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-pitch-line/90">{formation.origin}</p>

        <h3 className="mt-5 text-xs font-semibold uppercase tracking-wide text-pitch-touchline">
          Strengths
        </h3>
        <ul className="mt-1 space-y-1 text-sm leading-relaxed text-pitch-line/90">
          {formation.strengths.map((strength) => (
            <li key={strength} className="flex gap-2">
              <span aria-hidden="true" className="text-pitch-marker">
                +
              </span>
              {strength}
            </li>
          ))}
        </ul>

        <h3 className="mt-5 text-xs font-semibold uppercase tracking-wide text-pitch-touchline">
          Weaknesses
        </h3>
        <ul className="mt-1 space-y-1 text-sm leading-relaxed text-pitch-line/90">
          {formation.weaknesses.map((weakness) => (
            <li key={weakness} className="flex gap-2">
              <span aria-hidden="true" className="text-pitch-touchline">
                −
              </span>
              {weakness}
            </li>
          ))}
        </ul>

        <h3 className="mt-5 text-xs font-semibold uppercase tracking-wide text-pitch-touchline">
          Best suited to
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-pitch-line/90">{formation.bestSuited}</p>
      </aside>
    </div>
  );
}
