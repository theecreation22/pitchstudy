"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useProgress } from "@/lib/progress";
import type { Lesson, Module } from "@/lib/curriculum";

type Props = {
  module: Module;
  lesson: Lesson;
  nextLesson: Lesson | null;
};

export function LessonCompletion({ module, lesson, nextLesson }: Props) {
  const { completeLesson, isLessonComplete } = useProgress();
  const [justCompleted, setJustCompleted] = useState(false);
  const done = isLessonComplete(module.slug, lesson.slug);

  function handleComplete() {
    completeLesson(module.slug, lesson.slug);
    setJustCompleted(true);
  }

  return (
    <div className="flex flex-col items-start gap-4 rounded-lg border border-gold-flood/40 bg-pitch-card p-6">
      <AnimatePresence>
        {justCompleted && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="font-display text-sm font-bold uppercase tracking-wide text-gold-flood"
          >
            +50 XP: Full Time!
          </motion.p>
        )}
      </AnimatePresence>

      {!done ? (
        <button
          type="button"
          onClick={handleComplete}
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-gold-flood px-6 font-display text-base font-bold text-night-950 transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-line"
        >
          Full Time: mark complete
        </button>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-widest text-gold-flood">
            ✓ Completed
          </span>
          {nextLesson ? (
            <Link
              href={`/academy/${module.slug}/${nextLesson.slug}`}
              className="inline-flex min-h-11 items-center justify-center rounded-md border-2 border-gold-flood px-4 font-mono text-xs uppercase tracking-widest text-gold-flood transition-colors hover:bg-gold-flood/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
            >
              Next lesson →
            </Link>
          ) : (
            <Link
              href={`/academy/${module.slug}/quiz`}
              className="inline-flex min-h-11 items-center justify-center rounded-md border-2 border-gold-flood px-4 font-mono text-xs uppercase tracking-widest text-gold-flood transition-colors hover:bg-gold-flood/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
            >
              Take the module quiz →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
