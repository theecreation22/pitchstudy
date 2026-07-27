"use client";

import { useState } from "react";
import type { InlineCheck } from "@/lib/curriculum";

export function InlineCheckView({ check }: { check: InlineCheck }) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="rounded-lg border border-pitch-touchline/30 bg-pitch-card p-5">
      <p className="font-mono text-xs uppercase tracking-widest text-attack">Quick check</p>
      <p className="mt-2 text-base font-medium text-pitch-line">{check.question}</p>
      <div className="mt-3 flex flex-col gap-2">
        {check.options.map((option, index) => {
          const isCorrect = index === check.correctIndex;
          const isSelected = index === selected;
          let stateClasses = "border-pitch-touchline/40 text-pitch-line hover:border-pitch-touchline";
          if (selected !== null) {
            stateClasses = isCorrect
              ? "border-attack bg-attack/10 text-attack"
              : isSelected
                ? "border-press bg-press/10 text-press line-through animate-shake"
                : "border-pitch-touchline/20 text-pitch-touchline";
          }
          return (
            <button
              key={option}
              type="button"
              disabled={selected !== null}
              onClick={() => setSelected(index)}
              className={`rounded-md border px-4 py-3 text-left text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker ${stateClasses}`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
