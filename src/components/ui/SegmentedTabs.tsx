"use client";

import { motion } from "framer-motion";

type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  id: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
};

/** A pill-track tab control with a sliding highlight — visually distinct from the plain bordered pills used for formation selection. */
export function SegmentedTabs<T extends string>({ id, options, value, onChange, ariaLabel }: Props<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="inline-flex gap-1 rounded-full border border-pitch-touchline/30 bg-pitch-card p-1"
    >
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            role="tab"
            aria-selected={isActive}
            type="button"
            onClick={() => onChange(option.value)}
            className="relative min-h-9 rounded-full px-4 font-mono text-xs uppercase tracking-widest transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
          >
            {isActive && (
              <motion.span
                layoutId={`segmented-${id}-indicator`}
                className="absolute inset-0 rounded-full bg-attack"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className={`relative z-10 ${isActive ? "text-night-950" : "text-pitch-touchline"}`}>
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
