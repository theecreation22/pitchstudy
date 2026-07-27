"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, motionValue, useReducedMotion, type MotionValue } from "framer-motion";
import {
  getFormationPlayers,
  keepOnside,
  resolveOverlaps,
  type DefensiveStyle,
  type Formation,
  type FormationPlayer,
  type Phase,
} from "@/lib/formations";
import { describeMatchup, findMatchups } from "@/lib/matchups";
import { getPosition } from "@/lib/positions";
import { PitchMarkings } from "./PitchMarkings";

function useMarkerMotionValues(count: number) {
  const [values] = useState<{ x: MotionValue<number>; y: MotionValue<number> }[]>(() =>
    Array.from({ length: count }, () => ({ x: motionValue(0), y: motionValue(0) })),
  );
  return values;
}

function clampPercent(value: number): number {
  return Math.min(100, Math.max(0, value));
}

type Props = {
  formation: Formation;
  /** In/out of possession — same toggle and derived compact shape as the Formations tab. */
  phase: Phase;
  /** High press or low block — same toggle and shape as the Formations tab, applied to whichever side is currently out of possession. */
  defensiveStyle: DefensiveStyle;
  /** A second lineup mirrored to attack the opposite way — shares the opponent overlay toggle with the Formations tab. */
  opponentPlayers?: FormationPlayer[];
  opponentFormationName?: string;
};

