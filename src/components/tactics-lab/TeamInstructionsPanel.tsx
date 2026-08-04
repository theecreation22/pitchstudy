"use client";

import { SegmentedTabs, type PillTone } from "@/components/ui/SegmentedTabs";
import { TacticsSlider } from "./TacticsSlider";
import type { Instructions, LineHeight, Mentality, PressStyle } from "@/lib/tactics-lab/designSchema";

type Props = {
  instructions: Instructions;
  onChange: (next: Instructions) => void;
};

const MENTALITY_OPTIONS = [
  { value: "defensive", label: "Defensive", tone: "defend" },
  { value: "balanced", label: "Balanced", tone: "attack" },
  { value: "attacking", label: "Attacking", tone: "warm" },
] as const satisfies { value: Mentality; label: string; tone: PillTone }[];

const PRESS_OPTIONS = [
  { value: "contain", label: "Contain", tone: "defend" },
  { value: "balanced", label: "Balanced", tone: "attack" },
  { value: "high-press", label: "High Press", tone: "press" },
] as const satisfies { value: PressStyle; label: string; tone: PillTone }[];

const LINE_OPTIONS = [
  { value: "deep", label: "Deep", tone: "defend" },
  { value: "medium", label: "Medium", tone: "attack" },
  { value: "high", label: "High", tone: "press" },
] as const satisfies { value: LineHeight; label: string; tone: PillTone }[];

/**
 * Five FM-style team instructions, deliberately capped at five per the
 * spec's own "resist bloat" note — every one of these also feeds the
 * deterministic engine, not just decoration. Mentality is the headline
 * decision (bigger pills, its own space); Tempo/Width group as "how we
 * play," Pressing/Defensive line as "defensive posture" — two clusters with
 * tight internal spacing and more air between them, rather than one even
 * uniform stack.
 */
export function TeamInstructionsPanel({ instructions, onChange }: Props) {
  return (
    <div className="tactics-panel flex flex-col gap-5 rounded-sm border border-pitch-touchline/30 p-4">
      <p className="font-mono text-xs uppercase tracking-widest text-pitch-marker">Team instructions</p>

      <div className="flex flex-col gap-2.5 border-b border-pitch-touchline/15 pb-5">
        <p className="font-mono text-xs uppercase tracking-widest text-pitch-touchline">Mentality</p>
        <SegmentedTabs
          id="tactics-lab-mentality"
          ariaLabel="Mentality"
          size="lg"
          fullWidth
          options={MENTALITY_OPTIONS}
          value={instructions.mentality}
          onChange={(mentality) => onChange({ ...instructions, mentality })}
        />
      </div>

      <div className="flex flex-col gap-3">
        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-pitch-touchline">How we play</p>
        <TacticsSlider
          axis="tempo"
          label="Tempo"
          leftLabel="Slow"
          rightLabel="Fast"
          value={instructions.tempo}
          onChange={(tempo) => onChange({ ...instructions, tempo })}
        />
        <TacticsSlider
          axis="width"
          label="Width"
          leftLabel="Narrow"
          rightLabel="Wide"
          value={instructions.width}
          onChange={(width) => onChange({ ...instructions, width })}
        />
      </div>

      <div className="h-px bg-pitch-touchline/15" />

      <div className="flex flex-col gap-3">
        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-pitch-touchline">Defensive posture</p>
        <div className="flex flex-col gap-1.5">
          <p className="font-mono text-[10px] uppercase tracking-widest text-pitch-touchline">Pressing</p>
          <SegmentedTabs
            id="tactics-lab-press"
            ariaLabel="Pressing style"
            fullWidth
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
            fullWidth
            options={LINE_OPTIONS}
            value={instructions.line}
            onChange={(line) => onChange({ ...instructions, line })}
          />
        </div>
      </div>
    </div>
  );
}
