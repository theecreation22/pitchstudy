"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

/** Which brand hue an option's active fill takes — lets a pill group teach risk/posture through color instead of every selection reading as the same amber. Omit for the plain default (amber). `warm` is a subtle attack/press blend for a choice that leans aggressive without being a full risk takeover — that's reserved for `press` alone. */
export type PillTone = "attack" | "defend" | "press" | "warm";

type Option<T extends string> = { value: T; label: string; tone?: PillTone };

type Props<T extends string> = {
  id: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  /** "lg" gives a control more physical weight than its neighbors — for the one decision in a group that outranks the rest, not a global size knob. */
  size?: "md" | "lg";
  /** Stretches the track to fill its container with equal-width segments, instead of shrink-wrapping its content. Opt-in: several call sites (the top-level Designer-mode tabs, Scenario Mode's tier picker) sit inline alongside other content and rely on the default shrink-wrap width. */
  fullWidth?: boolean;
};

const SIZE_STYLES: Record<"md" | "lg", string> = {
  md: "min-h-9 px-4 text-xs",
  // Taller and bolder, not wider — a text-size bump here overflows the
  // sidebar's fixed width once three options share the row (verified: text-sm
  // pushed "Attacking" past the panel edge at the sidebar's actual width).
  lg: "min-h-11 px-5 text-xs font-bold",
};

const TONE_FILL: Record<PillTone, string> = {
  attack: "bg-attack",
  defend: "bg-defend",
  press: "bg-press",
  warm: "bg-attack-warm-lean",
};

/** attack/defend/press are ink-safe dark fills under Pitch Telemetry, so a light label (night-950, now the pale sky tone) reads best on all three — the active label color never needs to change per tone, only the fill does. */
const ACTIVE_TEXT = "text-night-950";

/**
 * A pill-track tab control with a sliding highlight — visually distinct from
 * the plain bordered pills used for formation selection. Each option can
 * carry a `tone` so the active fill itself communicates risk/posture (e.g.
 * a "High Press" option filling red, not the same amber as every other
 * choice) — selecting a `press`-toned option also gets a brief red pulse,
 * since a risky choice should be *felt*, not just repainted.
 */
export function SegmentedTabs<T extends string>({
  id,
  options,
  value,
  onChange,
  ariaLabel,
  size = "md",
  fullWidth = false,
}: Props<T>) {
  const reduceMotion = useReducedMotion();
  const activeIndex = options.findIndex((option) => option.value === value);
  const groupRef = useRef<HTMLDivElement>(null);

  function focusAndSelect(nextIndex: number) {
    const clamped = (nextIndex + options.length) % options.length;
    onChange(options[clamped].value);
    const buttons = groupRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    buttons?.[clamped]?.focus();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      focusAndSelect(activeIndex + 1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      focusAndSelect(activeIndex - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusAndSelect(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusAndSelect(options.length - 1);
    }
  }

  return (
    <div
      ref={groupRef}
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      // `self-start` matters: inline-flex alone does NOT shrink-wrap when the
      // track is a direct child of a flex-column (align-items: stretch wins),
      // which stretched the pill track to full width and stranded the options
      // against a wide empty right side. The inset shadow recesses the track
      // so the active pill reads as raised out of it.
      className={`${fullWidth ? "flex w-full" : "inline-flex self-start"} gap-1 rounded-full border border-pitch-touchline/30 bg-pitch-card p-1 shadow-[inset_0_1px_3px_rgba(0,0,0,0.35)]`}
    >
      {options.map((option) => {
        const isActive = option.value === value;
        const tone = option.tone ?? "attack";
        return (
          <button
            key={option.value}
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            type="button"
            onClick={() => onChange(option.value)}
            className={`group relative rounded-full font-mono uppercase tracking-widest transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker hover:-translate-y-px ${fullWidth ? "flex-1" : ""} ${SIZE_STYLES[size]}`}
          >
            {isActive && (
              <motion.span
                layoutId={`segmented-${id}-indicator`}
                className={`absolute inset-0 rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.3)] ${TONE_FILL[tone]} ${tone === "press" ? "animate-risk-pulse" : ""}`}
                transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            {!isActive && (
              <span className="absolute inset-0 rounded-full bg-pitch-touchline/0 transition-colors group-hover:bg-pitch-touchline/10" />
            )}
            <span className={`relative z-10 ${isActive ? ACTIVE_TEXT : "text-pitch-touchline group-hover:text-pitch-line"}`}>
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
