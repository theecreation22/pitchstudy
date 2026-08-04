"use client";

import { useProgress } from "@/lib/progress";
import { modules } from "@/lib/curriculum";

const orderedModules = [...modules].sort((a, b) => a.order - b.order);

/** A row of lesson dots for the visitor's next incomplete module — filled dots for done lessons, hollow for the rest, one dot mid-fill via CSS animation on hover to suggest "in progress" without a loop running unattended. Falls back to generic copy for first-time visitors with zero progress. */
export function AcademyMiniCard() {
  const { moduleProgress, state } = useProgress();
  const hasProgress = state.completedLessons.length > 0;

  const nextModule = orderedModules.find((mod) => {
    const { done, total } = moduleProgress(mod.slug);
    return total > 0 && done < total;
  });

  if (!hasProgress || !nextModule) {
    return (
      <p className="font-mono text-[10px] uppercase tracking-widest text-pitch-touchline/70">
        9 modules, start anywhere →
      </p>
    );
  }

  const { done, total } = moduleProgress(nextModule.slug);

  return (
    <div className="flex flex-col gap-1.5">
      <p className="font-mono text-[10px] uppercase tracking-widest text-defend-bright">
        {nextModule.title} · {total - done} left
      </p>
      <div className="flex gap-1">
        {nextModule.lessons.map((lesson, i) => (
          <span
            key={lesson.slug}
            className={`academy-mini-dot h-1.5 w-4 rounded-full ${i < done ? "bg-defend-bright" : "bg-pitch-touchline/25"}`}
            style={{ "--dot-index": i } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}
