"use client";

import { useRef } from "react";

/** Scouting Dossier's mode switcher: folder tabs, not a pill track — the active tab sits raised
 * and borderless-on-its-bottom-edge, as if it were the divider card currently pulled forward in
 * a folder; inactive tabs recede a couple of pixels "behind" it. Built for Tactics Lab only —
 * the shared SegmentedTabs pill control still serves every Floodlit Pitch surface. */
export function DossierTabs<T extends string>({
  id,
  options,
  value,
  onChange,
  ariaLabel,
}: {
  id: string;
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
}) {
  const groupRef = useRef<HTMLDivElement>(null);

  function focusAndSelect(nextIndex: number) {
    const clamped = (nextIndex + options.length) % options.length;
    onChange(options[clamped].value);
    const buttons = groupRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    buttons?.[clamped]?.focus();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const activeIndex = options.findIndex((option) => option.value === value);
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
    <div className="max-w-full overflow-x-auto">
      <div
        ref={groupRef}
        role="tablist"
        aria-label={ariaLabel}
        onKeyDown={handleKeyDown}
        className="flex w-max items-end gap-1 border-b-2 border-night-800"
      >
        {options.map((option, index) => {
        const isActive = option.value === value;
        return (
          <button
            key={`${id}-${option.value}`}
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            type="button"
            onClick={() => onChange(option.value)}
            style={{ zIndex: isActive ? 10 : options.length - index }}
            className={`relative -mb-0.5 min-h-11 rounded-t-sm border-2 border-b-0 px-4 font-mono text-xs font-semibold uppercase tracking-widest transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker ${
              isActive
                ? "-translate-y-0.5 border-night-800 bg-pitch-card text-pitch-line"
                : "translate-y-0 border-transparent bg-transparent text-pitch-touchline hover:text-pitch-line"
            }`}
          >
            {option.label}
          </button>
          );
        })}
      </div>
    </div>
  );
}