export function SandboxPitch({
  formation,
  phase,
  defensiveStyle,
  opponentPlayers,
  opponentFormationName,
}: Props) {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const markerMotion = useMarkerMotionValues(formation.players.length);
  const opponentMarkerMotion = useMarkerMotionValues(11);
  const rawBasePlayers = getFormationPlayers(formation, phase, defensiveStyle);
  // Keeps the user's own attackers from starting out visually offside
  // against the opponent's last defender, then nudges apart anything still
  // close enough to visually collide — neither fights manual dragging
  // afterward, since both only recompute when the underlying base
  // positions actually change, not on every drag frame.
  const onsidePlayers =
    opponentPlayers && phase === "in-possession"
      ? keepOnside(rawBasePlayers, opponentPlayers, true)
      : rawBasePlayers;
  const basePlayers = opponentPlayers
    ? resolveOverlaps(onsidePlayers, opponentPlayers)
    : onsidePlayers;
  const [livePositions, setLivePositions] = useState<{ x: number; y: number }[]>(() =>
    basePlayers.map((player) => ({ x: player.x, y: player.y })),
  );
  // Keyed by index rather than pre-sized to the opponent count — dots that
  // haven't been dragged yet simply have no entry and fall back to their
  // base (mirrored) position, so there's nothing to keep in sync when the
  // opponent overlay toggles on/off.
  const [opponentLivePositions, setOpponentLivePositions] = useState<
    Record<number, { x: number; y: number }>
  >({});
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const hasOpponent = Boolean(opponentPlayers && opponentPlayers.length > 0);

  function resetToFormation() {
    markerMotion.forEach(({ x, y }) => {
      animate(x, 0, { type: "spring", stiffness: 140, damping: 18 });
      animate(y, 0, { type: "spring", stiffness: 140, damping: 18 });
    });
    setLivePositions(basePlayers.map((player) => ({ x: player.x, y: player.y })));

    opponentMarkerMotion.forEach(({ x, y }) => {
      animate(x, 0, { type: "spring", stiffness: 140, damping: 18 });
      animate(y, 0, { type: "spring", stiffness: 140, damping: 18 });
    });
    setOpponentLivePositions({});
  }

  // Snap any dragged players back home when the underlying formation,
  // possession phase, or defensive style changes (e.g. switching formations,
  // toggling phase, or toggling high press/low block while sandbox mode
  // stays open) — a drag offset computed against the old base position
  // isn't meaningful against the new one. Also resets when the opponent's
  // own formation changes, for the same reason.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resetting drag state to match a newly-selected formation/phase/style, not derivable during render
    resetToFormation();
    setSelectedIndex(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- resetToFormation is stable across renders (markerMotion/opponentMarkerMotion never change)
  }, [formation.slug, phase, defensiveStyle, opponentFormationName]);

  // Commits a dragged marker's pixel offset into pitch-percent coordinates on
  // release (not every drag frame — that would re-render on every animation
  // frame) so the matchup line/highlight can react to where you dropped it.
  function commitDragPosition(index: number) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const base = basePlayers[index];
    const offsetXPercent = (markerMotion[index].x.get() / rect.width) * 100;
    const offsetYPercent = (markerMotion[index].y.get() / rect.height) * 100;
    setLivePositions((prev) => {
      const next = [...prev];
      next[index] = {
        x: clampPercent(base.x + offsetXPercent),
        y: clampPercent(base.y + offsetYPercent),
      };
      return next;
    });
  }

  function commitOpponentDragPosition(index: number) {
    const rect = containerRef.current?.getBoundingClientRect();
    const base = opponentPlayers?.[index];
    if (!rect || !base) return;
    const offsetXPercent = (opponentMarkerMotion[index].x.get() / rect.width) * 100;
    const offsetYPercent = (opponentMarkerMotion[index].y.get() / rect.height) * 100;
    setOpponentLivePositions((prev) => ({
      ...prev,
      [index]: {
        x: clampPercent(base.x + offsetXPercent),
        y: clampPercent(base.y + offsetYPercent),
      },
    }));
  }

  const opponentPhase: Phase = phase === "in-possession" ? "out-of-possession" : "in-possession";
  const selectedBase = selectedIndex !== null ? basePlayers[selectedIndex] : undefined;
  const selectedPlayer: FormationPlayer | undefined =
    hasOpponent && selectedBase && selectedIndex !== null
      ? { ...selectedBase, ...livePositions[selectedIndex] }
      : undefined;
  const liveOpponents = opponentPlayers?.map((opponent, index) =>
    opponentLivePositions[index] ? { ...opponent, ...opponentLivePositions[index] } : opponent,
  );
  const matchups = selectedPlayer && liveOpponents ? findMatchups(selectedPlayer, liveOpponents) : [];
  const matchupIds = new Set(matchups.map((opponent) => opponent.id));
  const matchupText =
    selectedPlayer && matchups.length > 0 && opponentFormationName
      ? describeMatchup({
          formationName: formation.name,
          opponentFormationName,
          playerCode: selectedPlayer.code,
          opponents: matchups,
          opponentPhase,
        })
      : null;
  const selectedPosition = selectedPlayer ? getPosition(selectedPlayer.code) : undefined;

  return (
    <div className="flex flex-col gap-3">
      <div
        ref={containerRef}
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

        {hasOpponent && (
          <div className="absolute inset-0">
            {opponentPlayers!.map((opponent, index) => {
              const isMatched = matchupIds.has(opponent.id);
              return (
                <motion.div
                  key={`opponent-${opponent.id}`}
                  drag={!reduceMotion}
                  dragConstraints={containerRef}
                  dragElastic={0.05}
                  dragMomentum={false}
                  whileDrag={{ scale: 1.15, zIndex: 30 }}
                  onDragEnd={() => commitOpponentDragPosition(index)}
                  style={{
                    left: `${opponent.x}%`,
                    top: `${opponent.y}%`,
                    x: opponentMarkerMotion[index].x,
                    y: opponentMarkerMotion[index].y,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none active:cursor-grabbing"
                >
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-full border-2 border-dashed font-mono text-xs font-semibold ${
                      isMatched
                        ? "border-press bg-press/10 text-press"
                        : "border-defend/70 bg-defend/10 text-defend-bright"
                    }`}
                  >
                    {opponent.code}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {selectedPlayer && matchups.length > 0 && (
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            <g stroke="var(--press)" strokeWidth="0.6" strokeOpacity="0.85" strokeDasharray="2.2 1.6">
              {matchups.map((opponent) => (
                <line
                  key={`matchup-${opponent.id}`}
                  x1={selectedPlayer.x}
                  y1={selectedPlayer.y}
                  x2={opponent.x}
                  y2={opponent.y}
                  pathLength={1}
                />
              ))}
            </g>
          </svg>
        )}

        {basePlayers.map((player, index) => {
          const isSelected = hasOpponent && selectedIndex === index;
          return (
            <motion.div
              key={player.id}
              drag={!reduceMotion}
              dragConstraints={containerRef}
              dragElastic={0.05}
              dragMomentum={false}
              whileDrag={{ scale: 1.15, zIndex: 30 }}
              onDragEnd={() => commitDragPosition(index)}
              onTap={hasOpponent ? () => setSelectedIndex((prev) => (prev === index ? null : index)) : undefined}
              style={{
                left: `${player.x}%`,
                top: `${player.y}%`,
                x: markerMotion[index].x,
                y: markerMotion[index].y,
              }}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none active:cursor-grabbing"
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-full border-2 bg-pitch-card font-mono text-xs font-semibold text-pitch-line shadow-[0_4px_12px_rgba(0,0,0,0.6)] ${
                  isSelected
                    ? "border-press ring-2 ring-press ring-offset-2 ring-offset-pitch-deep"
                    : hasOpponent
                      ? "border-attack/40"
                      : phase === "in-possession"
                        ? "border-attack/40"
                        : "border-defend/40"
                }`}
              >
                {player.code}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        {selectedPlayer && selectedPosition && matchupText ? (
          <div className="flex flex-1 items-center justify-between gap-3 rounded-full border border-press/40 bg-press/10 px-4 py-2">
            <p className="text-xs leading-relaxed text-pitch-line/90">
              <span className="font-mono text-[10px] uppercase tracking-widest text-press">
                {selectedPosition.name}:
              </span>{" "}
              {matchupText}
            </p>
            <button
              type="button"
              onClick={() => setSelectedIndex(null)}
              className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-pitch-touchline transition-colors hover:text-pitch-line"
            >
              Clear
            </button>
          </div>
        ) : (
          <p className="text-xs leading-relaxed text-pitch-touchline">
            {hasOpponent
              ? "Drag any player — yours or the opponent's — to test different shapes. Nothing here is saved."
              : "Drag any player to test your own shape. Nothing here is saved."}
          </p>
        )}
        <button
          type="button"
          onClick={resetToFormation}
          className="inline-flex min-h-11 w-fit shrink-0 items-center justify-center rounded-md border border-blue-volt px-4 font-display text-xs font-bold uppercase tracking-wide text-blue-volt transition-colors hover:bg-blue-volt/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
        >
          Reset to formation
        </button>
      </div>
    </div>
  );
}
