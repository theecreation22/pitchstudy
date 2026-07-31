"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useSpring, useTransform, type MotionValue } from "framer-motion";
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

const SPRING_CONFIG = { stiffness: 140, damping: 22 };

function clampFraction(value: number): number {
  return Math.min(100, Math.max(0, value)) / 100;
}

/** One spring per axis, combined into a single points-string — the reusable half of the polygon morph, used for both the target outline and the growth fill. */
function useMorphingPolygon(profile: Record<Attribute, number>, reduceMotion: boolean) {
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

  return { morphedPoints, springsByAttribute };
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

type Props = {
  profile: Record<Attribute, number>;
  color?: string;
  /**
   * The growth loop (§2): when given, `profile` renders as a hollow chalk
   * outline (the archetype's target) and `secondaryProfile` renders as the
   * filled shape growing inside it (the user's own training coverage this
   * block). Omit it everywhere else — Trial Day previews and the picker
   * keep the original single-filled-shape look unchanged.
   */
  secondaryProfile?: Record<Attribute, number>;
  secondaryColor?: string;
  /** Draws the outline in with a chalk-stroke reveal on mount (§3's card reveal, §6's "radar draws itself"). */
  animateDraw?: boolean;
};

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
export function AttributeRadar({ profile, color = "var(--attack)", secondaryProfile, secondaryColor = "var(--attack)", animateDraw }: Props) {
  const reduceMotion = !!useReducedMotion();
  const dataFraction = (i: number) => clampFraction(profile[ATTRIBUTES[i]]);
  const { morphedPoints } = useMorphingPolygon(profile, reduceMotion);
  const secondary = useMorphingPolygon(secondaryProfile ?? profile, reduceMotion);
  const hasGrowth = secondaryProfile !== undefined;

  // Every completion should visibly land on the radar (§2), not just morph
  // silently on the next unrelated render — so a rise in total coverage
  // fires a one-shot pulse, detected the same render-time-comparison way
  // this codebase already resets state on a changed prop (no effect needed).
  const totalCoverage = hasGrowth ? ATTRIBUTES.reduce((sum, a) => sum + secondaryProfile![a], 0) : 0;
  const [lastTotalCoverage, setLastTotalCoverage] = useState(totalCoverage);
  const [pulseKey, setPulseKey] = useState(0);
  if (hasGrowth && totalCoverage > lastTotalCoverage) {
    setLastTotalCoverage(totalCoverage);
    setPulseKey((k) => k + 1);
  } else if (hasGrowth && totalCoverage < lastTotalCoverage) {
    setLastTotalCoverage(totalCoverage);
  }

  return (
    <div className="flex flex-col gap-2">
      <svg
        viewBox="0 0 200 200"
        className="mx-auto h-auto w-full max-w-[220px] overflow-visible"
        role="img"
        aria-labelledby="attribute-radar-title"
      >
        <title id="attribute-radar-title">
          {hasGrowth ? "Training coverage against your role's target shape" : "Attribute radar across six training dimensions"}
        </title>
        <g stroke="var(--pitch-touchline)" strokeOpacity="0.25" strokeWidth="1" fill="none">
          {RING_FRACTIONS.map((fraction) => (
            <polygon key={fraction} points={polygonPoints(fraction)} />
          ))}
          {ATTRIBUTES.map((_, i) => {
            const p = axisPoint(i, 1);
            return <line key={i} x1={CENTER} y1={CENTER} x2={p.x} y2={p.y} />;
          })}
        </g>

        {hasGrowth && (
          <motion.polygon
            points={secondary.morphedPoints}
            fill={secondaryColor}
            fillOpacity="0.35"
            stroke="none"
            initial={reduceMotion ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.4 }}
            style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}
          />
        )}

        {hasGrowth && !reduceMotion && (
          <AnimatePresence>
            {pulseKey > 0 && (
              <motion.polygon
                key={pulseKey}
                points={secondary.morphedPoints}
                fill="none"
                stroke={secondaryColor}
                strokeWidth="2"
                initial={{ opacity: 0.9, scale: 1 }}
                animate={{ opacity: 0, scale: 1.15 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}
              />
            )}
          </AnimatePresence>
        )}

        <motion.polygon
          points={reduceMotion ? polygonPoints(dataFraction) : morphedPoints}
          fill={hasGrowth ? "none" : color}
          fillOpacity={hasGrowth ? undefined : "0.18"}
          stroke={color}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeDasharray={animateDraw ? 1 : undefined}
          pathLength={animateDraw ? 1 : undefined}
          className={reduceMotion ? undefined : "transition-colors duration-300"}
          initial={
            reduceMotion
              ? undefined
              : animateDraw
                ? { pathLength: 0, opacity: 0, scale: 1 }
                : { scale: 0, opacity: 0 }
          }
          animate={animateDraw ? { pathLength: 1, opacity: 1 } : { scale: 1, opacity: 1 }}
          transition={{ duration: reduceMotion ? 0 : animateDraw ? 0.9 : 0.5, ease: "easeOut" }}
          style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}
        />
        {!hasGrowth &&
          ATTRIBUTES.map((attribute, i) => (
            <MorphingVertex key={attribute} fraction={dataFraction(i)} index={i} color={color} reduceMotion={reduceMotion} />
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

      {hasGrowth && (
        <p className="text-center font-mono text-[10px] uppercase tracking-widest text-pitch-touchline">
          Your training coverage this block — not a fitness test
        </p>
      )}

      <table className="sr-only">
        <caption>{hasGrowth ? "Training coverage vs. target, out of 100" : "Attribute profile, out of 100"}</caption>
        <tbody>
          {ATTRIBUTES.map((attribute) => (
            <tr key={attribute}>
              <th scope="row">{attributeLabels[attribute]}</th>
              <td>
                {hasGrowth ? `${Math.round(secondaryProfile![attribute])} / ${Math.round(profile[attribute])}` : Math.round(profile[attribute])}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
