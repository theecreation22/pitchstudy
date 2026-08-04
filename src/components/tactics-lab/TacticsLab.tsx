"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  formations,
  getFormation,
  getFormationPlayers,
  keepOnside,
  mirrorFormationPlayers,
  resolveMatchupOverlaps,
  resolveSelfOverlaps,
  toHighPress,
  toLowBlock,
  type DefensiveStyle,
  type FormationPlayer,
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
import { useTacticsPlaybook } from "@/lib/tactics-lab/usePlaybook";
import { decodeSharedBoard, type SharedBoard } from "@/lib/tactics-lab/playbookShare";
import { formationEntryToFormation, PLAYBOOK_OPPONENT_PREFIX, type PlaybookEntry } from "@/lib/tactics-lab/playbookSchema";
import { useProgress } from "@/lib/progress";
import { FormationBoard } from "./FormationBoard";
import { PlayerRoleMenu } from "./PlayerRoleMenu";
import { TeamInstructionsPanel } from "./TeamInstructionsPanel";
import { ShapeReadout } from "./ShapeReadout";
import { TacticalRadar } from "./TacticalRadar";
import { AutoNotes } from "./AutoNotes";
import { CoachVerdictPanel } from "./CoachVerdictPanel";
import { PlayDesigner } from "./PlayDesigner";
import { OpponentSim } from "./OpponentSim";
import { ScenarioMode } from "./scenario-mode/ScenarioMode";
import { Playbook } from "./Playbook";
import { PlaybookSaveSheet, type SaveSheetResult } from "./PlaybookSaveSheet";

const STORAGE_KEY = "pitchstudy:tactics-lab:design:v1";

type LabMode = "formation" | "play" | "scenario" | "playbook";
const MODE_OPTIONS = [
  { value: "formation", label: "Formation Designer" },
  { value: "play", label: "Play Designer" },
  { value: "scenario", label: "Scenario Mode" },
  { value: "playbook", label: "Playbook" },
] as const satisfies { value: LabMode; label: string }[];

type ActiveEntry = { id: string; type: "formation" | "play"; number: number; name: string };

