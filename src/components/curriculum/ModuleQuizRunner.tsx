"use client";

import { useState } from "react";
import Link from "next/link";
import { useProgress } from "@/lib/progress";
import type { Module } from "@/lib/curriculum";

function scoreMessage(score: number, total: number): string {
  const ratio = score / total;
  if (ratio === 1) return "Golden Boot — perfect score.";
  if (ratio >= 0.7) return "Starting XI — solid grasp of the module.";
  return "Back to Training — worth another pass through the lessons.";
}

export function ModuleQuizRunner({ module }: { module: Module }) {
  const { recordQuizScore, state } = useProgress();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = module.quiz[currentIndex];
  const isLast = currentIndex === module.quiz.length - 1;
  const hasAnswered = selectedIndex !== null;
  const best = state.quizBestScores[module.slug];

  function selectOption(index: number) {
    if (hasAnswered) return;
    setSelectedIndex(index);
    if (index === question.correctIndex) setScore((current) => current + 1);
  }

  function goNext() {
    if (isLast) {
      recordQuizScore(module.slug, score, module.quiz.length);
      setFinished(true);
      return;
    }
    setCurrentIndex((index) => index + 1);
    setSelectedIndex(null);
  }

  function restart() {
    setCurrentIndex(0);
    setSelectedIndex(null);
    setScore(0);
    setFinished(false);
  }

  if (finished) {
    return (
      <div className="flex flex-col items-start gap-6 rounded-lg border border-pitch-touchline/30 bg-pitch-card p-6">
        <p className="font-mono text-xs uppercase tracking-widest text-gold-flood">Module quiz complete</p>
        <p className="font-display text-6xl font-black text-pitch-line">
          {score} / {module.quiz.length}
        </p>
        <p className="text-base leading-relaxed text-pitch-line/90">
          {scoreMessage(score, module.quiz.length)}
        </p>
        {best && (
          <p className="font-mono text-xs text-pitch-touchline">
            Best: {best.score} / {best.total}
          </p>
        )}
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={restart}
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-gold-flood px-4 font-mono text-xs uppercase tracking-widest text-gold-flood transition-colors hover:bg-gold-flood/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
          >
            Try again
          </button>
          <Link
            href="/academy"
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-pitch-touchline/60 px-4 font-mono text-xs uppercase tracking-widest text-pitch-touchline transition-colors hover:border-pitch-touchline hover:text-pitch-line focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
          >
            Back to academy
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between font-mono text-xs uppercase tracking-widest text-pitch-touchline">
          <span>
            Question {currentIndex + 1} of {module.quiz.length}
          </span>
          <span className="text-gold-flood">Score: {score}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-pitch-card">
          <div
            className="h-full rounded-full bg-gold-flood transition-[width] duration-300 ease-out"
            style={{ width: `${((currentIndex + (hasAnswered ? 1 : 0)) / module.quiz.length) * 100}%` }}
          />
        </div>
      </div>

      <p className="text-lg font-medium leading-relaxed text-pitch-line sm:text-xl">
        {question.question}
      </p>

      <div className="flex flex-col gap-3" role="group" aria-label="Answer options">
        {question.options.map((option, index) => {
          const isCorrect = index === question.correctIndex;
          const isSelected = index === selectedIndex;

          let stateClasses = "border-pitch-touchline/40 text-pitch-line hover:border-pitch-touchline";
          if (hasAnswered) {
            if (isCorrect) {
              stateClasses = "border-attack bg-attack/10 text-attack";
            } else if (isSelected) {
              stateClasses = "border-press bg-press/10 text-press line-through animate-shake";
            } else {
              stateClasses = "border-pitch-touchline/20 text-pitch-touchline";
            }
          }

          return (
            <button
              key={option}
              type="button"
              disabled={hasAnswered}
              onClick={() => selectOption(index)}
              className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker sm:text-base ${stateClasses}`}
            >
              <span aria-hidden="true" className="font-mono text-xs">
                {hasAnswered && isCorrect ? "✓" : hasAnswered && isSelected ? "✕" : ""}
              </span>
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
        onClick={goNext}
        disabled={!hasAnswered}
        className="inline-flex min-h-11 w-fit items-center justify-center rounded-md border border-gold-flood px-5 font-mono text-xs uppercase tracking-widest text-gold-flood transition-colors hover:bg-gold-flood/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
      >
        {isLast ? "See results →" : "Next question →"}
      </button>
    </div>
  );
}
