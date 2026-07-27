"use client";

import Link from "next/link";
import { useProgress } from "@/lib/progress";
import type { Module } from "@/lib/curriculum";

export function ModuleLessonList({ module }: { module: Module }) {
  const { isLessonComplete, moduleProgress } = useProgress();
  const { done, total } = moduleProgress(module.slug);
  const allDone = total > 0 && done === total;

  return (
    <div className="flex flex-col gap-3">
      {module.lessons.map((lesson, index) => {
        const complete = isLessonComplete(module.slug, lesson.slug);
        return (
          <Link
            key={lesson.slug}
            href={`/academy/${module.slug}/${lesson.slug}`}
            className="group flex items-center gap-4 rounded-lg border border-pitch-touchline/30 bg-pitch-card p-4 transition-colors hover:border-gold-flood focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
          >
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 font-mono text-xs font-semibold ${
                complete
                  ? "border-gold-flood bg-gold-flood/10 text-gold-flood"
                  : "border-pitch-touchline/50 text-pitch-touchline"
              }`}
            >
              {complete ? "✓" : index + 1}
            </span>
            <span className="flex-1">
              <span className="block font-display text-base font-bold uppercase tracking-tight text-pitch-line group-hover:text-gold-flood">
                {lesson.title}
              </span>
              <span className="block font-mono text-xs text-pitch-touchline">
                {lesson.estimatedMinutes} min
              </span>
            </span>
          </Link>
        );
      })}

      <Link
        href={`/academy/${module.slug}/quiz`}
        className="group flex items-center gap-4 rounded-lg border border-dashed border-pitch-touchline/40 bg-pitch-card/50 p-4 transition-colors hover:border-blue-volt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-blue-volt/60 text-blue-volt">
          {allDone ? "✓" : "🔒"}
        </span>
        <span className="flex-1">
          <span className="block font-display text-base font-bold uppercase tracking-tight text-pitch-line group-hover:text-blue-volt">
            Module quiz
          </span>
          <span className="block font-mono text-xs text-pitch-touchline">
            {allDone
              ? "Unlocked: take it anytime"
              : `${done} of ${total} lessons done. Take it anyway, or finish the module first`}
          </span>
        </span>
      </Link>
    </div>
  );
}
