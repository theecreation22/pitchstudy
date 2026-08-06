"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { matchFormationPlayers, type FormationPlayer, type Phase } from "@/lib/formations";
import { findMatchups } from "@/lib/matchups";
import { getPosition } from "@/lib/positions";
import { PitchMarkings } from "./PitchMarkings";

type Props = {
  players: FormationPlayer[];
  formationName: string;
  /** When set, renders these as translucent outlines connected by lines to `players` — compare mode's "ghost overlay." */
  ghostPlayers?: FormationPlayer[];
  /** When set, the board glows amber (in possession) or blue (out of possession), cross-fading between the two. */
  phase?: Phase;
  /** A second lineup mirrored to attack the opposite way — Explore's opponent overlay. */
  opponentPlayers?: FormationPlayer[];
  /** The user-team player currently selected, when the opponent overlay is active. */
  selectedPlayerId?: string | null;
  /** Called with a user-team player's id (or null to deselect) when the opponent overlay is active; markers navigate to the position guide instead when it isn't. */
  onSelectPlayer?: (id: string | null) => void;
};

export function Pitch({
  players,
  formationName,
  ghostPlayers,
  phase,
  opponentPlayers,
  selectedPlayerId,
  onSelectPlayer,
}: Props) {
  const reduceMotion = useReducedMotion();
  const ghostPairs = useMemo(
    () => (ghostPlayers ? matchFormationPlayers(players, ghostPlayers) : []),
    [players, ghostPlayers],
  );

  // Real telemetry, not decoration: the shape's actual horizontal/vertical
  // spread from the players' own coordinates, for the readout strip below.
  const xs = players.map((player) => player.x);
  const ys = players.map((player) => player.y);
  const shapeWidth = Math.round(Math.max(...xs) - Math.min(...xs));
  const shapeDepth = Math.round(Math.max(...ys) - Math.min(...ys));

  const hasOpponent = Boolean(opponentPlayers && opponentPlayers.length > 0);
  const selectedPlayer = hasOpponent
    ? players.find((player) => player.id === selectedPlayerId)
    : undefined;
  const matchups = useMemo(
    () => (selectedPlayer && opponentPlayers ? findMatchups(selectedPlayer, opponentPlayers) : []),
    [selectedPlayer, opponentPlayers],
  );
  const matchupIds = useMemo(() => new Set(matchups.map((opponent) => opponent.id)), [matchups]);

  return (
    <div className="telemetry-frame telemetry-panel-lift ml-6 rounded-xl border-2 border-pitch-touchline/25 bg-pitch-deep p-2 sm:p-3">
      <span aria-hidden="true" className="telemetry-corner telemetry-corner-tl" />
      <span aria-hidden="true" className="telemetry-corner telemetry-corner-tr" />
      <span aria-hidden="true" className="telemetry-corner telemetry-corner-bl" />
      <span aria-hidden="true" className="telemetry-corner telemetry-corner-br" />
      <span aria-hidden="true" className="telemetry-ruler" />
      {phase && (
        <>
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-8 -z-10 rounded-[2.5rem] blur-2xl"
            style={{ background: "radial-gradient(circle closest-side, var(--attack) 0%, transparent 100%)" }}
            animate={{ opacity: phase === "in-possession" ? 0.08 : 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.6 }}
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-8 -z-10 rounded-[2.5rem] blur-2xl"
            style={{ background: "radial-gradient(circle closest-side, var(--defend) 0%, transparent 100%)" }}
            animate={{ opacity: phase === "out-of-possession" ? 0.08 : 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.6 }}
          />
        </>
      )}
      <div className="relative w-full aspect-[68/105] select-none">
        <PitchMarkings />
        <span aria-hidden="true" className="telemetry-cloud" />

        {ghostPairs.length > 0 && (
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            <g stroke="var(--defend)" strokeWidth="0.4" strokeOpacity="0.6" strokeDasharray="2.2 1.6">
              {ghostPairs.map((pair) => (
                <line
                  key={pair.from.id}
                  className={reduceMotion ? undefined : "pitch-draw"}
                  x1={pair.from.x}
                  y1={pair.from.y}
                  x2={pair.to.x}
                  y2={pair.to.y}
                  pathLength={1}
                />
              ))}
            </g>
          </svg>
        )}

        {ghostPlayers?.map((ghost) => (
          <div
            key={`ghost-${ghost.id}`}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${ghost.x}%`, top: `${ghost.y}%` }}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-dashed border-defend/70 bg-defend/10 font-mono text-xs font-semibold text-defend-bright">
              {ghost.code}
            </div>
          </div>
        ))}

        {hasOpponent && (
          <div className="absolute inset-0" aria-hidden="true">
            {opponentPlayers!.map((opponent) => {
              const isMatched = matchupIds.has(opponent.id);
              return (
                <motion.div
                  key={`opponent-${opponent.id}`}
                  layout
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${opponent.x}%`, top: `${opponent.y}%` }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 120, damping: 16, mass: 0.7 }
                  }
                >
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-full border-2 border-dashed font-mono text-xs font-semibold transition-colors ${
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
                  className={reduceMotion ? undefined : "pitch-draw"}
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

        <ul
          className="absolute inset-0"
          role="list"
          aria-label={`${formationName} formation: click a position to learn about it`}
        >
          {players.map((player, index) => {
            const position = getPosition(player.code);
            const isSelected = hasOpponent && selectedPlayerId === player.id;
            // Once the opponent overlay is on, the user's own markers stay a
            // consistent amber regardless of phase — otherwise "out of
            // possession" tints them blue, the same hue as every opponent
            // dot, and the two teams become hard to tell apart at a glance.
            const markerClassName = `group flex h-11 w-11 items-center justify-center rounded-full border-2 bg-pitch-card font-mono text-xs font-semibold text-pitch-line shadow-[0_2px_6px_rgba(34,56,74,0.3)] transition-colors hover:border-pitch-marker hover:bg-pitch-marker hover:text-pitch-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker ${
              isSelected
                ? "border-press ring-2 ring-press ring-offset-2 ring-offset-pitch-deep"
                : hasOpponent
                  ? "border-attack/40"
                  : phase === "in-possession"
                    ? "border-attack/40"
                    : phase === "out-of-possession"
                      ? "border-defend/40"
                      : "border-pitch-line/20"
            }`;
            return (
              <motion.li
                key={player.id}
                layout
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${player.x}%`, top: `${player.y}%` }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 120, damping: 16, mass: 0.7, delay: index * 0.02 }
                }
              >
                <motion.div
                  animate={reduceMotion ? undefined : { y: [0, -2, 0, 1, 0] }}
                  transition={
                    reduceMotion
                      ? undefined
                      : {
                          duration: 3.5 + (index % 5) * 0.4,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: (index % 7) * 0.3,
                        }
                  }
                >
                  {hasOpponent ? (
                    <button
                      type="button"
                      aria-pressed={isSelected}
                      aria-label={`${position?.name ?? player.code}: ${isSelected ? "hide" : "show"} their opponent matchup`}
                      onClick={() => onSelectPlayer?.(isSelected ? null : player.id)}
                      className={markerClassName}
                    >
                      {player.code}
                    </button>
                  ) : (
                    <Link
                      href={`/positions/${player.code.toLowerCase()}`}
                      aria-label={`${position?.name ?? player.code}: view position guide`}
                      className={markerClassName}
                    >
                      {player.code}
                    </Link>
                  )}
                </motion.div>
              </motion.li>
            );
          })}
        </ul>
      </div>

      <div className="telemetry-readout mt-2 flex items-center justify-between gap-2 rounded-md px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-widest text-telemetry-parchment/80">
        <span>{formationName}</span>
        <span>
          W {shapeWidth.toString().padStart(2, "0")} · D {shapeDepth.toString().padStart(2, "0")}
        </span>
        <span>{players.length}/11</span>
      </div>
    </div>
  );
}