/** The custom-modal equivalent of window.confirm, matching TrainingGroundHub's EditConfirm styling rather than an unstyled native dialog. */
function LeaveWithoutSavingConfirm({ number, onConfirm, onCancel }: { number: number; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-night-950/85 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex w-full max-w-sm flex-col gap-4 rounded-lg border border-pitch-touchline/30 bg-pitch-card p-6 text-center"
      >
        <p className="font-display text-xl font-bold uppercase tracking-tight text-pitch-line">Leave without saving?</p>
        <p className="text-sm leading-relaxed text-pitch-touchline">
          No. {number} has unsaved changes — they&apos;ll be lost if you leave now.
        </p>
        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex min-h-11 items-center rounded-full border border-pitch-touchline/50 px-5 font-mono text-xs uppercase tracking-widest text-pitch-touchline hover:border-pitch-touchline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
          >
            Stay
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex min-h-11 items-center rounded-full bg-press px-5 font-mono text-xs font-semibold uppercase tracking-widest text-night-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
          >
            Leave
          </button>
        </div>
      </motion.div>
    </div>
  );
}

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
  const [mode, setModeRaw] = useState<LabMode>("formation");
  const [phase, setPhase] = useState<Phase>("in-possession");
  const [defensiveStyleRaw, setDefensiveStyleRaw] = useLocalStorageValue("pitchstudy:tactics-lab:defensive-style");
  const defensiveStyle: DefensiveStyle = defensiveStyleRaw === "high-press" ? "high-press" : "low-block";

  const playbook = useTacticsPlaybook();
  const progress = useProgress();
  const [activeEntry, setActiveEntry] = useState<ActiveEntry | null>(null);
  const [dirty, setDirty] = useState(false);
  const [showSaveSheet, setShowSaveSheet] = useState(false);
  const [sharedBoard, setSharedBoard] = useState<SharedBoard | null>(null);
  const [pendingSaveName, setPendingSaveName] = useState<string | null>(null);
  const [pendingLeaveAction, setPendingLeaveAction] = useState<(() => void) | null>(null);
  const dirtyRef = useRef(dirty);
  useEffect(() => {
    dirtyRef.current = dirty;
  }, [dirty]);

  // A shared scenario play arrives as a `?play=` query param — land directly
  // on Scenario Mode (which reads the param itself) rather than requiring an
  // extra manual tab click before a shared link actually shows anything. A
  // shared Formation/Play Designer board arrives as `?board=` instead (§5's
  // share reuses the existing scenario mechanism for scenario-origin entries,
  // this one's just for designer-origin formations/plays).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("play")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reading a one-time URL param on mount, not derivable during render
      setModeRaw("scenario");
      return;
    }
    const boardParam = params.get("board");
    if (boardParam) {
      const decoded = decodeSharedBoard(boardParam);
      if (decoded) {
        setSharedBoard(decoded);
        setModeRaw(decoded.kind === "play" ? "play" : "formation");
      }
    }
  }, []);

  // Warns once before losing real, unsaved work (§3) — a browser-level
  // close/reload/typed-URL guard. In-app mode switches and Playbook loads
  // get their own guard below; this one only covers navigation this
  // component can't otherwise intercept.
  useEffect(() => {
    function handleBeforeUnload(event: BeforeUnloadEvent) {
      if (dirtyRef.current && activeEntry) event.preventDefault();
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [activeEntry]);

/** Switching modes never silently discards a loaded, edited page (§3) — only guards leaving the Formation/Play board entirely (toggling between those two tabs keeps the same board, so it's exempt). */
  function setMode(next: LabMode) {
    const leavingBoard = (mode === "formation" || mode === "play") && next !== "formation" && next !== "play";
    if (leavingBoard && dirty && activeEntry) {
      setPendingLeaveAction(() => () => setModeRaw(next));
      return;
    }
    setModeRaw(next);
  }

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
    setDirty(true);
  }

  /** Loads a Playbook entry onto the board — guarded the same way mode switches are, since it discards whatever's currently on the board. */
  function loadEntryFromPlaybook(entry: PlaybookEntry) {
    if (entry.type === "play" && entry.origin === "scenario") return; // scenario-origin entries open in Scenario Mode instead, not handled here
    if (dirty && activeEntry) {
      setPendingLeaveAction(() => () => loadEntryFromPlaybook(entry));
      return;
    }
    const nextDesign: Design =
      entry.type === "formation"
        ? { players: entry.players, instructions: entry.instructions }
        : { players: entry.players, instructions: entry.instructions, play: entry.steps, seededFrom: entry.seededFrom };
    setRaw(JSON.stringify(nextDesign));
    setDirty(false);
    setActiveEntry({ id: entry.id, type: entry.type, number: entry.number, name: entry.name });
    setSharedBoard(null);
    setSelectedPlayerId(null);
    setModeRaw(entry.type);
  }

  function handleSaveConfirm(result: SaveSheetResult, entryType: "formation" | "play") {
    if (result.conflictingEntryId) {
      if (!result.asNew && activeEntry) {
        // A true swap — both entries already have their own established numbers to trade.
        playbook.renumber(result.conflictingEntryId, activeEntry.number);
      } else {
        // The saved-as-new entry has no prior number to give back, so the
        // conflicting entry is displaced to the next free slot instead.
        const displaced = playbook.entries.find((entry) => entry.id === result.conflictingEntryId);
        if (displaced) {
          const nextFree = (() => {
            const taken = new Set(playbook.entries.filter((e) => e.type === entryType && e.id !== displaced.id).map((e) => e.number));
            for (let n = 1; n <= 99; n += 1) if (!taken.has(n)) return n;
            return 99;
          })();
          playbook.renumber(result.conflictingEntryId, nextFree);
        }
      }
    }

    const now = new Date().toISOString();
    const base = { id: result.id, schemaVersion: 1 as const, number: result.number, name: result.name, createdAt: now, updatedAt: now };
    const entry: PlaybookEntry =
      entryType === "formation"
        ? { ...base, type: "formation", players: design.players, instructions: design.instructions, shapeName: recognizeShape(design.players) }
        : { ...base, type: "play", origin: "designer", players: design.players, instructions: design.instructions, steps: design.play ?? [], seededFrom: design.seededFrom };

    playbook.upsert(entry);
    progress.recordPlaybookSave(playbook.entries.length + (result.asNew || !activeEntry ? 1 : 0));
    setActiveEntry({ id: result.id, type: entryType, number: result.number, name: result.name });
    setDirty(false);
    setShowSaveSheet(false);
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
    setActiveEntry(null);
    setSharedBoard(null);
    setSelectedPlayerId(null);
  }

  function setRole(role: LabPlayer["role"]) {
    if (!selectedPlayerId) return;
    persist({ ...design, players: design.players.map((p) => (p.id === selectedPlayerId ? { ...p, role } : p)) });
  }

  // Viewing a shared design substitutes its data for display purposes only —
  // `design` itself (and every mutation handler above) keeps reading/writing
  // the user's own real board untouched, so a preview can never bleed into
  // their own saved work before they explicitly duplicate it.
  const effectivePlayers = sharedBoard ? sharedBoard.players : design.players;
  const effectiveInstructions = sharedBoard ? sharedBoard.instructions : design.instructions;
  const effectiveSteps = sharedBoard ? (sharedBoard.kind === "play" ? sharedBoard.steps : []) : (design.play ?? []);

  // A direct port of FormationExplorer.tsx's own derivation — same shape in,
  // same steps, same functions, in the same order — so every combination of
  // phase/style/opponent behaves identically to Explore, not just similarly.
  // `design.players` itself is never mutated (only this render-time result
  // differs from it); dragging still reads/writes the real, persisted values.
  const { boardPlayers, opponentPlayers } = useMemo(() => {
    const opponentFormation = design.opponentFormationSlug?.startsWith(PLAYBOOK_OPPONENT_PREFIX)
      ? (() => {
          const entryId = design.opponentFormationSlug!.slice(PLAYBOOK_OPPONENT_PREFIX.length);
          const entry = playbook.entries.find((e) => e.id === entryId && e.type === "formation");
          return entry && entry.type === "formation" ? formationEntryToFormation(entry) : undefined;
        })()
      : design.opponentFormationSlug
        ? getFormation(design.opponentFormationSlug)
        : undefined;

    const transform = defensiveStyle === "high-press" ? toHighPress : toLowBlock;
    const rawOwn: FormationPlayer[] =
      phase === "in-possession"
        ? effectivePlayers.map((p) => ({ id: p.id, code: p.role, x: p.x, y: p.y }))
        : effectivePlayers.map((player) => transform({ id: player.id, code: player.role, x: player.x, y: player.y }));

    const opponentPhase: Phase = phase === "in-possession" ? "out-of-possession" : "in-possession";
    const rawOpponent = opponentFormation
      ? mirrorFormationPlayers(getFormationPlayers(opponentFormation, opponentPhase, defensiveStyle))
      : undefined;

    // Keeps whichever side is currently attacking from visually standing
    // offside against the other side's last defender — same as Explore,
    // this only ever nudges the render, never `design.players` itself.
    const onsideOwn = rawOpponent && phase === "in-possession" ? keepOnside(rawOwn, rawOpponent, true) : rawOwn;
    const onsideOpponent = rawOpponent && opponentPhase === "in-possession" ? keepOnside(rawOpponent, rawOwn, false) : rawOpponent;

    let resolvedOwn: FormationPlayer[];
    let resolvedOpponent: FormationPlayer[] | undefined;
    if (onsideOpponent) {
      const resolved = resolveMatchupOverlaps(onsideOwn, onsideOpponent);
      resolvedOwn = resolved.own;
      resolvedOpponent = resolved.opponent;
    } else {
      resolvedOwn = resolveSelfOverlaps(onsideOwn);
      resolvedOpponent = undefined;
    }

    const boardPlayers = effectivePlayers.map((player, index) => ({ ...player, x: resolvedOwn[index].x, y: resolvedOwn[index].y }));
    return { boardPlayers, opponentPlayers: resolvedOpponent };
  }, [design.opponentFormationSlug, effectivePlayers, phase, defensiveStyle, playbook.entries]);

  const shapeName = useMemo(() => recognizeShape(effectivePlayers), [effectivePlayers]);
  const scores = useMemo(() => computeScores(effectivePlayers, effectiveInstructions), [effectivePlayers, effectiveInstructions]);
  const notes = useMemo(() => generateNotes(effectivePlayers, effectiveInstructions, scores), [effectivePlayers, effectiveInstructions, scores]);
  const selectedPlayer = effectivePlayers.find((p) => p.id === selectedPlayerId) ?? null;

  if (mode === "scenario") {
    return (
      <div className="flex flex-col gap-6">
        <SegmentedTabs id="tactics-lab-mode" ariaLabel="Designer mode" options={MODE_OPTIONS} value={mode} onChange={setMode} />
        <ScenarioMode />
      </div>
    );
  }

  if (mode === "playbook") {
    return (
      <div className="flex flex-col gap-6">
        <SegmentedTabs id="tactics-lab-mode" ariaLabel="Designer mode" options={MODE_OPTIONS} value={mode} onChange={setMode} />
        <Playbook onLoadEntry={loadEntryFromPlaybook} />
        {pendingLeaveAction && activeEntry && (
          <LeaveWithoutSavingConfirm
            number={activeEntry.number}
            onConfirm={() => {
              const action = pendingLeaveAction;
              setPendingLeaveAction(null);
              action();
            }}
            onCancel={() => setPendingLeaveAction(null)}
          />
        )}
      </div>
    );
  }

  const currentEntryType: "formation" | "play" = design.play && design.play.length > 0 ? "play" : "formation";
  const activeEntryForSheet = activeEntry && activeEntry.type === currentEntryType ? activeEntry : null;

  return (
    <div className="flex flex-col gap-6">
      <SegmentedTabs id="tactics-lab-mode" ariaLabel="Designer mode" options={MODE_OPTIONS} value={mode} onChange={setMode} />

      {sharedBoard ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-attack/40 bg-attack/10 px-4 py-3">
          <p className="text-sm text-pitch-line">
            Viewing a shared design — <span className="font-semibold">{sharedBoard.name}</span>.
          </p>
          <button
            type="button"
            onClick={() => {
              const nextDesign: Design =
                sharedBoard.kind === "formation"
                  ? { players: sharedBoard.players, instructions: sharedBoard.instructions }
                  : { players: sharedBoard.players, instructions: sharedBoard.instructions, play: sharedBoard.steps };
              setRaw(JSON.stringify(nextDesign));
              setActiveEntry(null);
              setDirty(false);
              setPendingSaveName(sharedBoard.name);
              setSharedBoard(null);
              setShowSaveSheet(true);
            }}
            className="inline-flex min-h-11 items-center rounded-full bg-attack px-5 font-mono text-xs font-semibold uppercase tracking-widest text-night-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
          >
            Duplicate to my Playbook
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-xs uppercase tracking-widest text-pitch-touchline">
            {activeEntryForSheet ? (
              <>
                Editing <span className="text-attack">No. {activeEntryForSheet.number}</span> — {activeEntryForSheet.name}
                {dirty && <span className="text-pitch-touchline/70"> (unsaved)</span>}
              </>
            ) : (
              "Unsaved board"
            )}
          </p>
          <button
            type="button"
            onClick={() => setShowSaveSheet(true)}
            className="inline-flex min-h-11 items-center rounded-full border border-attack/60 px-5 font-mono text-xs font-semibold uppercase tracking-widest text-attack transition-colors hover:bg-attack/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
          >
            Save to Playbook
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-pitch-touchline">
          Start from
          <select
            value={design.seededFrom ?? ""}
            onChange={(event) => loadTemplate(event.target.value)}
            disabled={!!sharedBoard}
            className="min-h-11 rounded-md border border-pitch-touchline/40 bg-pitch-card px-3 font-mono text-xs uppercase tracking-widest text-pitch-line focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker disabled:opacity-50"
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

      <AnimatePresence>
        {showSaveSheet && !sharedBoard && (
          <PlaybookSaveSheet
            entryType={currentEntryType}
            entries={playbook.entries}
            activeEntry={activeEntryForSheet}
            initialName={pendingSaveName ?? undefined}
            onCancel={() => {
              setShowSaveSheet(false);
              setPendingSaveName(null);
            }}
            onConfirm={(result) => {
              handleSaveConfirm(result, currentEntryType);
              setPendingSaveName(null);
            }}
          />
        )}
      </AnimatePresence>

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
                readOnly={!!sharedBoard || phase === "out-of-possession"}
              />
              <p className="mt-3 text-xs leading-relaxed text-pitch-touchline">
                {sharedBoard
                  ? "Read-only preview — duplicate it to your own Playbook to edit."
                  : phase === "out-of-possession"
                    ? `Previewing how this shape compresses out of possession (${defensiveStyle === "high-press" ? "high press" : "low block"}). Switch back to In possession to keep editing.`
                    : "Drag a player to reposition them, or select one and use the arrow keys. Select a player to assign their role below."}
              </p>
            </>
          ) : (
            <PlayDesigner
              players={boardPlayers}
              steps={effectiveSteps}
              onStepsChange={setPlaySteps}
              opponentPlayers={opponentPlayers}
              phase={phase}
              defensiveStyle={defensiveStyle}
              readOnly={!!sharedBoard || phase === "out-of-possession"}
            />
          )}
        </div>

        <aside className="flex w-full flex-col gap-4 lg:w-96">
          {mode === "formation" && !sharedBoard && phase === "in-possession" && selectedPlayer && (
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
            myPlayers={effectivePlayers}
            opponentSlug={design.opponentFormationSlug}
            opponentPlayers={opponentPlayers}
            onOpponentSlugChange={setOpponentSlug}
            playbookFormations={playbook.entries.filter((entry): entry is Extract<PlaybookEntry, { type: "formation" }> => entry.type === "formation")}
          />
          <CoachVerdictPanel design={{ players: effectivePlayers, instructions: effectiveInstructions }} coachAvailable={coachAvailable} />
          <TeamInstructionsPanel instructions={effectiveInstructions} onChange={setInstructions} />
        </aside>
      </div>

      {pendingLeaveAction && activeEntry && (
        <LeaveWithoutSavingConfirm
          number={activeEntry.number}
          onConfirm={() => {
            const action = pendingLeaveAction;
            setPendingLeaveAction(null);
            action();
          }}
          onCancel={() => setPendingLeaveAction(null)}
        />
      )}
    </div>
  );
}
