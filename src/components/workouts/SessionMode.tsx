"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  DRILL_XP,
  getCooldownDrillIds,
  getDrill,
  getPlaystyle,
  getWarmupDrillIds,
  instanceKey,
  resolvePrescription,
  type Drill,
  type Equipment,
  type GeneratedProgram,
  type GeneratedWeek,
  type Level,
} from "@/lib/workouts";
import { useProgress } from "@/lib/progress";
import { useSoundPreference, playBeep } from "@/lib/useSoundPreference";
import { CountdownRing } from "./CountdownRing";
import { CATEGORY_COLOR } from "./DrillCard";

type StepKind = "warmup" | "drill" | "cooldown";
type SessionStep = { kind: StepKind; drillId: string };
type Phase = "work" | "rest";

function buildSteps(week: GeneratedWeek, level: Level, equipment: Equipment): SessionStep[] {
  const warmup = getWarmupDrillIds(level, equipment).map((drillId): SessionStep => ({ kind: "warmup", drillId }));
  const main = week.drillIds.map((drillId): SessionStep => ({ kind: "drill", drillId }));
  const cooldown = getCooldownDrillIds(level, equipment).map((drillId): SessionStep => ({ kind: "cooldown", drillId }));
  return [...warmup, ...main, ...cooldown];
}

/** Only a plainly-timed prescription ("30s", "5 minutes") can be auto-counted honestly — a rep count ("10", "8 each leg") has no real duration to fake, so those stay a manual "mark done" step. */
function parseDurationSeconds(reps: string): number | undefined {
  const seconds = reps.match(/^(\d+)\s*s(ec(onds)?)?$/i);
  if (seconds) return Number(seconds[1]);
  const minutes = reps.match(/^(\d+)\s*min(ute)?s?$/i);
  if (minutes) return Number(minutes[1]) * 60;
  return undefined;
}

