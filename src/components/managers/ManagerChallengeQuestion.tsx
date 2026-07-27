"use client";

import { useState } from "react";
import type { ChallengeQuestion } from "@/lib/managers";

/** A single self-contained quiz question, answerable from the manager's own page content. Deliberately has no XP/streak/localStorage state of its own — that's what the full Challenge Mode at /challenge is for; this is just a quick, reusable check reusing that mode's visual language. */
export function ManagerChallengeQuestion({ question }: { question: ChallengeQuestion }) {
  const [selected, setSelected] = useState<number | null>(null);
  const hasAnswered = selected !== null;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium leading-relaxed text-pitch-line">{question.question}</p>
      <div className="flex flex-col gap-2" role="group" aria-label="Answer options">
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
              onClick={() => setSelected(optionIndex)}
              className={`rounded-md border px-3 py-2 text-left text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker ${stateClasses}`}
            >
              {option}
            </button>
          );
        })}
      </div>
      {hasAnswered && (
        <p className="rounded-md border border-pitch-touchline/20 bg-pitch-deep p-3 text-xs leading-relaxed text-pitch-line/90">
          {question.explanation}
        </p>
      )}
    </div>
  );
}
