"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { matchFormationPlayers, type FormationPlayer, type Phase } from "@/lib/formations";
import { getPosition } from "@/lib/positions";
import { PitchMarkings } from "./PitchMarkings";

type Props = {
  players: FormationPlayer[];
  formationName: string;
  /** When set, renders these as translucent outlines connected by lines to `players` — compare mode's "ghost overlay." */
  ghostPlayers?: FormationPlayer[];
  /** When set, the board glows amber (in possession) or blue (out of possession), cross-fading between the two. */
  phase?: Phase;
};

export function Pitch({ players, formationName, ghostPlayers, phase }: Props) {
  const reduceMotion = useReducedMotion();
  const ghostPairs = useMemo(
    () => (ghostPlayers ? matchFormationPlayers(players, ghostPlayers) : []),
    [players, ghostPlayers],
  );

  return (
    <div className="relative rounded-xl border-2 border-pitch-touchline/25 bg-pitch-deep p-2 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.7)] sm:p-3">
      {phase && (
        <>
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
        </>
      )}
      <div className="relative w-full aspect-[68/105] select-none">
        <PitchMarkings />

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

        <ul
          className="absolute inset-0"
          role="list"
          aria-label={`${formationName} formation — click a position to learn about it`}
        >
          {players.map((player, index) => {
            const position = getPosition(player.code);
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
                  <Link
                    href={`/positions/${player.code.toLowerCase()}`}
                    aria-label={`${position?.name ?? player.code} — view position guide`}
                    className={`group flex h-11 w-11 items-center justify-center rounded-full border-2 bg-pitch-card font-mono text-xs font-semibold text-pitch-line shadow-[0_2px_6px_rgba(0,0,0,0.5)] transition-colors hover:border-pitch-marker hover:bg-pitch-marker hover:text-pitch-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker ${
                      phase === "in-possession"
                        ? "border-attack/40"
                        : phase === "out-of-possession"
                          ? "border-defend/40"
                          : "border-pitch-line/20"
                    }`}
                  >
                    {player.code}
                  </Link>
                </motion.div>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
