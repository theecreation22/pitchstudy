"use client";

import { motion, useReducedMotion } from "framer-motion";
import { getFormation } from "@/lib/formations";
import type { SignatureMechanic } from "@/lib/managers";

const toSvgX = (x: number) => (x / 100) * 68;
const toSvgY = (y: number) => (y / 100) * 105;

/** A small animated pitch diagram illustrating one spatial tactical idea — the moving dot(s) slide between two points while the rest of the formation sits static as backdrop. */
export function MechanicDiagram({ mechanic, size = "md" }: { mechanic: SignatureMechanic; size?: "md" | "lg" }) {
  const reduceMotion = useReducedMotion();
  const formation = getFormation(mechanic.formationSlug);
  const width = size === "lg" ? 108 : 84;
  const height = width * (105 / 68);

  if (!formation) return null;

  const movingIds = new Set(mechanic.moving.map((move) => move.playerId));

  return (
    <div
      aria-hidden="true"
      className="shrink-0 rounded-md border border-pitch-touchline/30 bg-pitch-deep p-1"
      style={{ width, height }}
    >
      <svg viewBox="0 0 68 105" className="h-full w-full">
        <rect
          x="1"
          y="1"
          width="66"
          height="103"
          rx="2"
          fill="none"
          stroke="var(--pitch-touchline)"
          strokeOpacity="0.4"
          strokeWidth="1.2"
        />
        <line x1="1" y1="52.5" x2="67" y2="52.5" stroke="var(--pitch-touchline)" strokeOpacity="0.4" strokeWidth="1" />

        {formation.players
          .filter((player) => !movingIds.has(player.id))
          .map((player) => (
            <circle
              key={player.id}
              cx={toSvgX(player.x)}
              cy={toSvgY(player.y)}
              r="3"
              fill="var(--pitch-touchline)"
              fillOpacity="0.5"
            />
          ))}

        {mechanic.moving.map((move) => {
          const fromX = toSvgX(move.from.x);
          const fromY = toSvgY(move.from.y);
          const toX = toSvgX(move.to.x);
          const toY = toSvgY(move.to.y);

          if (reduceMotion) {
            return (
              <g key={move.playerId}>
                <line
                  x1={fromX}
                  y1={fromY}
                  x2={toX}
                  y2={toY}
                  stroke="var(--attack)"
                  strokeOpacity="0.6"
                  strokeWidth="0.6"
                  strokeDasharray="1.6 1.3"
                />
                <circle cx={fromX} cy={fromY} r="3" fill="none" stroke="var(--attack)" strokeOpacity="0.7" strokeWidth="1" />
                <circle cx={toX} cy={toY} r="3.6" fill="var(--attack)" />
              </g>
            );
          }

          return (
            <motion.circle
              key={move.playerId}
              r="3.6"
              fill="var(--attack)"
              animate={{ cx: [fromX, toX, fromX], cy: [fromY, toY, fromY] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", times: [0, 0.5, 1] }}
            />
          );
        })}
      </svg>
    </div>
  );
}
