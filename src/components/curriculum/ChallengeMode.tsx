"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useProgress } from "@/lib/progress";
import { modules, type ModuleQuizQuestion } from "@/lib/curriculum";

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function ChallengeMode() {
  const { completedModuleSlugs, state, recordChallengeStreak } = useProgress();
  const completedKey = completedModuleSlugs.join(",");
  const [pool, setPool] = useState<ModuleQuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    // Shuffling requires Math.random(), which must not run during SSR (the
    // server and client would pick different orders and React would flag a
    // hydration mismatch) — so the pool starts empty and is populated here,
    // strictly after mount, client-only.
    const questions = modules
      .filter((mod) => completedKey.split(",").includes(mod.slug))
      .flatMap((mod) => mod.quiz);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional client-only randomization, see comment above
    setPool(shuffle(questions));
    setIndex(0);
    setSelected(null);
    setStreak(0);
  }, [completedKey]);

  if (completedModuleSlugs.length === 0) {
    return (
      <div className="rounded-lg border border-defend/30 bg-pitch-card p-8 text-center">
        <p className="font-display text-2xl font-bold uppercase tracking-tight text-pitch-line">
          Locked
        </p>
        <p className="mt-2 text-sm leading-relaxed text-pitch-touchline">
          Complete Module 1 in the Academy to unlock Challenge Mode.
        </p>
        <Link
          href="/academy"
          className="mt-4 inline-flex min-h-11 items-center justify-center rounded-md bg-attack px-6 font-display text-base font-bold text-night-950 transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-line"
        >
          Go to Academy →
        </Link>
      </div>
    );
  }

  if (pool.length === 0) {
    return <p className="text-sm text-pitch-touchline">Loading challenge questions…</p>;
  }

  const question = pool[index % pool.length];
  const hasAnswered = selected !== null;

  function selectOption(optionIndex: number) {
    if (hasAnswered) return;
    setSelected(optionIndex);
    if (optionIndex === question.correctIndex) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      recordChallengeStreak(nextStreak);
    } else {
      setStreak(0);
    }
  }

  function next() {
    setIndex((current) => current + 1);
    setSelected(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-pitch-touchline/30 bg-pitch-card p-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-pitch-touchline">
            Current streak
          </p>
          <p className="font-display text-3xl font-black text-attack">{streak}</p>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-pitch-touchline">Best streak</p>
          <p className="font-display text-3xl font-black text-pitch-line">{state.challengeBestStreak}</p>
        </div>
      </div>

      <p className="text-lg font-medium leading-relaxed text-pitch-line sm:text-xl">
        {question.question}
      </p>

      <div className="flex flex-col gap-3" role="group" aria-label="Answer options">
        {question.options.map((option, optionIndex) => {
          const isCorrect = optionIndex === question.correctIndex;
          const isSelected = optionIndex === selected;
          let stateClasses = "border-pitch-touchline/40 text-pitch-line hover:border-pitch-touchline";
          if (hasAnswered) {
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
              disabled={hasAnswered}
              onClick={() => selectOption(optionIndex)}
              className={`rounded-lg border px-4 py-3 text-left text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker sm:text-base ${stateClasses}`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {hasAnswered && (
        <div className="rounded-lg border border-pitch-touchline/30 bg-pitch-card p-4">
          <p className="text-sm leading-relaxed text-pitch-line/90">{question.explanation}</p>
        </div>
      )}

      <button
        type="button"
        onClick={next}
        disabled={!hasAnswered}
        className="inline-flex min-h-11 w-fit items-center justify-center rounded-md border border-attack px-5 font-mono text-xs uppercase tracking-widest text-attack transition-colors hover:bg-attack/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker disabled:cursor-not-allowed disabled:opacity-30"
      >
        Next question →
      </button>
    </div>
  );
}
