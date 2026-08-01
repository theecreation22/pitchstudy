"use client";

import { useRef } from "react";

const COLUMNS = 10;
const NUMBERS = Array.from({ length: 99 }, (_, i) => i + 1);

type Props = {
  value: number;
  onChange: (value: number) => void;
  /** Numbers already used by another entry of the same type — dimmed, not disabled, since picking one is exactly how the save sheet's swap-numbers offer gets triggered. */
  takenNumbers: Set<number>;
  label: string;
};

/**
 * The Playbook's call-number picker — a 10-wide grid of every number 1-99,
 * roving-tabindex so arrow keys move the whole grid in one Tab stop rather
 * than tabbing through 99 buttons individually.
 */
export function NumberPicker({ value, onChange, takenNumbers, label }: Props) {
  const gridRef = useRef<HTMLDivElement>(null);

  function focusIndex(index: number) {
    const clamped = Math.max(0, Math.min(NUMBERS.length - 1, index));
    onChange(NUMBERS[clamped]);
    const buttons = gridRef.current?.querySelectorAll<HTMLButtonElement>("[data-number-cell]");
    buttons?.[clamped]?.focus();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const currentIndex = value - 1;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusIndex(currentIndex + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusIndex(currentIndex - 1);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      focusIndex(currentIndex + COLUMNS);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      focusIndex(currentIndex - COLUMNS);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusIndex(NUMBERS.length - 1);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-xs uppercase tracking-widest text-pitch-touchline">{label}</span>
      <div
        ref={gridRef}
        role="radiogroup"
        aria-label={label}
        onKeyDown={handleKeyDown}
        className="grid w-fit gap-1"
        style={{ gridTemplateColumns: `repeat(${COLUMNS}, minmax(0, 1fr))` }}
      >
        {NUMBERS.map((n) => {
          const isSelected = n === value;
          const isTaken = takenNumbers.has(n) && !isSelected;
          return (
            <button
              key={n}
              type="button"
              data-number-cell
              role="radio"
              aria-checked={isSelected}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => onChange(n)}
              className={`flex h-8 w-8 items-center justify-center rounded-md font-mono text-[11px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker ${
                isSelected
                  ? "bg-attack font-bold text-night-950"
                  : isTaken
                    ? "bg-pitch-slate text-pitch-touchline/40"
                    : "bg-pitch-card text-pitch-touchline hover:bg-pitch-touchline/10 hover:text-pitch-line"
              }`}
            >
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}
