"use client";

import { useState } from "react";
import { ZoneDiagram } from "@/components/pitch/ZoneDiagram";
import { Pitch } from "@/components/pitch/Pitch";
import { getFormation, getFormationPlayers } from "@/lib/formations";
import type { ConceptBlock, FormationBlock, ToggleBlock, ZoneBlock } from "@/lib/curriculum";

function ZoneConceptBlock({ block }: { block: ZoneBlock }) {
  return (
    <div className="grid gap-4 sm:grid-cols-[1fr_140px] sm:items-center">
      <div>
        <h3 className="font-display text-lg font-bold uppercase tracking-tight text-pitch-line">
          {block.heading}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-pitch-touchline">{block.body}</p>
      </div>
      <div className="mx-auto w-full max-w-[140px]">
        <ZoneDiagram zones={block.zones} />
      </div>
    </div>
  );
}

function ToggleConceptBlock({ block }: { block: ToggleBlock }) {
  const [selected, setSelected] = useState<"A" | "B">("A");
  const active = selected === "A" ? block.optionA : block.optionB;

  return (
    <div className="grid gap-4 sm:grid-cols-[1fr_140px] sm:items-start">
      <div>
        <h3 className="font-display text-lg font-bold uppercase tracking-tight text-pitch-line">
          {block.heading}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-pitch-touchline">{block.body}</p>
        <div role="group" aria-label={block.heading} className="mt-3 flex flex-wrap gap-2">
          {(["A", "B"] as const).map((key) => {
            const option = key === "A" ? block.optionA : block.optionB;
            const isActive = selected === key;
            return (
              <button
                key={key}
                type="button"
                aria-pressed={isActive}
                onClick={() => setSelected(key)}
                className={`inline-flex min-h-11 items-center justify-center rounded-md border-2 px-3 font-mono text-xs uppercase tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker ${
                  isActive
                    ? "border-gold-flood bg-gold-flood/10 text-gold-flood"
                    : "border-pitch-touchline/50 text-pitch-touchline hover:border-pitch-touchline hover:text-pitch-line"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="mx-auto w-full max-w-[140px]">
        <ZoneDiagram zones={active.zones} />
      </div>
    </div>
  );
}

function FormationConceptBlock({ block }: { block: FormationBlock }) {
  const formation = getFormation(block.formationSlug);
  if (!formation) return null;
  const players = block.phase ? getFormationPlayers(formation, block.phase) : formation.players;

  return (
    <div className="grid gap-4 sm:grid-cols-[1fr_180px] sm:items-center">
      <div>
        <h3 className="font-display text-lg font-bold uppercase tracking-tight text-pitch-line">
          {block.heading}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-pitch-touchline">{block.body}</p>
      </div>
      <div className="mx-auto w-full max-w-[180px]">
        <Pitch players={players} formationName={formation.name} />
      </div>
    </div>
  );
}

export function ConceptBlockView({ block }: { block: ConceptBlock }) {
  if (block.kind === "zone") return <ZoneConceptBlock block={block} />;
  if (block.kind === "toggle") return <ToggleConceptBlock block={block} />;
  if (block.kind === "formation") return <FormationConceptBlock block={block} />;
  return (
    <div>
      <h3 className="font-display text-lg font-bold uppercase tracking-tight text-pitch-line">
        {block.heading}
      </h3>
      <p className="mt-1 text-sm leading-relaxed text-pitch-touchline">{block.body}</p>
    </div>
  );
}
