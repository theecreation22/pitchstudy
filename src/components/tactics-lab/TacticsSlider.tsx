"use client";

import { useId, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Axis = "tempo" | "width";

type Props = {
  axis: Axis;
  label: string;
  leftLabel: string;
  rightLabel: string;
  value: number;
  onChange: (value: number) => void;
};

type Band = { max: number; word: string };

/** Five bands per axis, each a genuinely different word rather than a generic "low/medium/high" — the readout is what should catch the eye, so it earns real language. */
const BANDS: Record<Axis, Band[]> = {
  tempo: [
    { max: 19, word: "Glacial" },
    { max: 39, word: "Patient" },
    { max: 59, word: "Measured" },
    { max: 79, word: "Brisk" },
    { max: 100, word: "Blistering" },
  ],
  width: [
    { max: 19, word: "Narrow" },
    { max: 39, word: "Compact" },
    { max: 59, word: "Balanced" },
    { max: 79, word: "Stretched" },
    { max: 100, word: "Full Width" },
  ],
};

const TICKS = [0, 25, 50, 75, 100];

function wordFor(axis: Axis, value: number): string {
  return BANDS[axis].find((band) => value <= band.max)?.word ?? BANDS[axis][BANDS[axis].length - 1].word;
}

/** Tempo communicates its axis through a color shift (dark → bright amber); Width through the track's own thickness (thin → thick) — two different mechanisms so the sliders never read as interchangeable. */
function trackFill(axis: Axis, value: number): { background: string; height: number } {
  if (axis === "tempo") {
    return { background: "linear-gradient(90deg, var(--attack-deep), var(--attack), var(--attack-hi))", height: 6 };
  }
  return { background: "var(--attack)", height: 4 + (value / 100) * 8 };
}

/**
 * Fully re-skinned range input: a transparent native `<input type="range">`
 * stays on top for real keyboard/pointer/screen-reader behavior, while a
 * custom track + thumb underneath carry the visual design — the standard
 * pattern for reskinning a range input without fighting cross-browser
 * `::-webkit-slider-thumb`/`::-moz-range-thumb` quirks.
 */
export function TacticsSlider({ axis, label, leftLabel, rightLabel, value, onChange }: Props) {
  const reduceMotion = useReducedMotion();
  const [isFocused, setIsFocused] = useState(false);
  const [isGrabbed, setIsGrabbed] = useState(false);
  const id = useId();

  const word = wordFor(axis, value);
  const level = Math.round(value / 10);
  const fill = trackFill(axis, value);
  const thumbActive = isFocused || isGrabbed;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="font-mono text-[10px] uppercase tracking-widest text-pitch-touchline">
          {label}
        </label>
        <p className="font-mono text-sm font-bold text-attack">
          {word} <span className="text-[10px] font-normal text-pitch-touchline">({level}/10)</span>
        </p>
      </div>

      <div className="relative flex h-6 items-center">
        <div className="absolute inset-x-0 h-2 rounded-full bg-pitch-touchline/15" aria-hidden="true" />

        <div
          className="absolute left-0 rounded-full transition-[height] duration-150"
          style={{ width: `${value}%`, height: fill.height, background: fill.background }}
          aria-hidden="true"
        />

        <div className="pointer-events-none absolute inset-x-0 flex justify-between" aria-hidden="true">
          {TICKS.map((tick) => (
            <span key={tick} className="h-1.5 w-px bg-pitch-touchline/30" />
          ))}
        </div>

        <motion.div
          className="pointer-events-none absolute h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-attack bg-night-950"
          style={{ left: `${value}%` }}
          animate={
            reduceMotion
              ? undefined
              : {
                  scale: isGrabbed ? 1.35 : thumbActive ? 1.15 : 1,
                  boxShadow: thumbActive
                    ? "0 0 0 6px color-mix(in srgb, var(--attack) 30%, transparent)"
                    : "0 0 0 0px color-mix(in srgb, var(--attack) 0%, transparent)",
                }
          }
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        />

        <input
          id={id}
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onPointerDown={() => setIsGrabbed(true)}
          onPointerUp={() => setIsGrabbed(false)}
          className="absolute inset-x-0 h-full w-full cursor-pointer opacity-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pitch-marker"
          aria-label={label}
          aria-valuetext={`${word}, ${level} out of 10`}
        />
      </div>

      <div className="flex justify-between font-mono text-[10px] uppercase tracking-wide text-pitch-touchline">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
}
