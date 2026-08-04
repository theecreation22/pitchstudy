"use client";

import { useEffect, useState } from "react";
import { useProgress } from "@/lib/progress";
import { modules } from "@/lib/curriculum";

const allQuestions = modules.flatMap((mod) => mod.quiz.map((q) => q.question));

/** A hand-drawn flame — matches the chalk-line stroke language used elsewhere (e.g. CoachVerdictPanel's clipboard icon) rather than an emoji standing in for an icon system. */
function FlameIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 2c1 3-3 4-3 8a3 3 0 0 0 6 0c0-1.5-1-2-1-3.5 2 1.5 3 3.5 3 6a5 5 0 0 1-10 0c0-4 3-6 3-9.5 0-.5.5-1 2-1z" />
    </svg>
  );
}

/** A streak flame (visitor's own record, honestly framed — there's no live "current streak" tracked outside Challenge mode itself, only a best-ever high-water mark) plus a rotating sample question, picked client-side after mount so the random pick can't cause a hydration mismatch. */
export function ChallengeMiniCard() {
  const { state } = useProgress();
  const [sampleQuestion, setSampleQuestion] = useState<string | null>(null);

  useEffect(() => {
    if (allQuestions.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client-only random pick on mount, not derivable during render (SSR has no Math.random parity)
      setSampleQuestion(allQuestions[Math.floor(Math.random() * allQuestions.length)]);
    }
  }, []);

  return (
    <div className="flex flex-col gap-1.5">
      {state.challengeBestStreak > 0 && (
        <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-press">
          <FlameIcon className="h-3.5 w-3.5" />
          Best streak: {state.challengeBestStreak}
        </p>
      )}
      {sampleQuestion && (
        <p className="line-clamp-2 text-xs italic leading-snug text-pitch-touchline/80">&ldquo;{sampleQuestion}&rdquo;</p>
      )}
    </div>
  );
}
