"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { instanceKey, splitWeekIntoDays, type GeneratedProgram } from "@/lib/workouts";

/** A chalk tick, hand-drawn rather than a checkmark glyph — drawn once via pathLength when a day is fully complete (§6). */
function ChalkTick() {
  const reduceMotion = useReducedMotion();
  return (
    <svg viewBox="0 0 40 40" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
      <motion.path
        d="M8 21 L16 29 L33 10"
        fill="none"
        stroke="var(--attack)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        initial={reduceMotion ? undefined : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.85 }}
        transition={{ duration: reduceMotion ? 0 : 0.4, ease: "easeOut" }}
      />
    </svg>
  );
}

function DayRing({ done, total }: { done: number; total: number }) {
  const RADIUS = 14;
  const CIRC = 2 * Math.PI * RADIUS;
  const fraction = total === 0 ? 0 : done / total;
  return (
    <svg viewBox="0 0 36 36" className="h-9 w-9 -rotate-90">
      <circle cx="18" cy="18" r={RADIUS} fill="none" stroke="var(--pitch-touchline)" strokeOpacity="0.25" strokeWidth="3" />
      <circle
        cx="18"
        cy="18"
        r={RADIUS}
        fill="none"
        stroke="var(--attack)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={CIRC}
        strokeDashoffset={CIRC * (1 - fraction)}
      />
    </svg>
  );
}

type Props = {
  program: GeneratedProgram;
  isDrillComplete: (key: string) => boolean;
  onStartSession: (weekNumber: number) => void;
};

/** The gaffer's whiteboard (§4) — replaces the flat stacked week lists. A journey strip picks the week; that week's drills are pinned as day cards, slightly rotated, with a chalk tick once a day's drills are all done. */
export function WeekBoard({ program, isDrillComplete, onStartSession }: Props) {
  const reduceMotion = useReducedMotion();

  const weekStatus = program.weeks.map((week) => {
    const keys = week.drillIds.map((id) => instanceKey(program.slug, week.weekNumber, id));
    const done = keys.filter(isDrillComplete).length;
    return { weekNumber: week.weekNumber, done, total: keys.length, complete: keys.length > 0 && done === keys.length };
  });
  const currentWeekNumber = weekStatus.find((w) => !w.complete)?.weekNumber ?? program.weeks.length;
  const blockComplete = weekStatus.every((w) => w.complete);

  const [viewedWeekNumber, setViewedWeekNumber] = useState(currentWeekNumber);
  const viewedWeek = program.weeks.find((w) => w.weekNumber === viewedWeekNumber) ?? program.weeks[0];
  const days = splitWeekIntoDays(viewedWeek);
  const isViewingCurrent = viewedWeekNumber === currentWeekNumber;

  const dayStatus = days.map((day) => {
    const keys = day.drillIds.map((id) => instanceKey(program.slug, viewedWeek.weekNumber, id));
    const done = keys.filter(isDrillComplete).length;
    return { done, total: keys.length, complete: keys.length > 0 && done === keys.length };
  });
  const nextDayIndex = dayStatus.findIndex((d) => !d.complete);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {program.weeks.map((week, i) => {
          const status = weekStatus[i];
          const isActive = week.weekNumber === viewedWeekNumber;
          return (
            <button
              key={week.weekNumber}
              type="button"
              onClick={() => setViewedWeekNumber(week.weekNumber)}
              aria-current={isActive}
              className={`flex shrink-0 flex-col items-center gap-1 rounded-lg border px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker ${
                isActive
                  ? "border-attack bg-attack/10 text-attack"
                  : status.complete
                    ? "border-pitch-touchline/30 text-pitch-touchline"
                    : "border-pitch-touchline/20 text-pitch-touchline/50"
              }`}
            >
              <span>Week {week.weekNumber}</span>
              <span className="text-[10px] normal-case text-pitch-touchline/80">
                {status.complete ? "Done" : `${status.done}/${status.total}`}
              </span>
            </button>
          );
        })}
      </div>

      <div>
        <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-pitch-line">
          Week {viewedWeek.weekNumber}: {viewedWeek.focus}
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {days.map((day, index) => {
          const status = dayStatus[index];
          const isNext = isViewingCurrent && index === nextDayIndex;
          const rotation = index % 2 === 0 ? -1 : 1;
          return (
            <motion.div
              key={day.dayNumber}
              initial={reduceMotion ? undefined : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0, rotate: reduceMotion ? 0 : rotation }}
              transition={{ duration: reduceMotion ? 0 : 0.3, delay: reduceMotion ? 0 : index * 0.06, ease: "easeOut" }}
              className={`relative flex flex-col gap-3 rounded-lg border bg-pitch-card p-4 ${
                isNext ? "border-attack shadow-[0_0_24px_-8px_var(--attack)]" : "border-pitch-touchline/30"
              }`}
            >
              {status.complete && <ChalkTick />}
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-widest text-pitch-touchline">Day {day.dayNumber}</span>
                <DayRing done={status.done} total={status.total} />
              </div>
              <p className="font-display text-lg font-bold uppercase tracking-tight text-pitch-line">{day.focus}</p>
              <p className="font-mono text-xs text-pitch-touchline">{status.done}/{status.total} drills</p>
            </motion.div>
          );
        })}
      </div>

      {isViewingCurrent && !blockComplete && (
        <button
          type="button"
          onClick={() => onStartSession(viewedWeek.weekNumber)}
          className="inline-flex min-h-14 w-fit items-center gap-2 self-center rounded-full bg-attack px-10 font-mono text-sm font-bold uppercase tracking-widest text-night-950 telemetry-panel-lift transition-transform hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pitch-marker"
        >
          Start This Week&apos;s Session →
        </button>
      )}

      {blockComplete && (
        <p className="self-center font-mono text-sm uppercase tracking-widest text-attack">
          Block complete. Every session, done.
        </p>
      )}
    </div>
  );
}
