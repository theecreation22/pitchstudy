"use client";

import { SegmentedTabs } from "@/components/ui/SegmentedTabs";
import type { Instructions, LineHeight, Mentality, PressStyle } from "@/lib/tactics-lab/designSchema";

type Props = {
  instructions: Instructions;
  onChange: (next: Instructions) => void;
};

function Slider({
  label,
  leftLabel,
  rightLabel,
  value,
  onChange,
}: {
  label: string;
  leftLabel: string;
  rightLabel: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="font-mono text-[10px] uppercase tracking-widest text-pitch-touchline">{label}</p>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full accent-attack"
        aria-label={label}
      />
      <div className="flex justify-between font-mono text-[10px] uppercase tracking-wide text-pitch-touchline/70">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
}

const MENTALITY_OPTIONS = [
  { value: "defensive", label: "Defensive" },
  { value: "balanced", label: "Balanced" },
  { value: "attacking", label: "Attacking" },
] as const satisfies { value: Mentality; label: string }[];

const PRESS_OPTIONS = [
  { value: "contain", label: "Contain" },
  { value: "balanced", label: "Balanced" },
  { value: "high-press", label: "High Press" },
] as const satisfies { value: PressStyle; label: string }[];

const LINE_OPTIONS = [
  { value: "deep", label: "Deep" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
] as const satisfies { value: LineHeight; label: string }[];

/** Five FM-style team instructions, deliberately capped at five per the spec's own "resist bloat" note — every one of these also feeds the deterministic engine, not just decoration. */
export function TeamInstructionsPanel({ instructions, onChange }: Props) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-pitch-touchline/30 bg-pitch-card p-4">
      <p className="font-mono text-xs uppercase tracking-widest text-pitch-marker">Team instructions</p>

      <div className="flex flex-col gap-1.5">
        <p className="font-mono text-[10px] uppercase tracking-widest text-pitch-touchline">Mentality</p>
        <SegmentedTabs
          id="tactics-lab-mentality"
          ariaLabel="Mentality"
          options={MENTALITY_OPTIONS}
          value={instructions.mentality}
          onChange={(mentality) => onChange({ ...instructions, mentality })}
        />
      </div>

      <Slider
        label="Tempo"
        leftLabel="Slow"
        rightLabel="Fast"
        value={instructions.tempo}
        onChange={(tempo) => onChange({ ...instructions, tempo })}
      />

      <Slider
        label="Width"
        leftLabel="Narrow"
        rightLabel="Wide"
        value={instructions.width}
        onChange={(width) => onChange({ ...instructions, width })}
      />

      <div className="flex flex-col gap-1.5">
        <p className="font-mono text-[10px] uppercase tracking-widest text-pitch-touchline">Pressing</p>
        <SegmentedTabs
          id="tactics-lab-press"
          ariaLabel="Pressing style"
          options={PRESS_OPTIONS}
          value={instructions.press}
          onChange={(press) => onChange({ ...instructions, press })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <p className="font-mono text-[10px] uppercase tracking-widest text-pitch-touchline">Defensive line</p>
        <SegmentedTabs
          id="tactics-lab-line"
          ariaLabel="Defensive line height"
          options={LINE_OPTIONS}
          value={instructions.line}
          onChange={(line) => onChange({ ...instructions, line })}
        />
      </div>
    </div>
  );
}
