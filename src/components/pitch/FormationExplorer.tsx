"use client";

import { useState } from "react";
import {
  formations,
  getFormation,
  getFormationPlayers,
  type Formation,
  type Phase,
} from "@/lib/formations";
import { Pitch } from "./Pitch";
import { SandboxPitch } from "./SandboxPitch";
import { FormationSelector } from "./FormationSelector";
import { PhaseToggle } from "./PhaseToggle";
import { SegmentedTabs } from "@/components/ui/SegmentedTabs";

function FormationNotes({
  formation,
  variant = "full",
}: {
  formation: Formation;
  variant?: "full" | "condensed";
}) {
  return (
    <>
      <p className="font-mono text-xs uppercase tracking-widest text-pitch-marker">
        Coach&apos;s notes
      </p>
      <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-pitch-line">
        {formation.name}
      </h2>
      <p className="mt-1 text-sm text-pitch-touchline">{formation.tagline}</p>

      {variant === "full" && (
        <>
          <h3 className="mt-5 text-xs font-semibold uppercase tracking-wide text-pitch-touchline">
            Origin
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-pitch-line/90">{formation.origin}</p>
        </>
      )}

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

      {variant === "full" && (
        <>
          <h3 className="mt-5 text-xs font-semibold uppercase tracking-wide text-pitch-touchline">
            Best suited to
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-pitch-line/90">{formation.bestSuited}</p>
        </>
      )}
    </>
  );
}

type ViewMode = "formation" | "compare" | "sandbox";

const viewModes: { mode: ViewMode; label: string }[] = [
  { mode: "formation", label: "Formations" },
  { mode: "compare", label: "Compare" },
  { mode: "sandbox", label: "Sandbox" },
];

export function FormationExplorer({ initialSlug }: { initialSlug?: string }) {
  const [selectedSlug, setSelectedSlug] = useState(
    () => formations.find((formation) => formation.slug === initialSlug)?.slug ?? formations[0].slug,
  );
  const [compareSlug, setCompareSlug] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("formation");
  const [phase, setPhase] = useState<Phase>("in-possession");
  const [showGhost, setShowGhost] = useState(true);

  const formation = getFormation(selectedSlug) ?? formations[0];
  const compareFormation = compareSlug ? getFormation(compareSlug) : null;
  const displayedPlayers = getFormationPlayers(formation, phase);

  function selectMode(mode: ViewMode) {
    setViewMode(mode);
    if (mode === "compare" && !compareSlug) {
      const alternative = formations.find((candidate) => candidate.slug !== selectedSlug);
      setCompareSlug(alternative?.slug ?? null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <SegmentedTabs
        id="pitch-view-mode"
        ariaLabel="View mode"
        options={viewModes.map(({ mode, label }) => ({ value: mode, label }))}
        value={viewMode}
        onChange={selectMode}
      />

      <FormationSelector
        formations={formations}
        selectedSlug={selectedSlug}
        onSelect={setSelectedSlug}
      />

      {viewMode === "compare" && compareFormation && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="font-mono text-xs uppercase tracking-widest text-pitch-touchline">
              Compare with
            </p>
            <FormationSelector
              formations={formations}
              selectedSlug={compareSlug ?? ""}
              onSelect={setCompareSlug}
            />
          </div>
          <button
            type="button"
            aria-pressed={showGhost}
            onClick={() => setShowGhost((value) => !value)}
            className={`inline-flex min-h-11 w-fit items-center justify-center rounded-md border-2 px-4 font-mono text-xs uppercase tracking-widest transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker ${
              showGhost
                ? "border-defend bg-defend/10 text-defend-bright"
                : "border-pitch-touchline/50 text-pitch-touchline hover:border-pitch-touchline hover:text-pitch-line"
            }`}
          >
            {showGhost ? "Hide" : "Show"} ghost overlay
          </button>
        </div>
      )}

      {viewMode === "sandbox" && <SandboxPitch formation={formation} />}

      {viewMode === "compare" && compareFormation ? (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <div className="mx-auto w-full max-w-sm">
              <Pitch
                players={formation.players}
                formationName={formation.name}
                ghostPlayers={showGhost ? compareFormation.players : undefined}
              />
            </div>
            <div className="rounded-lg border border-pitch-touchline/30 bg-pitch-card p-6">
              <FormationNotes formation={formation} variant="condensed" />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="mx-auto w-full max-w-sm">
              <Pitch players={compareFormation.players} formationName={compareFormation.name} />
            </div>
            <div className="rounded-lg border border-pitch-touchline/30 bg-pitch-card p-6">
              <FormationNotes formation={compareFormation} variant="condensed" />
            </div>
          </div>
        </div>
      ) : viewMode === "formation" ? (
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
          <div className="mx-auto flex w-full max-w-sm flex-col gap-3 lg:mx-0 lg:max-w-md lg:flex-1">
            <div className="flex justify-end">
              <PhaseToggle phase={phase} onChange={setPhase} />
            </div>
            <Pitch players={displayedPlayers} formationName={formation.name} phase={phase} />
          </div>
          <aside
            className="w-full rounded-lg border border-pitch-touchline/30 bg-pitch-card p-6 lg:w-80"
            aria-live="polite"
          >
            <FormationNotes formation={formation} variant="full" />
          </aside>
        </div>
      ) : null}
    </div>
  );
}
