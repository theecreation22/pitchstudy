"use client";

import { useMemo, useState } from "react";
import {
  formations,
  getFormation,
  getFormationPlayers,
  keepOnside,
  mirrorFormationPlayers,
  resolveMatchupOverlaps,
  resolveOverlaps,
  resolveSelfOverlaps,
  toHighPress,
  toLowBlock,
  type DefensiveStyle,
  type Phase,
} from "@/lib/formations";
import { useLocalStorageValue } from "@/lib/useLocalStorageValue";
import { SegmentedTabs } from "@/components/ui/SegmentedTabs";
import { PhaseToggle } from "@/components/pitch/PhaseToggle";
import { DefensiveStyleToggle } from "@/components/pitch/DefensiveStyleToggle";
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
import { OpponentSim } from "./OpponentSim";

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
          opponentFormationSlug: parsed.opponentFormationSlug,
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
  const [phase, setPhase] = useState<Phase>("in-possession");
  const [defensiveStyleRaw, setDefensiveStyleRaw] = useLocalStorageValue("pitchiq:tactics-lab:defensive-style");
  const defensiveStyle: DefensiveStyle = defensiveStyleRaw === "high-press" ? "high-press" : "low-block";

  function changePhase(next: Phase) {
    setPhase(next);
    setSelectedPlayerId(null);
  }

  // High press / low block is only a meaningful shape while out of possession
  // (there's no such thing as "pressing" while your own team has the ball) —
  // so picking a style also switches into that preview, the same way Explore
  // requires it. Without this, clicking the style toggle while still in
  // possession silently does nothing, which reads as broken rather than as
  // "you also need to flip the other switch."
  function changeDefensiveStyle(next: DefensiveStyle) {
    setDefensiveStyleRaw(next);
    setPhase("out-of-possession");
    setSelectedPlayerId(null);
  }

  function persist(next: Design) {
    setRaw(JSON.stringify(next));
  }

  function setPlaySteps(play: PlayStep[]) {
    persist({ ...design, play });
  }

  function setOpponentSlug(opponentFormationSlug: string | undefined) {
    persist({ ...design, opponentFormationSlug });
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

  // Derives both the displayed shape for the user's own team and the
  // opponent overlay together, since — while out of possession — the user's
  // own displayed positions are already a derived preview (never the real,
  // persisted design), so both sides are free to be jointly resolved for a
  // fully clean, onside matchup, exactly the guarantee Explore's own
  // resolveMatchupOverlaps already provides. While in possession, though,
  // `design.players` IS the user's real, authored design and must never be
  // nudged — only the opponent (if any) adjusts around it there.
  const { boardPlayers, opponentPlayers } = useMemo(() => {
    const opponentFormation = design.opponentFormationSlug ? getFormation(design.opponentFormationSlug) : undefined;
    // The opponent is always in the opposite phase from the user's own team,
    // reshaped (high press/low block) with the same shared style control
    // whenever THEY'RE the one out of possession — exactly Explore's model,
    // where phase/style describe "whichever side doesn't have the ball"
    // rather than "the user's team" specifically.
    const opponentPhase: Phase = phase === "in-possession" ? "out-of-possession" : "in-possession";

    if (phase === "in-possession") {
      if (!opponentFormation) return { boardPlayers: design.players, opponentPlayers: undefined };
      const mirrored = mirrorFormationPlayers(getFormationPlayers(opponentFormation, opponentPhase, defensiveStyle));
      // Give the opponent's own shape a head start clearing itself before
      // also having to dodge the user's fixed points — matching the same
      // self-then-cross ordering resolveMatchupOverlaps uses for its "own"
      // side, since a single combined pass can otherwise leave a rare
      // residual self-overlap when the fixed side crowds the available space.
      const selfResolved = resolveSelfOverlaps(mirrored);
      const myPlayersAsFixed = design.players.map((p) => ({ id: p.id, code: p.role, x: p.x, y: p.y }));
      return { boardPlayers: design.players, opponentPlayers: resolveOverlaps(selfResolved, myPlayersAsFixed) };
    }

    const transform = defensiveStyle === "high-press" ? toHighPress : toLowBlock;
    const transformed = design.players.map((player) => transform({ id: player.id, code: player.role, x: player.x, y: player.y }));

    if (!opponentFormation) {
      const resolvedMine = resolveSelfOverlaps(transformed);
      const boardPlayers = design.players.map((player, index) => ({ ...player, x: resolvedMine[index].x, y: resolvedMine[index].y }));
      return { boardPlayers, opponentPlayers: undefined };
    }

    const mirrored = mirrorFormationPlayers(getFormationPlayers(opponentFormation, opponentPhase, defensiveStyle));
    // The opponent is attacking here (opponentPhase is "in-possession") —
    // keep them onside against the user's own (pre-relaxation) compressed
    // shape, then let both sides jointly relax to clear any collision.
    const onside = keepOnside(mirrored, transformed, false);
    const resolved = resolveMatchupOverlaps(transformed, onside);
    const boardPlayers = design.players.map((player, index) => ({ ...player, x: resolved.own[index].x, y: resolved.own[index].y }));
    return { boardPlayers, opponentPlayers: resolved.opponent };
  }, [design.opponentFormationSlug, design.players, phase, defensiveStyle]);

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
        <PhaseToggle phase={phase} onChange={changePhase} />
        <DefensiveStyleToggle style={defensiveStyle} onChange={changeDefensiveStyle} />
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
        <div className="mx-auto w-full max-w-md lg:mx-0 lg:max-w-lg lg:flex-1">
          {mode === "formation" ? (
            <>
              <FormationBoard
                players={boardPlayers}
                onMovePlayer={movePlayer}
                selectedPlayerId={selectedPlayerId}
                onSelectPlayer={setSelectedPlayerId}
                opponentPlayers={opponentPlayers}
                phase={phase}
                readOnly={phase === "out-of-possession"}
              />
              <p className="mt-3 text-xs leading-relaxed text-pitch-touchline">
                {phase === "out-of-possession"
                  ? `Previewing how this shape compresses out of possession (${defensiveStyle === "high-press" ? "high press" : "low block"}). Switch back to In possession to keep editing.`
                  : "Drag a player to reposition them, or select one and use the arrow keys. Select a player to assign their role below."}
              </p>
            </>
          ) : (
            <PlayDesigner
              players={boardPlayers}
              steps={design.play ?? []}
              onStepsChange={setPlaySteps}
              opponentPlayers={opponentPlayers}
              phase={phase}
              defensiveStyle={defensiveStyle}
              readOnly={phase === "out-of-possession"}
            />
          )}
        </div>

        <aside className="flex w-full flex-col gap-4 lg:w-96">
          {mode === "formation" && phase === "in-possession" && selectedPlayer && (
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
          <OpponentSim
            myPlayers={design.players}
            opponentSlug={design.opponentFormationSlug}
            opponentPlayers={opponentPlayers}
            onOpponentSlugChange={setOpponentSlug}
          />
          <CoachVerdictPanel design={design} coachAvailable={coachAvailable} />
          <TeamInstructionsPanel instructions={design.instructions} onChange={setInstructions} />
        </aside>
      </div>
    </div>
  );
}
