"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { PitchMarkings } from "@/components/pitch/PitchMarkings";
import type { DefensiveStyle, FormationPlayer, Phase } from "@/lib/formations";
import type { LabPlayer } from "@/lib/tactics-lab/designSchema";
import { computePlayFrames, getCarrierId, type PlayActionKind, type PlayStep } from "@/lib/tactics-lab/playSchema";
import { StepTimeline } from "./StepTimeline";

/** How long each step's movement animates for, and the gap before the next step starts — the gap is what makes playback read as a sequence rather than everything arriving at once. */
const STEP_ANIMATION_SECONDS = 0.7;
const STEP_INTERVAL_MS = 950;

const KIND_LABEL: Record<PlayActionKind, string> = { pass: "Pass", run: "Run", shot: "Shot" };

function pointFromClick(event: React.MouseEvent<HTMLDivElement>, container: HTMLDivElement): { x: number; y: number } {
  const rect = container.getBoundingClientRect();
  return {
    x: Math.min(100, Math.max(0, ((event.clientX - rect.left) / rect.width) * 100)),
    y: Math.min(100, Math.max(0, ((event.clientY - rect.top) / rect.height) * 100)),
  };
}

/** A gentle quadratic-bezier control point offset perpendicular to the line — enough to read as a "run" (curved) rather than a "pass" (straight) at a glance. */
function curveControlPoint(from: { x: number; y: number }, to: { x: number; y: number }) {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy) || 1;
  const offset = length * 0.18;
  return { x: midX + (-dy / length) * offset, y: midY + (dx / length) * offset };
}

type Props = {
  players: LabPlayer[];
  steps: PlayStep[];
  onStepsChange: (steps: PlayStep[]) => void;
  /** A mirrored opponent lineup rendered as a non-interactive dashed-blue overlay, from Opponent Sim. */
  opponentPlayers?: FormationPlayer[];
  /** In/out of possession — only drives the ambient glow tint here (same cue used elsewhere); the actual reshaping happens before `players` reaches this component. */
  phase?: Phase;
  /** High press or low block — only used for the preview hint text below. */
  defensiveStyle?: DefensiveStyle;
  /** True while `players` is a derived out-of-possession preview rather than the design's real, editable positions — disables choreographing so there's nothing recorded against a shape that isn't the authored one. */
  readOnly?: boolean;
};

