"use client";

import { useCallback, useMemo, useRef } from "react";
import { useLocalStorageValue } from "./useLocalStorageValue";
import { getModule, modules, totalLessonCount } from "./curriculum";

const STORAGE_KEY = "pitchstudy:progress:v2";

export type QuizBest = { score: number; total: number };

export type ScenarioBest = { grade: string; steps: number };

export type ProgressState = {
  completedLessons: string[]; // `${moduleSlug}/${lessonSlug}`
  quizBestScores: Record<string, QuizBest>; // moduleSlug -> best
  xp: number;
  earnedBadges: string[];
  challengeBestStreak: number;
  scenarioBests: Record<string, ScenarioBest>; // `${scenarioSlug}:${tier}` -> best
  completedDrillInstances: string[]; // `${planSlug}:${weekNumber}:${drillId}` — instance-keyed since a drill can recur across weeks
  trainingDates: string[]; // unique YYYY-MM-DD dates a drill was completed on, for the Training Ground's streak
};

const DEFAULT_STATE: ProgressState = {
  completedLessons: [],
  quizBestScores: {},
  xp: 0,
  earnedBadges: [],
  challengeBestStreak: 0,
  scenarioBests: {},
  completedDrillInstances: [],
  trainingDates: [],
};

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Consecutive days ending today (or yesterday, so a streak isn't lost the instant a new day starts before that day's first session) with at least one drill completed. */
function computeTrainingStreak(dates: string[]): number {
  const set = new Set(dates);
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  const dateKey = (d: Date) => d.toISOString().slice(0, 10);

  if (!set.has(dateKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!set.has(dateKey(cursor))) return 0;
  }

  let streak = 0;
  while (set.has(dateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function parseState(raw: string | null): ProgressState {
  if (!raw) return DEFAULT_STATE;
  try {
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return { ...DEFAULT_STATE, ...parsed };
  } catch {
    return DEFAULT_STATE;
  }
}

export const badges = [
  { id: "first-whistle", name: "First Whistle", description: "Complete your first lesson." },
  { id: "hat-trick", name: "Hat-Trick", description: "Complete 3 lessons in one visit." },
  { id: "full-90", name: "Full 90", description: "Complete every lesson in a module." },
  { id: "clean-sheet", name: "Clean Sheet", description: "Score 100% on a module quiz." },
  { id: "ballon-dor", name: "Ballon d'Or", description: "Complete every lesson on PitchStudy." },
  { id: "set-piece-specialist", name: "Set-Piece Specialist", description: "Beat a set-piece scenario in the Play Designer." },
  { id: "counter-puncher", name: "Counter Puncher", description: "Beat a counter-attack scenario in the Play Designer." },
  { id: "lock-picker", name: "Lock-Picker", description: "Beat a low-block scenario in the Play Designer." },
  { id: "perfect-move", name: "Perfect Move", description: "Score Gold on a scenario using the minimum steps." },
  { id: "match-fit", name: "Match Fit", description: "Complete every drill in a training week." },
  { id: "block-complete", name: "Block Complete", description: "Finish every session in a training block." },
  { id: "opening-pages", name: "Opening Pages", description: "Save your first page to the Playbook." },
  { id: "thick-binder", name: "Thick Binder", description: "Save 10 pages to the Playbook." },
] as const;

export type BadgeId = (typeof badges)[number]["id"];

const SCENARIO_FAMILY_BADGE: Partial<Record<string, BadgeId>> = {
  "set-piece": "set-piece-specialist",
  "counter-attack": "counter-puncher",
  "low-block": "lock-picker",
};

const SCENARIO_XP_BY_GRADE: Record<string, number> = { gold: 100, silver: 60, bronze: 30 };
/** Exported so sync/mergeProfiles.ts can compare two ScenarioBests the same way completeScenario does, instead of re-deriving the ranking. */
export const SCENARIO_GRADE_RANK: Record<string, number> = { bronze: 1, silver: 2, gold: 3 };

export function useProgress() {
  const [raw, setRaw] = useLocalStorageValue(STORAGE_KEY);
  const state = useMemo(() => parseState(raw), [raw]);
  const sessionCompletions = useRef(0);

  const persist = useCallback((next: ProgressState) => setRaw(JSON.stringify(next)), [setRaw]);

  const completeLesson = useCallback(
    (moduleSlug: string, lessonSlug: string, xpAward = 50) => {
      const key = `${moduleSlug}/${lessonSlug}`;
      if (state.completedLessons.includes(key)) return;

      sessionCompletions.current += 1;
      const nextCompleted = [...state.completedLessons, key];
      const nextBadges = new Set(state.earnedBadges);
      const mod = getModule(moduleSlug);

      if (nextCompleted.length === 1) nextBadges.add("first-whistle");
      if (sessionCompletions.current >= 3) nextBadges.add("hat-trick");
      if (mod && mod.lessons.every((lesson) => nextCompleted.includes(`${moduleSlug}/${lesson.slug}`))) {
        nextBadges.add("full-90");
      }
      const total = totalLessonCount();
      if (total > 0 && nextCompleted.length >= total) nextBadges.add("ballon-dor");

      persist({
        ...state,
        completedLessons: nextCompleted,
        xp: state.xp + xpAward,
        earnedBadges: [...nextBadges],
      });
    },
    [state, persist],
  );

  const recordQuizScore = useCallback(
    (moduleSlug: string, score: number, total: number, xpPerCorrect = 10) => {
      const previous = state.quizBestScores[moduleSlug];
      const isNewBest = !previous || score > previous.score;
      const nextBadges = new Set(state.earnedBadges);
      if (total > 0 && score === total) nextBadges.add("clean-sheet");

      persist({
        ...state,
        quizBestScores: isNewBest
          ? { ...state.quizBestScores, [moduleSlug]: { score, total } }
          : state.quizBestScores,
        xp: state.xp + score * xpPerCorrect,
        earnedBadges: [...nextBadges],
      });
    },
    [state, persist],
  );

  const isLessonComplete = useCallback(
    (moduleSlug: string, lessonSlug: string) => state.completedLessons.includes(`${moduleSlug}/${lessonSlug}`),
    [state.completedLessons],
  );

  const moduleProgress = useCallback(
    (moduleSlug: string) => {
      const mod = getModule(moduleSlug);
      if (!mod || mod.lessons.length === 0) return { done: 0, total: 0 };
      const done = mod.lessons.filter((lesson) => isLessonComplete(moduleSlug, lesson.slug)).length;
      return { done, total: mod.lessons.length };
    },
    [isLessonComplete],
  );

  const completedModuleSlugs = useMemo(
    () =>
      modules
        .filter((mod) => {
          const { done, total } = moduleProgress(mod.slug);
          return total > 0 && done === total;
        })
        .map((mod) => mod.slug),
    [moduleProgress],
  );

  const recordChallengeStreak = useCallback(
    (streak: number) => {
      if (streak <= state.challengeBestStreak) return;
      persist({ ...state, challengeBestStreak: streak });
    },
    [state, persist],
  );

  const completeScenario = useCallback(
    (scenarioSlug: string, family: string, tier: string, grade: string, stepsUsed: number, isMinimumSteps: boolean) => {
      const key = `${scenarioSlug}:${tier}`;
      const previous = state.scenarioBests[key];
      const isNewBest =
        !previous || SCENARIO_GRADE_RANK[grade] > SCENARIO_GRADE_RANK[previous.grade] || (grade === previous.grade && stepsUsed < previous.steps);

      const nextBadges = new Set(state.earnedBadges);
      const familyBadge = SCENARIO_FAMILY_BADGE[family];
      if (familyBadge) nextBadges.add(familyBadge);
      if (grade === "gold" && isMinimumSteps) nextBadges.add("perfect-move");

      persist({
        ...state,
        scenarioBests: isNewBest ? { ...state.scenarioBests, [key]: { grade, steps: stepsUsed } } : state.scenarioBests,
        xp: state.xp + (SCENARIO_XP_BY_GRADE[grade] ?? 0),
        earnedBadges: [...nextBadges],
      });
    },
    [state, persist],
  );

  const isDrillComplete = useCallback(
    (instanceKey: string) => state.completedDrillInstances.includes(instanceKey),
    [state.completedDrillInstances],
  );

  /**
   * Toggles one drill instance (week + drill, since the same drill can recur
   * across a program's weeks) and awards/revokes its XP symmetrically —
   * checking is the workout system's core action, so it rides the same
   * XP/badge state everything else does rather than a separate localStorage
   * key. `weekJustCompleted` is passed in by the caller (WorkoutChecklist
   * knows which week a drill belongs to; this hook doesn't need to) so the
   * Match Fit badge can be awarded here alongside the rest of badge-earning.
   */
  const toggleDrillCompletion = useCallback(
    (instanceKey: string, options?: { xpAward?: number; weekJustCompleted?: boolean; blockJustCompleted?: boolean }) => {
      const xpAward = options?.xpAward ?? 15;
      const has = state.completedDrillInstances.includes(instanceKey);
      const nextCompleted = has
        ? state.completedDrillInstances.filter((key) => key !== instanceKey)
        : [...state.completedDrillInstances, instanceKey];
      const nextBadges = new Set(state.earnedBadges);
      if (!has && options?.weekJustCompleted) nextBadges.add("match-fit");
      if (!has && options?.blockJustCompleted) nextBadges.add("block-complete");
      // Only added on check, never removed on uncheck — a streak is about
      // having shown up that day, not a live-updating tally.
      const today = todayKey();
      const nextDates = !has && !state.trainingDates.includes(today) ? [...state.trainingDates, today] : state.trainingDates;

      persist({
        ...state,
        completedDrillInstances: nextCompleted,
        trainingDates: nextDates,
        xp: state.xp + (has ? -xpAward : xpAward),
        earnedBadges: [...nextBadges],
      });
    },
    [state, persist],
  );

  const trainingStreak = useMemo(() => computeTrainingStreak(state.trainingDates), [state.trainingDates]);

  /** Called with the Playbook's total entry count right after a save — XP only on the very first save (§6: "a small XP award"), badges at 1 and 10 entries. A no-op persist is skipped when neither milestone is hit. */
  const recordPlaybookSave = useCallback(
    (totalEntries: number, xpAward = 15) => {
      const nextBadges = new Set(state.earnedBadges);
      const isFirstSave = totalEntries === 1;
      if (isFirstSave) nextBadges.add("opening-pages");
      if (totalEntries === 10) nextBadges.add("thick-binder");
      if (!isFirstSave && nextBadges.size === state.earnedBadges.length) return;

      persist({
        ...state,
        xp: state.xp + (isFirstSave ? xpAward : 0),
        earnedBadges: [...nextBadges],
      });
    },
    [state, persist],
  );

  // Writes a fully-formed state wholesale — used by sync's merge step, which
  // has already combined local and cloud progress and just needs it stored.
  const replace = useCallback((next: ProgressState) => persist(next), [persist]);

  /**
   * Clears local progress back to zero: lessons, XP, badges, streaks, saved
   * scores. Only touches this device — the synced cloud copy is deleted from
   * the account page instead, and a signed-in device will pull that copy back
   * down on the next sync.
   */
  const reset = useCallback(() => {
    sessionCompletions.current = 0;
    persist(DEFAULT_STATE);
  }, [persist]);

  return {
    state,
    reset,
    trainingStreak,
    completeLesson,
    recordQuizScore,
    isLessonComplete,
    moduleProgress,
    completedModuleSlugs,
    recordChallengeStreak,
    completeScenario,
    isDrillComplete,
    toggleDrillCompletion,
    recordPlaybookSave,
    replace,
  };
}
