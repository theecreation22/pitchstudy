"use client";

import { useState } from "react";
import {
  formations,
  getFormation,
  getFormationPlayers,
  mirrorFormationPlayers,
  type DefensiveStyle,
  type Formation,
  type Phase,
} from "@/lib/formations";
import { describeMatchup, findMatchups } from "@/lib/matchups";
import { getPosition } from "@/lib/positions";
import { useLocalStorageValue } from "@/lib/useLocalStorageValue";
import { Pitch } from "./Pitch";
import { SandboxPitch } from "./SandboxPitch";
import { FormationSelector } from "./FormationSelector";
import { PhaseToggle } from "./PhaseToggle";
import { DefensiveStyleToggle } from "./DefensiveStyleToggle";
import { OpponentToggle } from "./OpponentToggle";
import { OpponentFormationSelect } from "./OpponentFormationSelect";
import { PositionBreakdownPanel } from "./PositionBreakdownPanel";
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
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  const [showOpponentRaw, setShowOpponentRaw] = useLocalStorageValue("pitchiq:show-opponent");
  const showOpponent = showOpponentRaw === "true";
  const [opponentSlugRaw, setOpponentSlugRaw] = useLocalStorageValue("pitchiq:opponent-formation");
  const [defensiveStyleRaw, setDefensiveStyleRaw] = useLocalStorageValue("pitchiq:defensive-style");
  const defensiveStyle: DefensiveStyle = defensiveStyleRaw === "high-press" ? "high-press" : "low-block";

  const formation = getFormation(selectedSlug) ?? formations[0];
  const compareFormation = compareSlug ? getFormation(compareSlug) : null;
  const displayedPlayers = getFormationPlayers(formation, phase, defensiveStyle);

  const storedOpponentSlug =
    opponentSlugRaw && formations.some((candidate) => candidate.slug === opponentSlugRaw)
      ? opponentSlugRaw
      : null;
  const opponentFormation =
    getFormation(storedOpponentSlug ?? "") ??
    formations.find((candidate) => candidate.slug !== selectedSlug) ??
    formations[0];
  const opponentPhase: Phase = phase === "in-possession" ? "out-of-possession" : "in-possession";
  const opponentPlayers = showOpponent
    ? mirrorFormationPlayers(getFormationPlayers(opponentFormation, opponentPhase, defensiveStyle))
    : undefined;

  const selectedPlayer = showOpponent
    ? displayedPlayers.find((player) => player.id === selectedPlayerId)
    : undefined;
  const selectedPosition = selectedPlayer ? getPosition(selectedPlayer.code) : undefined;
  const matchups =
    selectedPlayer && opponentPlayers ? findMatchups(selectedPlayer, opponentPlayers) : [];
  const matchupText =
    selectedPlayer && matchups.length > 0
      ? describeMatchup({
          formationName: formation.name,
          opponentFormationName: opponentFormation.name,
          playerCode: selectedPlayer.code,
          opponents: matchups,
          opponentPhase,
        })
      : null;

  function selectMode(mode: ViewMode) {
    setViewMode(mode);
    if (mode === "compare" && !compareSlug) {
      const alternative = formations.find((candidate) => candidate.slug !== selectedSlug);
      setCompareSlug(alternative?.slug ?? null);
    }
  }

  function selectFormation(slug: string) {
    setSelectedSlug(slug);
    setSelectedPlayerId(null);
  }

  function selectOpponentFormation(slug: string) {
    setOpponentSlugRaw(slug);
    setSelectedPlayerId(null);
  }

  function toggleOpponent(next: boolean) {
    setShowOpponentRaw(next ? "true" : "false");
    setSelectedPlayerId(null);
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
        onSelect={selectFormation}
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

      {viewMode !== "compare" && (
        <div className="flex flex-wrap items-center gap-3">
          <OpponentToggle show={showOpponent} onChange={toggleOpponent} />
          {showOpponent && (
            <OpponentFormationSelect
              formations={formations}
              selectedSlug={opponentFormation.slug}
              onSelect={selectOpponentFormation}
            />
          )}
          <PhaseToggle phase={phase} onChange={setPhase} />
          <DefensiveStyleToggle style={defensiveStyle} onChange={setDefensiveStyleRaw} />
        </div>
      )}

      {viewMode === "sandbox" && (
        <SandboxPitch
          formation={formation}
          phase={phase}
          defensiveStyle={defensiveStyle}
          opponentPlayers={opponentPlayers}
          opponentFormationName={opponentFormation.name}
        />
      )}

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
            <Pitch
              players={displayedPlayers}
              formationName={formation.name}
              phase={phase}
              opponentPlayers={opponentPlayers}
              selectedPlayerId={selectedPlayerId}
              onSelectPlayer={setSelectedPlayerId}
            />
          </div>
          <aside
            className="w-full rounded-lg border border-pitch-touchline/30 bg-pitch-card p-6 lg:w-80"
            aria-live="polite"
          >
            {showOpponent && selectedPlayer && selectedPosition && matchupText ? (
              <PositionBreakdownPanel
                position={selectedPosition}
                phase={phase}
                matchupText={matchupText}
                onClear={() => setSelectedPlayerId(null)}
              />
            ) : (
              <FormationNotes formation={formation} variant="full" />
            )}
          </aside>
        </div>
      ) : null}
    </div>
  );
}
