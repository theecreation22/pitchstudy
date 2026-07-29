"use client";

import { useCallback, useMemo, useRef } from "react";
import { useLocalStorageValue } from "./useLocalStorageValue";
import { getModule, modules, totalLessonCount } from "./curriculum";

const STORAGE_KEY = "pitchiq:progress:v2";

export type QuizBest = { score: number; total: number };

export type ScenarioBest = { grade: string; steps: number };

export type ProgressState = {
  completedLessons: string[]; // `${moduleSlug}/${lessonSlug}`
  quizBestScores: Record<string, QuizBest>; // moduleSlug -> best
  xp: number;
  earnedBadges: string[];
  challengeBestStreak: number;
  scenarioBests: Record<string, ScenarioBest>; // `${scenarioSlug}:${tier}` -> best
};

const DEFAULT_STATE: ProgressState = {
  completedLessons: [],
  quizBestScores: {},
  xp: 0,
  earnedBadges: [],
  challengeBestStreak: 0,
  scenarioBests: {},
};

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
  { id: "ballon-dor", name: "Ballon d'Or", description: "Complete every lesson on PitchIQ." },
  { id: "set-piece-specialist", name: "Set-Piece Specialist", description: "Beat a set-piece scenario in the Play Designer." },
  { id: "counter-puncher", name: "Counter Puncher", description: "Beat a counter-attack scenario in the Play Designer." },
  { id: "lock-picker", name: "Lock-Picker", description: "Beat a low-block scenario in the Play Designer." },
  { id: "perfect-move", name: "Perfect Move", description: "Score Gold on a scenario using the minimum steps." },
] as const;

export type BadgeId = (typeof badges)[number]["id"];

const SCENARIO_FAMILY_BADGE: Partial<Record<string, BadgeId>> = {
  "set-piece": "set-piece-specialist",
  "counter-attack": "counter-puncher",
  "low-block": "lock-picker",
};

const SCENARIO_XP_BY_GRADE: Record<string, number> = { gold: 100, silver: 60, bronze: 30 };
const SCENARIO_GRADE_RANK: Record<string, number> = { bronze: 1, silver: 2, gold: 3 };

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

  return {
    state,
    completeLesson,
    recordQuizScore,
    isLessonComplete,
    moduleProgress,
    completedModuleSlugs,
    recordChallengeStreak,
    completeScenario,
  };
}