export function PlayDesigner({
  players,
  steps,
  onStepsChange,
  opponentPlayers,
  phase = "in-possession",
  defensiveStyle = "low-block",
  readOnly = false,
}: Props) {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const [pendingActorId, setPendingActorId] = useState<string | null>(null);
  const [pendingKind, setPendingKind] = useState<PlayActionKind | null>(null);
  const [redoStack, setRedoStack] = useState<PlayStep[]>([]);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackIndex, setPlaybackIndex] = useState(0);
  const [justShot, setJustShot] = useState(false);

  useEffect(() => {
    if (!readOnly) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- clearing an in-progress step selection that no longer applies once the pitch switches to a read-only preview, not derivable during render
    setPendingActorId(null);
    setPendingKind(null);
  }, [readOnly]);

  const frames = computePlayFrames(players, steps);
  const displayIndex = isPlaying ? playbackIndex : (previewIndex ?? frames.length - 1);
  const frame = frames[displayIndex];

  // A new pass/shot always extends from the LATEST recorded state, not
  // whatever's being previewed via the timeline — only whoever is actually
  // on the ball right now can play it, never an arbitrary player.
  const latestFrame = frames[frames.length - 1];
  const carrierId = getCarrierId(latestFrame);
  const pendingActorHasBall = pendingActorId !== null && pendingActorId === carrierId;
  // For the on-pitch highlight specifically, which should reflect whichever
  // frame is currently displayed (including a scrubbed preview), not always
  // the latest — distinct from `carrierId` above, which gates new actions.
  const displayedCarrierId = getCarrierId(frame);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setTimeout(() => {
      if (playbackIndex >= frames.length - 1) {
        setIsPlaying(false);
        return;
      }
      setJustShot(steps[playbackIndex]?.kind === "shot");
      setPlaybackIndex((i) => i + 1);
    }, STEP_INTERVAL_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- frames/steps are derived every render from the same players+steps this effect already depends on via playbackIndex changes
  }, [isPlaying, playbackIndex, frames.length]);

  function handlePlay() {
    setPreviewIndex(null);
    if (reduceMotion) {
      // Step-through, not animated: jump straight to the end state.
      setPlaybackIndex(frames.length - 1);
      setIsPlaying(false);
      return;
    }
    setJustShot(false);
    setPlaybackIndex(0);
    setIsPlaying(true);
  }

  function resetPending() {
    setPendingActorId(null);
    setPendingKind(null);
  }

  function commitStep(step: PlayStep) {
    onStepsChange([...steps, step]);
    setRedoStack([]);
    setPreviewIndex(null);
    resetPending();
  }

  function handleSelectPlayer(playerId: string) {
    // Re-checked here (not just at the Pass button itself) so a pass can
    // never commit for a player who isn't actually on the ball, regardless
    // of how `pendingKind` got set to "pass".
    if (pendingActorId && pendingKind === "pass" && playerId !== pendingActorId && pendingActorId === carrierId) {
      commitStep({ id: crypto.randomUUID(), kind: "pass", playerId: pendingActorId, toPlayerId: playerId });
      return;
    }
    setPendingActorId(playerId);
    setPendingKind(null);
  }

  function handlePitchClick(event: React.MouseEvent<HTMLDivElement>) {
    if (!containerRef.current || !pendingActorId || !pendingKind) return;
    if (pendingKind !== "run" && pendingActorId !== carrierId) return;
    const point = pointFromClick(event, containerRef.current);
    commitStep({ id: crypto.randomUUID(), kind: pendingKind, playerId: pendingActorId, toPoint: point });
  }

  function handleUndo() {
    if (steps.length === 0) return;
    const last = steps[steps.length - 1];
    setRedoStack((stack) => [...stack, last]);
    onStepsChange(steps.slice(0, -1));
    setPreviewIndex(null);
  }

  function handleRedo() {
    if (redoStack.length === 0) return;
    const restored = redoStack[redoStack.length - 1];
    setRedoStack((stack) => stack.slice(0, -1));
    onStepsChange([...steps, restored]);
    setPreviewIndex(null);
  }

  function handleDeleteStep(id: string) {
    onStepsChange(steps.filter((s) => s.id !== id));
    setPreviewIndex(null);
  }

  const pendingActor = players.find((p) => p.id === pendingActorId);

  return (
    <div className="flex flex-col gap-4">
      <div
        ref={containerRef}
        onClick={readOnly ? undefined : handlePitchClick}
        className="relative w-full touch-none select-none aspect-[68/105] rounded-xl border-2 border-pitch-touchline/25 bg-pitch-deep p-2 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.7)] sm:p-3"
      >
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-8 -z-10 rounded-[2.5rem] blur-2xl"
          style={{ background: "radial-gradient(circle, var(--attack) 0%, transparent 70%)" }}
          animate={{ opacity: phase === "in-possession" ? 0.28 : 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.6 }}
        />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-8 -z-10 rounded-[2.5rem] blur-2xl"
          style={{ background: "radial-gradient(circle, var(--defend) 0%, transparent 70%)" }}
          animate={{ opacity: phase === "out-of-possession" ? 0.28 : 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.6 }}
        />

        <PitchMarkings />

        {opponentPlayers && opponentPlayers.length > 0 && (
          <div className="absolute inset-0" aria-hidden="true">
            {opponentPlayers.map((opponent) => (
              <motion.div
                key={`opponent-${opponent.id}`}
                layout
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${opponent.x}%`, top: `${opponent.y}%` }}
                transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 16, mass: 0.7 }}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-dashed border-defend/70 bg-defend/10 font-mono text-xs font-semibold text-defend-bright">
                  {opponent.code}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
          {steps.map((step, index) => {
            const startFrame = frames[index];
            const from = step.kind === "run" ? startFrame.positions[step.playerId] : startFrame.ballPosition;
            const to =
              step.kind === "pass" && step.toPlayerId ? startFrame.positions[step.toPlayerId] : step.toPoint;
            if (!from || !to) return null;
            const dimmed = displayIndex <= index;
            const opacity = dimmed ? 0.25 : 0.8;
            if (step.kind === "run") {
              const control = curveControlPoint(from, to);
              return (
                <path
                  key={step.id}
                  d={`M ${from.x} ${from.y} Q ${control.x} ${control.y} ${to.x} ${to.y}`}
                  fill="none"
                  stroke="var(--attack)"
                  strokeWidth="0.6"
                  strokeDasharray="2 1.4"
                  strokeOpacity={opacity}
                />
              );
            }
            return (
              <line
                key={step.id}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={step.kind === "shot" ? "var(--press)" : "var(--attack)"}
                strokeWidth={step.kind === "shot" ? 0.9 : 0.6}
                strokeOpacity={opacity}
              />
            );
          })}
        </svg>

        {players.map((player) => {
          const position = frame.positions[player.id];
          const isSelected = pendingActorId === player.id;
          const hasBall = displayedCarrierId === player.id;
          // Matches Explore's Pitch.tsx exactly: once an opponent is shown,
          // the user's own markers stay a consistent amber regardless of
          // phase, so the two teams never both read as the same blue.
          const hasOpponent = Boolean(opponentPlayers && opponentPlayers.length > 0);
          return (
            <motion.button
              key={player.id}
              type="button"
              disabled={readOnly}
              tabIndex={readOnly ? -1 : 0}
              aria-label={`${player.role}${hasBall ? " (has the ball)" : ""}${isSelected ? " (selected)" : ""}`}
              aria-pressed={readOnly ? undefined : isSelected}
              onClick={
                readOnly
                  ? undefined
                  : (event) => {
                      event.stopPropagation();
                      handleSelectPlayer(player.id);
                    }
              }
              animate={{ left: `${position.x}%`, top: `${position.y}%` }}
              transition={{ duration: reduceMotion ? 0 : STEP_ANIMATION_SECONDS, ease: "easeInOut" }}
              className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 ${readOnly ? "" : "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"}`}
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-full border-2 bg-pitch-card font-mono text-xs font-semibold text-pitch-line shadow-[0_4px_12px_rgba(0,0,0,0.6)] transition-colors ${
                  isSelected
                    ? "border-press ring-2 ring-press ring-offset-2 ring-offset-pitch-deep"
                    : hasOpponent
                      ? "border-attack/40"
                      : phase === "out-of-possession"
                        ? "border-defend/40"
                        : "border-attack/40"
                } ${hasBall && !isSelected ? "ring-2 ring-pitch-marker/60 ring-offset-2 ring-offset-pitch-deep" : ""}`}
              >
                {player.role}
              </div>
            </motion.button>
          );
        })}

        <motion.div
          aria-hidden="true"
          animate={{
            left: `${frame.ballPosition.x}%`,
            top: `${frame.ballPosition.y}%`,
            scale: justShot && displayIndex === frames.length - 1 ? [1, 1.8, 1] : 1,
          }}
          transition={{ duration: reduceMotion ? 0 : STEP_ANIMATION_SECONDS, ease: "easeInOut" }}
          className="pointer-events-none absolute z-20 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pitch-line shadow-[0_0_6px_rgba(237,234,216,0.8)]"
        />
      </div>

      {readOnly ? (
        <p className="text-xs leading-relaxed text-pitch-touchline">
          Previewing how this shape compresses out of possession ({defensiveStyle === "high-press" ? "high press" : "low block"}). Switch back to In possession to keep choreographing.
        </p>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2">
            {pendingActor ? (
              <>
                <span className="font-mono text-xs uppercase tracking-widest text-pitch-marker">{pendingActor.role}:</span>
                {(["pass", "run", "shot"] as PlayActionKind[]).map((kind) => {
                  const disabled = kind !== "run" && !pendingActorHasBall;
                  return (
                    <button
                      key={kind}
                      type="button"
                      disabled={disabled}
                      aria-pressed={pendingKind === kind}
                      onClick={() => setPendingKind(kind)}
                      className={`min-h-9 rounded-md border px-3 font-mono text-xs uppercase tracking-widest transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker ${
                        disabled
                          ? "cursor-not-allowed border-pitch-touchline/20 text-pitch-touchline/40"
                          : pendingKind === kind
                            ? "border-attack bg-attack/15 text-attack"
                            : "border-pitch-touchline/40 text-pitch-touchline hover:border-pitch-touchline hover:text-pitch-line"
                      }`}
                    >
                      {KIND_LABEL[kind]}
                    </button>
                  );
                })}
                <span className="text-xs text-pitch-touchline">
                  {!pendingActorHasBall
                    ? `${pendingActor.role} doesn't have the ball — only a run is available.`
                    : pendingKind === "pass"
                      ? "Click a teammate, or the pitch for a pass into space."
                      : pendingKind
                        ? "Click the pitch for the destination."
                        : "Choose an action."}
                </span>
                <button type="button" onClick={resetPending} className="font-mono text-[10px] uppercase tracking-widest text-pitch-touchline hover:text-pitch-line">
                  Cancel
                </button>
              </>
            ) : (
              <p className="text-xs leading-relaxed text-pitch-touchline">Select a player to start choreographing a move.</p>
            )}
          </div>

          <StepTimeline
            steps={steps}
            players={players}
            currentIndex={displayIndex}
            canRedo={redoStack.length > 0}
            isPlaying={isPlaying}
            onSelectStep={(index) => {
              setIsPlaying(false);
              setPreviewIndex(index);
            }}
            onDeleteStep={handleDeleteStep}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onPlay={handlePlay}
          />
        </>
      )}
    </div>
  );
}
