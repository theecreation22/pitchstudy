"use client";

import { useState } from "react";
import Link from "next/link";
import type { Quiz } from "@/lib/quizzes";
import { useLocalStorageValue } from "@/lib/useLocalStorageValue";
import { ScoreboardHeader } from "./ScoreboardHeader";

function scoreMessage(score: number, total: number): string {
  const ratio = score / total;
  if (ratio === 1) return "Perfect score: you could be reading the tactics board yourself.";
  if (ratio >= 0.75) return "Strong grasp of the shape.";
  if (ratio >= 0.5) return "Solid start, with a few gaps left to close.";
  return "Worth another lap of the pitch explorer first.";
}

export function QuizRunner({ quiz }: { quiz: Quiz }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [isNewBest, setIsNewBest] = useState(false);

  const bestScoreKey = `pitchiq:quiz:${quiz.slug}:best`;
  const [bestScoreRaw, setBestScoreRaw] = useLocalStorageValue(bestScoreKey);
  const bestScore = bestScoreRaw ? Number(bestScoreRaw) : null;

  const question = quiz.questions[currentIndex];
  const isLast = currentIndex === quiz.questions.length - 1;
  const hasAnswered = selectedIndex !== null;

  function selectOption(index: number) {
    if (hasAnswered) return;
    setSelectedIndex(index);
    if (index === question.correctIndex) {
      setScore((current) => current + 1);
    }
  }

  function goNext() {
    if (isLast) {
      const beatBest = bestScore === null || score > bestScore;
      if (beatBest) {
        setBestScoreRaw(String(score));
      }
      setIsNewBest(beatBest);
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
    setIsNewBest(false);
  }

  if (finished) {
    return (
      <div className="flex flex-col items-start gap-6 rounded-lg border border-pitch-touchline/30 bg-pitch-card p-6">
        <p className="font-mono text-xs uppercase tracking-widest text-pitch-marker">
          Quiz complete
        </p>
        <p className="font-display text-6xl font-black text-pitch-line">
          {score} / {quiz.questions.length}
        </p>
        <p className="text-base leading-relaxed text-pitch-line/90">
          {scoreMessage(score, quiz.questions.length)}
        </p>
        {bestScore !== null && (
          <p className="font-mono text-xs text-pitch-touchline">
            Best: {bestScore} / {quiz.questions.length}
            {isNewBest ? ", new best!" : ""}
          </p>
        )}
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={restart}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-pitch-marker px-4 font-mono text-xs uppercase tracking-widest text-pitch-marker transition-colors hover:bg-pitch-marker/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
          >
            Try again
          </button>
          <Link
            href="/quiz"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-pitch-touchline/60 px-4 font-mono text-xs uppercase tracking-widest text-pitch-touchline transition-colors hover:border-pitch-touchline hover:text-pitch-line focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
          >
            Back to quizzes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <ScoreboardHeader
        current={currentIndex + 1}
        total={quiz.questions.length}
        score={score}
        progress={((currentIndex + (hasAnswered ? 1 : 0)) / quiz.questions.length) * 100}
      />

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
        className="inline-flex min-h-11 w-fit items-center justify-center rounded-full border border-pitch-marker px-5 font-mono text-xs uppercase tracking-widest text-pitch-marker transition-colors hover:bg-pitch-marker/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
      >
        {isLast ? "See results →" : "Next question →"}
      </button>
    </div>
  );
}
