"use client";

import { useMemo, useState } from "react";
import { formations } from "@/lib/formations";
import { useLocalStorageValue } from "@/lib/useLocalStorageValue";
import { SegmentedTabs } from "@/components/ui/SegmentedTabs";
import {
  DEFAULT_INSTRUCTIONS,
  seedFromFormation,
  type Design,
  type Instructions,
  type LabPlayer,
} from "@/lib/tactics-lab/designSchema";
import type { PlayStep } from "@/lib/tactics-lab/playSchema";
import { computeScores, generateNotes } from "@/lib/tactics-lab/engine";
import { recognizeShape } from "@/lib/tactics-lab/shapeRecognition";
import { FormationBoard } from "./FormationBoard";
import { PlayerRoleMenu } from "./PlayerRoleMenu";
import { TeamInstructionsPanel } from "./TeamInstructionsPanel";
import { ShapeReadout } from "./ShapeReadout";
import { TacticalRadar } from "./TacticalRadar";
import { AutoNotes } from "./AutoNotes";
import { CoachVerdictPanel } from "./CoachVerdictPanel";
import { PlayDesigner } from "./PlayDesigner";

const STORAGE_KEY = "pitchiq:tactics-lab:design:v1";

type LabMode = "formation" | "play";
const MODE_OPTIONS = [
  { value: "formation", label: "Formation Designer" },
  { value: "play", label: "Play Designer" },
] as const satisfies { value: LabMode; label: string }[];

function parseDesign(raw: string | null): Design {
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Partial<Design>;
      if (Array.isArray(parsed.players) && parsed.players.length === 11 && parsed.instructions) {
        return {
          players: parsed.players,
          instructions: parsed.instructions,
          seededFrom: parsed.seededFrom,
          play: Array.isArray(parsed.play) ? parsed.play : undefined,
        };
      }
    } catch {
      // fall through to the default seed
    }
  }
  return { players: seedFromFormation("4-4-2"), instructions: DEFAULT_INSTRUCTIONS, seededFrom: "4-4-2" };
}

export function TacticsLab({ coachAvailable }: { coachAvailable: boolean }) {
  const [raw, setRaw] = useLocalStorageValue(STORAGE_KEY);
  const design = useMemo(() => parseDesign(raw), [raw]);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [mode, setMode] = useState<LabMode>("formation");

  function persist(next: Design) {
    setRaw(JSON.stringify(next));
  }

  function setPlaySteps(play: PlayStep[]) {
    persist({ ...design, play });
  }

  function movePlayer(id: string, x: number, y: number) {
    persist({ ...design, players: design.players.map((p) => (p.id === id ? { ...p, x, y } : p)) });
  }

  function setInstructions(instructions: Instructions) {
    persist({ ...design, instructions });
  }

  function loadTemplate(slug: string) {
    persist({ players: seedFromFormation(slug), instructions: design.instructions, seededFrom: slug });
    setSelectedPlayerId(null);
  }

  function setRole(role: LabPlayer["role"]) {
    if (!selectedPlayerId) return;
    persist({ ...design, players: design.players.map((p) => (p.id === selectedPlayerId ? { ...p, role } : p)) });
  }

  const shapeName = useMemo(() => recognizeShape(design.players), [design.players]);
  const scores = useMemo(() => computeScores(design.players, design.instructions), [design.players, design.instructions]);
  const notes = useMemo(() => generateNotes(design.players, design.instructions, scores), [design.players, design.instructions, scores]);
  const selectedPlayer = design.players.find((p) => p.id === selectedPlayerId) ?? null;

  return (
    <div className="flex flex-col gap-6">
      <SegmentedTabs id="tactics-lab-mode" ariaLabel="Designer mode" options={MODE_OPTIONS} value={mode} onChange={setMode} />

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-pitch-touchline">
          Start from
          <select
            value={design.seededFrom ?? ""}
            onChange={(event) => loadTemplate(event.target.value)}
            className="min-h-11 rounded-md border border-pitch-touchline/40 bg-pitch-card px-3 font-mono text-xs uppercase tracking-widest text-pitch-line focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
          >
            {formations.map((formation) => (
              <option key={formation.slug} value={formation.slug}>
                {formation.name}
              </option>
            ))}
          </select>
        </label>
        <ShapeReadout shapeName={shapeName} />
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
        <div className="mx-auto w-full max-w-md lg:mx-0 lg:max-w-lg lg:flex-1">
          {mode === "formation" ? (
            <>
              <FormationBoard
                players={design.players}
                onMovePlayer={movePlayer}
                selectedPlayerId={selectedPlayerId}
                onSelectPlayer={setSelectedPlayerId}
              />
              <p className="mt-3 text-xs leading-relaxed text-pitch-touchline">
                Drag a player to reposition them, or select one and use the arrow keys. Select a player to assign their role below.
              </p>
            </>
          ) : (
            <PlayDesigner players={design.players} steps={design.play ?? []} onStepsChange={setPlaySteps} />
          )}
        </div>

        <aside className="flex w-full flex-col gap-4 lg:w-96">
          {mode === "formation" && selectedPlayer && (
            <PlayerRoleMenu
              currentRole={selectedPlayer.role}
              onSelectRole={setRole}
              onClose={() => setSelectedPlayerId(null)}
            />
          )}
          <TacticalRadar scores={scores} />
          <div className="flex flex-col gap-2 rounded-lg border border-pitch-touchline/30 bg-pitch-card p-4">
            <p className="font-mono text-xs uppercase tracking-widest text-pitch-marker">Coach&apos;s notes</p>
            <AutoNotes notes={notes} />
          </div>
          <CoachVerdictPanel design={design} coachAvailable={coachAvailable} />
          <TeamInstructionsPanel instructions={design.instructions} onChange={setInstructions} />
        </aside>
      </div>
    </div>
  );
}
