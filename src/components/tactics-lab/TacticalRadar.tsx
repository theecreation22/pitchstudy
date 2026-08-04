"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { EngineScores } from "@/lib/tactics-lab/engine";

const CENTER = 100;
const MAX_RADIUS = 70;
const RING_FRACTIONS = [0.25, 0.5, 0.75, 1];

type Axis = { key: keyof EngineScores | "counterResilience"; label: string; value: (scores: EngineScores) => number };

/** Counter Vulnerability is inverted for display (as "Counter Resilience") so every axis on the chart consistently means "bigger is better" — a raw vulnerability spike would otherwise look like a strength next to the other five. */
const AXES: Axis[] = [
  { key: "defensiveSolidity", label: "Defensive Solidity", value: (s) => s.defensiveSolidity },
  { key: "attackingThreat", label: "Attacking Threat", value: (s) => s.attackingThreat },
  { key: "widthAndStretch", label: "Width & Stretch", value: (s) => s.widthAndStretch },
  { key: "compactness", label: "Compactness", value: (s) => s.compactness },
  { key: "pressResistance", label: "Press Resistance", value: (s) => s.pressResistance },
  { key: "counterResilience", label: "Counter Resilience", value: (s) => 100 - s.counterVulnerability },
];

function axisPoint(index: number, fraction: number) {
  const angle = (Math.PI * 2 * index) / AXES.length - Math.PI / 2;
  return { x: CENTER + Math.cos(angle) * MAX_RADIUS * fraction, y: CENTER + Math.sin(angle) * MAX_RADIUS * fraction };
}

function polygonPoints(fraction: number | ((index: number) => number)): string {
  return AXES.map((_, i) => {
    const f = typeof fraction === "function" ? fraction(i) : fraction;
    const p = axisPoint(i, f);
    return `${p.x},${p.y}`;
  }).join(" ");
}

function labelAnchor(index: number): "start" | "middle" | "end" {
  const angle = (Math.PI * 2 * index) / AXES.length - Math.PI / 2;
  const cos = Math.cos(angle);
  if (cos > 0.3) return "start";
  if (cos < -0.3) return "end";
  return "middle";
}

type Props = { scores: EngineScores };

export function TacticalRadar({ scores }: Props) {
  const reduceMotion = useReducedMotion();
  const dataFraction = (i: number) => Math.min(100, Math.max(0, AXES[i].value(scores))) / 100;

  return (
    <div className="flex flex-col gap-4 rounded-sm border border-pitch-touchline/30 bg-pitch-card p-4">
      <div className="flex items-baseline justify-between">
        <p className="font-mono text-xs uppercase tracking-widest text-pitch-marker">Tactical Balance</p>
        <p className="font-display text-3xl font-black text-pitch-line">{Math.round(scores.tacticalBalance)}</p>
      </div>

      <svg
        viewBox="0 0 200 200"
        className="mx-auto h-auto w-full max-w-xs overflow-visible"
        role="img"
        aria-labelledby="tactics-radar-title"
      >
        <title id="tactics-radar-title">Tactical balance radar across six dimensions</title>
        <g stroke="var(--pitch-touchline)" strokeOpacity="0.25" strokeWidth="1" fill="none">
          {RING_FRACTIONS.map((fraction) => (
            <polygon key={fraction} points={polygonPoints(fraction)} />
          ))}
          {AXES.map((_, i) => {
            const p = axisPoint(i, 1);
            return <line key={i} x1={CENTER} y1={CENTER} x2={p.x} y2={p.y} />;
          })}
        </g>

        <motion.polygon
          points={polygonPoints(dataFraction)}
          fill="var(--attack)"
          fillOpacity="0.18"
          stroke="var(--attack)"
          strokeWidth="2"
          strokeLinejoin="round"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.5, ease: "easeOut" }}
          style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}
        />
        {AXES.map((axis, i) => {
          const p = axisPoint(i, dataFraction(i));
          return (
            <circle key={axis.key} cx={p.x} cy={p.y} r="4" fill="var(--attack)" stroke="var(--pitch-card)" strokeWidth="2" />
          );
        })}

        {AXES.map((axis, i) => {
          const p = axisPoint(i, 1.18);
          return (
            <text
              key={axis.key}
              x={p.x}
              y={p.y}
              textAnchor={labelAnchor(i)}
              dominantBaseline="middle"
              fontSize="7"
              fill="var(--pitch-touchline)"
              className="font-mono uppercase"
            >
              {axis.label}
            </text>
          );
        })}
      </svg>

      {/* Text equivalent of the radar for screen readers and anyone who prefers a table to a shape. */}
      <table className="sr-only">
        <caption>Tactical balance dimension scores, out of 100</caption>
        <tbody>
          {AXES.map((axis) => (
            <tr key={axis.key}>
              <th scope="row">{axis.label}</th>
              <td>{Math.round(axis.value(scores))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
