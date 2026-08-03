"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { computeTrainingCoverage, getPlaystyle, instanceKey, type Attribute } from "@/lib/workouts";
import { usePlayerCard, type PlayerCard } from "@/lib/playerCard";
import { useProgress } from "@/lib/progress";
import { PlayerCardView } from "./PlayerCardView";
import { WeekBoard } from "./WeekBoard";
import { SessionMode } from "./SessionMode";
import { WorkoutChecklist } from "./WorkoutChecklist";
import { TrialDayFlow } from "./TrialDayFlow";

const BALANCED_PROFILE: Record<Attribute, number> = { strength: 55, power: 55, speed: 55, agility: 55, endurance: 55, technical: 55 };

function useStickyCompact() {
  const [compact, setCompact] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setCompact(!entry.isIntersecting), { threshold: 0 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { compact, sentinelRef };
}

function EditConfirm({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-night-950/85 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex w-full max-w-sm flex-col gap-4 rounded-lg border border-pitch-touchline/30 bg-pitch-card p-6 text-center"
      >
        <p className="font-display text-xl font-bold uppercase tracking-tight text-pitch-line">New card, new block.</p>
        <p className="text-sm leading-relaxed text-pitch-touchline">
          Editing your card starts a fresh training block. This block&apos;s progress won&apos;t carry over.
        </p>
        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex min-h-11 items-center rounded-full border border-pitch-touchline/50 px-5 font-mono text-xs uppercase tracking-widest text-pitch-touchline hover:border-pitch-touchline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex min-h-11 items-center rounded-full bg-attack px-5 font-mono text-xs font-semibold uppercase tracking-widest text-night-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
          >
            Continue
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/** The Training Ground hub (§4) — the Player Card and its streak/progress up top, the week board as the main answer to "what do I do today," the full programme kept underneath as a section rather than the page. */
export function TrainingGroundHub({ card: initialCard }: { card: PlayerCard }) {
  const { card, program } = usePlayerCard();
  const { isDrillComplete, trainingStreak } = useProgress();
  const { compact, sentinelRef } = useStickyCompact();
  const [sessionWeekNumber, setSessionWeekNumber] = useState<number | undefined>(undefined);
  const [editing, setEditing] = useState(false);
  const [confirmingEdit, setConfirmingEdit] = useState(false);

  const activeCard = card ?? initialCard;
  if (!program) return null;

  const allInstanceKeys = program.weeks.flatMap((week) => week.drillIds.map((id) => instanceKey(program.slug, week.weekNumber, id)));
  const completedCount = allInstanceKeys.filter(isDrillComplete).length;
  const blockPercent = allInstanceKeys.length === 0 ? 0 : Math.round((completedCount / allInstanceKeys.length) * 100);
  const sessionWeek = sessionWeekNumber ? program.weeks.find((w) => w.weekNumber === sessionWeekNumber) : undefined;

  const targetProfile = (activeCard.playstyleId ? getPlaystyle(activeCard.playstyleId)?.attributeProfile : undefined) ?? BALANCED_PROFILE;
  const coverage = computeTrainingCoverage(program, targetProfile, isDrillComplete);
  const blockComplete = allInstanceKeys.length > 0 && completedCount === allInstanceKeys.length;

  if (editing) {
    return (
      <TrialDayFlow
        onComplete={() => {
          setEditing(false);
        }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div
        className={`fixed inset-x-0 top-0 z-40 mx-auto max-w-3xl px-4 pt-3 transition-transform duration-300 ${
          compact ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <PlayerCardView card={activeCard} compact onEdit={() => setConfirmingEdit(true)} coverage={coverage} />
      </div>

      <PlayerCardView card={activeCard} onEdit={() => setConfirmingEdit(true)} coverage={coverage} />
      <div ref={sentinelRef} />

      <div className="flex flex-wrap items-center gap-4 rounded-lg border border-pitch-touchline/30 bg-pitch-card px-5 py-4">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-pitch-touchline">
          <span className="text-attack">{trainingStreak}</span>
          <span>Day Streak</span>
        </div>
        <div className="flex flex-1 items-center gap-3">
          <div className="relative h-2.5 w-full min-w-[120px] overflow-hidden rounded-full bg-pitch-slate">
            <motion.div
              className="h-full rounded-full bg-attack"
              initial={false}
              animate={{ width: `${blockPercent}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{ boxShadow: blockPercent > 0 ? "0 0 10px 1px var(--attack)" : undefined }}
            />
          </div>
          <span className="shrink-0 font-mono text-xs text-pitch-touchline">{blockPercent}% of block</span>
        </div>
      </div>

      {blockComplete && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-2 rounded-lg border border-attack/40 bg-attack/10 px-6 py-8 text-center"
        >
          <p className="font-display text-3xl font-black uppercase tracking-tight text-attack">Block Complete.</p>
          <p className="max-w-md text-sm leading-relaxed text-pitch-line/90">
            Every session, done — your radar met the outline. Ready to set the next block?
          </p>
          <button
            type="button"
            onClick={() => setConfirmingEdit(true)}
            className="mt-2 inline-flex min-h-11 items-center rounded-full bg-attack px-6 font-mono text-xs font-semibold uppercase tracking-widest text-night-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
          >
            Start Next Block
          </button>
        </motion.div>
      )}

      <WeekBoard program={program} isDrillComplete={isDrillComplete} onStartSession={setSessionWeekNumber} />

      <div className="flex flex-col gap-4">
        <p className="font-mono text-xs uppercase tracking-widest text-pitch-marker">Full Programme</p>
        <WorkoutChecklist plan={program} />
      </div>

      {sessionWeek && <SessionMode plan={program} week={sessionWeek} onClose={() => setSessionWeekNumber(undefined)} />}

      {confirmingEdit && (
        <EditConfirm
          onConfirm={() => {
            setConfirmingEdit(false);
            setEditing(true);
          }}
          onCancel={() => setConfirmingEdit(false)}
        />
      )}
    </div>
  );
}
