"use client";

import { useRef, useState } from "react";
import { motion, motionValue, useReducedMotion, type MotionValue } from "framer-motion";
import { PitchMarkings } from "@/components/pitch/PitchMarkings";
import type { FormationPlayer, Phase } from "@/lib/formations";
import type { LabPlayer } from "@/lib/tactics-lab/designSchema";

/** Fixed at 11 for the lifetime of a design in Phase 1 — players never join or leave the roster, only move or change role — so these can be created once via a lazy initializer (never touched during render) and indexed positionally, the same pattern used by SandboxPitch's marker motion values. */
function usePlayerMotionValues(count: number) {
  const [values] = useState<{ x: MotionValue<number>; y: MotionValue<number> }[]>(() =>
    Array.from({ length: count }, () => ({ x: motionValue(0), y: motionValue(0) })),
  );
  return values;
}

/** Percent-grid snap on drop — subtle enough that placement still feels free, but shapes stay tidy instead of landing at odd fractional coordinates. */
const GRID_SNAP = 2;
const EDGE_MARGIN_X = 4;
const EDGE_MARGIN_Y = 3;
/** How far an arrow-key press nudges the selected player, in pitch-percent units — the keyboard-only equivalent of a small drag, for players who can't or don't use a pointer. */
const KEYBOARD_NUDGE = 2;

function snapAndClamp(value: number, margin: number): number {
  const snapped = Math.round(value / GRID_SNAP) * GRID_SNAP;
  return Math.min(100 - margin, Math.max(margin, snapped));
}

type Props = {
  players: LabPlayer[];
  onMovePlayer: (id: string, x: number, y: number) => void;
  selectedPlayerId: string | null;
  onSelectPlayer: (id: string | null) => void;
  /** A mirrored opponent lineup rendered as a non-interactive dashed-blue overlay, from Opponent Sim. */
  opponentPlayers?: FormationPlayer[];
  /** In/out of possession — only drives the ambient glow tint here (same cue used on the Explore pitch); the actual reshaping happens before `players` reaches this component. */
  phase?: Phase;
  /** True while `players` is a derived out-of-possession preview rather than the design's real, editable positions — disables drag/keyboard-nudge/role-menu so there's nothing to "commit" against a shape that isn't the authored one. */
  readOnly?: boolean;
};

export function FormationBoard({
  players,
  onMovePlayer,
  selectedPlayerId,
  onSelectPlayer,
  opponentPlayers,
  phase = "in-possession",
  readOnly = false,
}: Props) {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const motionValues = usePlayerMotionValues(players.length);

  function commitDrag(index: number, id: string) {
    const rect = containerRef.current?.getBoundingClientRect();
    const mv = motionValues[index];
    const player = players.find((p) => p.id === id);
    if (!rect || !mv || !player) return;
    const offsetXPercent = (mv.x.get() / rect.width) * 100;
    const offsetYPercent = (mv.y.get() / rect.height) * 100;
    onMovePlayer(id, snapAndClamp(player.x + offsetXPercent, EDGE_MARGIN_X), snapAndClamp(player.y + offsetYPercent, EDGE_MARGIN_Y));
    mv.x.set(0);
    mv.y.set(0);
  }

  function handleKeyDown(event: React.KeyboardEvent, player: LabPlayer) {
    const deltas: Record<string, [number, number]> = {
      ArrowLeft: [-KEYBOARD_NUDGE, 0],
      ArrowRight: [KEYBOARD_NUDGE, 0],
      ArrowUp: [0, -KEYBOARD_NUDGE],
      ArrowDown: [0, KEYBOARD_NUDGE],
    };
    const delta = deltas[event.key];
    if (delta) {
      event.preventDefault();
      onMovePlayer(player.id, snapAndClamp(player.x + delta[0], EDGE_MARGIN_X), snapAndClamp(player.y + delta[1], EDGE_MARGIN_Y));
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelectPlayer(selectedPlayerId === player.id ? null : player.id);
    }
  }

  return (
    <div
      ref={containerRef}
      className="dossier-paper-shadow relative w-full touch-none select-none aspect-[68/105] rounded-sm border-2 border-night-800 bg-pitch-deep p-2 sm:p-3"
    >
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
              <div className="flex h-11 w-11 items-center justify-center rounded-sm border-2 border-dashed border-defend/70 bg-pitch-card font-mono text-xs font-semibold text-defend-bright">
                {opponent.code}
              </div>
            </motion.div>
          ))}
        </div>
      )}
      {players.map((player, index) => {
        const mv = motionValues[index];
        const isSelected = !readOnly && selectedPlayerId === player.id;
        // Matches Explore's Pitch.tsx exactly: once an opponent is shown, the
        // user's own markers stay a consistent amber regardless of phase —
        // otherwise "out of possession" would tint them the same blue as
        // every opponent dot, and the two teams become hard to tell apart.
        const hasOpponent = Boolean(opponentPlayers && opponentPlayers.length > 0);
        const circle = (
          <div
            className={`dossier-paper-shadow flex h-11 w-11 items-center justify-center rounded-sm border-2 bg-pitch-card font-mono text-xs font-semibold text-pitch-line transition-colors ${
              isSelected
                ? "border-press ring-2 ring-press ring-offset-2 ring-offset-pitch-deep"
                : hasOpponent
                  ? "border-attack/40"
                  : phase === "out-of-possession"
                    ? "border-defend/40"
                    : "border-attack/40"
            }`}
          >
            {player.role}
          </div>
        );

        // The out-of-possession preview reuses the Explore pitch's own
        // `layout`-driven FLIP animation (Pitch.tsx) instead of the drag
        // branch's plain style-based positioning below — `layout` animates
        // any before/after position change regardless of cause, so it
        // correctly animates both into and back out of the preview. Doing
        // this with the draggable branch's `animate`/`style` mix instead
        // risks a visible "snap back" glitch right after a drag commit
        // (the drag offset resets to 0 instantly while `left`/`top` would
        // still be mid-animation), so the two are kept as separate branches
        // rather than one element handling both.
        if (readOnly) {
          return (
            <motion.div
              key={player.id}
              layout
              aria-label={player.role}
              style={{ left: `${player.x}%`, top: `${player.y}%` }}
              transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 16, mass: 0.7 }}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
            >
              {circle}
            </motion.div>
          );
        }

        return (
          <motion.div
            key={player.id}
            layout
            role="button"
            tabIndex={0}
            aria-label={`${player.role} — selected: ${isSelected}. Arrow keys move, Enter opens role menu.`}
            aria-pressed={isSelected}
            drag={!reduceMotion}
            dragConstraints={containerRef}
            dragElastic={0.05}
            dragMomentum={false}
            whileDrag={{ scale: 1.15, zIndex: 30 }}
            onDragEnd={() => commitDrag(index, player.id)}
            onTap={() => onSelectPlayer(isSelected ? null : player.id)}
            onKeyDown={(event) => handleKeyDown(event, player)}
            transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 16, mass: 0.7 }}
            style={{ left: `${player.x}%`, top: `${player.y}%`, x: mv.x, y: mv.y }}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker active:cursor-grabbing"
          >
            {circle}
          </motion.div>
        );
      })}
    </div>
  );
}
