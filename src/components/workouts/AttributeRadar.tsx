"use client";

import { useEffect } from "react";
import { motion, useReducedMotion, useSpring, useTransform, type MotionValue } from "framer-motion";
import { ATTRIBUTES, attributeLabels, type Attribute } from "@/lib/workouts";

const CENTER = 100;
const MAX_RADIUS = 70;
const RING_FRACTIONS = [0.25, 0.5, 0.75, 1];

function axisPoint(index: number, fraction: number) {
  const angle = (Math.PI * 2 * index) / ATTRIBUTES.length - Math.PI / 2;
  return { x: CENTER + Math.cos(angle) * MAX_RADIUS * fraction, y: CENTER + Math.sin(angle) * MAX_RADIUS * fraction };
}

function polygonPoints(fraction: number | ((index: number) => number)): string {
  return ATTRIBUTES.map((_, i) => {
    const f = typeof fraction === "function" ? fraction(i) : fraction;
    const p = axisPoint(i, f);
    return `${p.x},${p.y}`;
  }).join(" ");
}

function labelAnchor(index: number): "start" | "middle" | "end" {
  const angle = (Math.PI * 2 * index) / ATTRIBUTES.length - Math.PI / 2;
  const cos = Math.cos(angle);
  if (cos > 0.3) return "start";
  if (cos < -0.3) return "end";
  return "middle";
}

type Props = {
  profile: Record<Attribute, number>;
  color?: string;
};

const SPRING_CONFIG = { stiffness: 140, damping: 22 };

function clampFraction(value: number): number {
  return Math.min(100, Math.max(0, value)) / 100;
}

/** One vertex, its own spring so the dot glides to its new position in lockstep with the polygon edge it anchors rather than teleporting ahead of it. */
function MorphingVertex({ fraction, index, color, reduceMotion }: { fraction: number; index: number; color: string; reduceMotion: boolean }) {
  const spring = useSpring(fraction, SPRING_CONFIG);
  useEffect(() => {
    if (reduceMotion) return;
    spring.set(fraction);
  }, [fraction, spring, reduceMotion]);
  const cx = useTransform(spring, (f) => axisPoint(index, f).x);
  const cy = useTransform(spring, (f) => axisPoint(index, f).y);
  const target = axisPoint(index, fraction);
  return (
    <motion.circle
      cx={reduceMotion ? target.x : cx}
      cy={reduceMotion ? target.y : cy}
      r="4"
      fill={color}
      stroke="var(--pitch-card)"
      strokeWidth="2"
      className={reduceMotion ? undefined : "transition-colors duration-300"}
    />
  );
}

/**
 * A small chalk-styled attribute radar (§2) — same six-axis math and visual
 * language as Tactics Lab's TacticalRadar, generalized to the workout
 * system's own Strength/Power/Speed/Agility/Endurance/Technical axes so each
 * playstyle gets a genuinely distinct visual fingerprint rather than a
 * generic bar chart. Kept as its own component rather than retrofitting
 * TacticalRadar itself, since that component is already shipped and tied
 * specifically to the tactics engine's 6 dimensions.
 *
 * §B2 — switching playstyle re-keyframes the *same* polygon rather than
 * hard-repainting it: one spring per axis, retargeted on every `profile`
 * change and combined into a single points string, so the shape genuinely
 * morphs from the old archetype's fingerprint to the new one.
 */
export function AttributeRadar({ profile, color = "var(--attack)" }: Props) {
  const reduceMotion = useReducedMotion();
  const dataFraction = (i: number) => clampFraction(profile[ATTRIBUTES[i]]);

  // One spring per axis — ATTRIBUTES has a fixed length of 6, so this is an
  // explicit unroll, not a conditional/loop call, and stays rules-of-hooks safe.
  const strengthSpring = useSpring(clampFraction(profile.strength), SPRING_CONFIG);
  const powerSpring = useSpring(clampFraction(profile.power), SPRING_CONFIG);
  const speedSpring = useSpring(clampFraction(profile.speed), SPRING_CONFIG);
  const agilitySpring = useSpring(clampFraction(profile.agility), SPRING_CONFIG);
  const enduranceSpring = useSpring(clampFraction(profile.endurance), SPRING_CONFIG);
  const technicalSpring = useSpring(clampFraction(profile.technical), SPRING_CONFIG);
  const springsByAttribute: Record<Attribute, MotionValue<number>> = {
    strength: strengthSpring,
    power: powerSpring,
    speed: speedSpring,
    agility: agilitySpring,
    endurance: enduranceSpring,
    technical: technicalSpring,
  };

  useEffect(() => {
    if (reduceMotion) return;
    ATTRIBUTES.forEach((attribute) => springsByAttribute[attribute].set(clampFraction(profile[attribute])));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, reduceMotion]);

  const morphedPoints = useTransform(
    [strengthSpring, powerSpring, speedSpring, agilitySpring, enduranceSpring, technicalSpring],
    (values: number[]) => ATTRIBUTES.map((_, i) => { const p = axisPoint(i, values[i]); return `${p.x},${p.y}`; }).join(" "),
  );

  return (
    <div className="flex flex-col gap-2">
      <svg
        viewBox="0 0 200 200"
        className="mx-auto h-auto w-full max-w-[220px] overflow-visible"
        role="img"
        aria-labelledby="attribute-radar-title"
      >
        <title id="attribute-radar-title">Attribute radar across six training dimensions</title>
        <g stroke="var(--pitch-touchline)" strokeOpacity="0.25" strokeWidth="1" fill="none">
          {RING_FRACTIONS.map((fraction) => (
            <polygon key={fraction} points={polygonPoints(fraction)} />
          ))}
          {ATTRIBUTES.map((_, i) => {
            const p = axisPoint(i, 1);
            return <line key={i} x1={CENTER} y1={CENTER} x2={p.x} y2={p.y} />;
          })}
        </g>

        <motion.polygon
          points={reduceMotion ? polygonPoints(dataFraction) : morphedPoints}
          fill={color}
          fillOpacity="0.18"
          stroke={color}
          strokeWidth="2"
          strokeLinejoin="round"
          className={reduceMotion ? undefined : "transition-colors duration-300"}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.5, ease: "easeOut" }}
          style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}
        />
        {ATTRIBUTES.map((attribute, i) => (
          <MorphingVertex key={attribute} fraction={dataFraction(i)} index={i} color={color} reduceMotion={!!reduceMotion} />
        ))}

        {ATTRIBUTES.map((attribute, i) => {
          const p = axisPoint(i, 1.2);
          return (
            <text
              key={attribute}
              x={p.x}
              y={p.y}
              textAnchor={labelAnchor(i)}
              dominantBaseline="middle"
              fontSize="7.5"
              fill="var(--pitch-touchline)"
              className="font-mono uppercase"
            >
              {attributeLabels[attribute]}
            </text>
          );
        })}
      </svg>

      <table className="sr-only">
        <caption>Attribute profile, out of 100</caption>
        <tbody>
          {ATTRIBUTES.map((attribute) => (
            <tr key={attribute}>
              <th scope="row">{attributeLabels[attribute]}</th>
              <td>{Math.round(profile[attribute])}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