function formatClock(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

type Props = { plan: GeneratedProgram; week: GeneratedWeek; onClose: () => void };

/**
 * A guided, one-drill-at-a-time runner through a week's session (§B4) —
 * warmup, then the week's main drills, then cooldown. Checking a drill here
 * calls the exact same `toggleDrillCompletion` the manual checklist uses, so
 * XP/badges stay a single system rather than a session-local duplicate.
 */
export function SessionMode({ plan, week, onClose }: Props) {
  const { toggleDrillCompletion, isDrillComplete } = useProgress();
  const [soundEnabled, setSoundEnabled] = useSoundPreference();
  const reduceMotion = useReducedMotion();
  const playstyle = plan.playstyleId ? getPlaystyle(plan.playstyleId) : undefined;

  function resolveSeconds(step: SessionStep | undefined, forPhase: Phase): number | undefined {
    if (!step) return undefined;
    const drill = getDrill(step.drillId);
    if (!drill) return undefined;
    const resolved = resolvePrescription(drill, plan.level, step.kind === "drill" ? playstyle?.prescriptionModifiers : undefined);
    if (forPhase === "work") return parseDurationSeconds(resolved.prescription.reps);
    return resolved.prescription.restSeconds > 0 ? resolved.prescription.restSeconds : undefined;
  }

  const [steps] = useState(() => buildSteps(week, plan.level, plan.equipment));
  const [stepIndex, setStepIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("work");
  const [secondsRemaining, setSecondsRemaining] = useState<number | undefined>(() => resolveSeconds(steps[0], "work"));
  const [status, setStatus] = useState<"running" | "complete">(steps.length === 0 ? "complete" : "running");
  const [startedAt] = useState(() => Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [drillsDone, setDrillsDone] = useState(0);

  // Guards against double-firing — and not just from rapid clicks. A button
  // whose exit is being animated by AnimatePresence keeps its *original*
  // render's onClick closure alive for the duration of that animation, so a
  // second click landing in that window calls completeWork/completeRest
  // with a stale (stepIndex, phase) pair even though the real transition
  // already moved on. A plain boolean flag doesn't catch this — it resets
  // based on "did the step change," which the stale closure has no way to
  // observe. Instead, `transitionRef` names the (stepIndex, phase) pair that
  // is *currently* authoritative; each call checks its own closure's pair
  // against it and bails if they don't match, then immediately claims the
  // *next* pair before doing anything else. A stale closure's pair can never
  // match once a real transition has claimed the next one, no matter which
  // mechanism made it stale.
  const transitionRef = useRef(`${stepIndex}-${phase}`);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const stepPhaseKey = `${stepIndex}-${phase}`;
  const [lastStepPhaseKey, setLastStepPhaseKey] = useState(stepPhaseKey);
  if (stepPhaseKey !== lastStepPhaseKey) {
    setLastStepPhaseKey(stepPhaseKey);
    setIsAdvancing(false);
  }

  function advanceToStep(nextIndex: number) {
    if (nextIndex >= steps.length) {
      setStatus("complete");
      setElapsedSeconds(Math.round((Date.now() - startedAt) / 1000));
      return;
    }
    setStepIndex(nextIndex);
    setPhase("work");
    setSecondsRemaining(resolveSeconds(steps[nextIndex], "work"));
  }

  function completeWork() {
    const myKey = `${stepIndex}-${phase}`;
    if (transitionRef.current !== myKey) return;

    const step = steps[stepIndex];
    const restSeconds = resolveSeconds(step, "rest");
    transitionRef.current = restSeconds ? `${stepIndex}-rest` : `${stepIndex + 1}-work`;
    setIsAdvancing(true);

    if (step.kind === "drill") {
      const drill = getDrill(step.drillId);
      const key = drill ? instanceKey(plan.slug, week.weekNumber, drill.id) : undefined;
      if (key && !isDrillComplete(key)) {
        toggleDrillCompletion(key, { xpAward: DRILL_XP });
        setXpEarned((xp) => xp + DRILL_XP);
      }
      setDrillsDone((n) => n + 1);
    }
    if (restSeconds) {
      setPhase("rest");
      setSecondsRemaining(restSeconds);
    } else {
      advanceToStep(stepIndex + 1);
    }
  }

  function completeRest() {
    const myKey = `${stepIndex}-${phase}`;
    if (transitionRef.current !== myKey) return;
    transitionRef.current = `${stepIndex + 1}-work`;
    setIsAdvancing(true);
    if (soundEnabled) playBeep();
    advanceToStep(stepIndex + 1);
  }

  // Ticks the active phase's countdown once a second. The state update (and,
  // on the final tick, the phase-completion call) happens inside the
  // `setTimeout` callback — deferred, asynchronous — never synchronously in
  // the effect body itself, which is what `react-hooks/set-state-in-effect`
  // actually objects to. Each run closes over the current step/phase fresh,
  // so completeWork/completeRest don't need to be listed as dependencies.
  useEffect(() => {
    if (status !== "running" || secondsRemaining === undefined) return;
    const timeout = setTimeout(() => {
      if (secondsRemaining <= 1) {
        if (phase === "work") completeWork();
        else completeRest();
      } else {
        setSecondsRemaining(secondsRemaining - 1);
      }
    }, 1000);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, secondsRemaining, phase, stepIndex]);

  const step = steps[stepIndex];
  const drill: Drill | undefined = step ? getDrill(step.drillId) : undefined;
  const resolved =
    drill && step ? resolvePrescription(drill, plan.level, step.kind === "drill" ? playstyle?.prescriptionModifiers : undefined) : undefined;
  const color = drill ? CATEGORY_COLOR[drill.category] : "var(--attack)";
  const totalSeconds =
    step && resolved ? (phase === "work" ? parseDurationSeconds(resolved.prescription.reps) : resolved.prescription.restSeconds) : undefined;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-night-950/85 p-4">
      <motion.div
        initial={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
        transition={{ duration: reduceMotion ? 0 : 0.2, ease: "easeOut" }}
        className="flex w-full max-w-md flex-col gap-6 rounded-lg border border-pitch-touchline/30 bg-pitch-card p-6"
      >
        <div className="flex items-center justify-between">
          <p className="font-mono text-xs uppercase tracking-widest text-pitch-touchline">
            {status === "running" ? `Week ${week.weekNumber} · Step ${stepIndex + 1} of ${steps.length}` : "Session Complete"}
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              aria-pressed={soundEnabled}
              aria-label="Toggle interval-end sound"
              className={`rounded px-1 py-1 font-mono text-xs uppercase tracking-widest focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker ${soundEnabled ? "text-attack" : "text-pitch-touchline"}`}
            >
              {soundEnabled ? "Sound On" : "Sound Off"}
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close session"
              className="flex min-h-11 min-w-11 items-center justify-center text-pitch-touchline hover:text-pitch-line focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
            >
              ✕
            </button>
          </div>
        </div>

        <AnimatePresence>
          {status === "running" && drill && (
            <motion.div
              key={`${stepIndex}-${phase}`}
              initial={reduceMotion ? undefined : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.2, ease: "easeOut" }}
              className="flex flex-col items-center gap-4 text-center"
            >
              <span className="rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-widest" style={{ borderColor: color, color }}>
                {phase === "work" ? (step?.kind === "warmup" ? "Warm-up" : step?.kind === "cooldown" ? "Cool-down" : "Work") : "Rest"}
              </span>
              <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-pitch-line">{drill.name}</h2>

              {phase === "work" && (
                <p className="font-mono text-sm text-pitch-touchline">
                  {resolved?.prescription.sets} x {resolved?.prescription.reps}
                  {resolved?.prescription.effortRPE ? ` · RPE ${resolved.prescription.effortRPE}/10` : ""}
                </p>
              )}

              {totalSeconds !== undefined ? (
                <CountdownRing totalSeconds={totalSeconds} remainingSeconds={secondsRemaining ?? 0} color={color} />
              ) : (
                <p className="max-w-xs text-sm leading-relaxed text-pitch-line/90">{drill.coachingCue}</p>
              )}

              <div className="flex gap-3">
                {phase === "work" && totalSeconds === undefined && (
                  <button
                    type="button"
                    disabled={isAdvancing}
                    onClick={completeWork}
                    className="inline-flex min-h-11 items-center rounded-full bg-attack px-6 font-mono text-xs font-semibold uppercase tracking-widest text-night-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker disabled:opacity-50"
                  >
                    Mark Done
                  </button>
                )}
                <button
                  type="button"
                  disabled={isAdvancing}
                  onClick={() => (phase === "work" ? completeWork() : completeRest())}
                  className="font-mono text-xs uppercase tracking-widest text-pitch-touchline hover:text-pitch-line disabled:opacity-50"
                >
                  Skip →
                </button>
              </div>
            </motion.div>
          )}

          {status === "complete" && (
            <motion.div
              key="complete"
              initial={reduceMotion ? undefined : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: reduceMotion ? 0 : 0.3, ease: "easeOut" }}
              className="flex flex-col items-center gap-4 py-4 text-center"
            >
              <p className="font-display text-3xl font-black uppercase tracking-tight text-attack">Nice work.</p>
              <div className="flex gap-8 font-mono text-sm text-pitch-touchline">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-2xl font-bold text-pitch-line">{drillsDone}</span>
                  <span className="uppercase tracking-widest">Drills</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-2xl font-bold text-pitch-line">{formatClock(elapsedSeconds)}</span>
                  <span className="uppercase tracking-widest">Time</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-2xl font-bold text-attack">+{xpEarned}</span>
                  <span className="uppercase tracking-widest">XP</span>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 inline-flex min-h-11 items-center rounded-full bg-attack px-6 font-mono text-xs font-semibold uppercase tracking-widest text-night-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
              >
                Back to Plan
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
