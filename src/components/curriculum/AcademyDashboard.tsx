"use client";

import Link from "next/link";
import { badges, useProgress } from "@/lib/progress";
import { moduleAccentColor, totalLessonCount, type Module } from "@/lib/curriculum";

export function AcademyDashboard({ modules }: { modules: Module[] }) {
  const { state, moduleProgress } = useProgress();
  const totalLessons = totalLessonCount();
  const completedModules = modules.filter((module) => {
    const { done, total } = moduleProgress(module.slug);
    return total > 0 && done === total;
  }).length;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center gap-8 rounded-lg border border-pitch-touchline/30 bg-pitch-card p-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-pitch-touchline">Total XP</p>
          <p className="font-display text-4xl font-black text-attack">{state.xp}</p>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-pitch-touchline">Modules complete</p>
          <p className="font-display text-4xl font-black text-pitch-line">
            {completedModules} / {modules.length}
          </p>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-pitch-touchline">Lessons complete</p>
          <p className="font-display text-4xl font-black text-pitch-line">
            {state.completedLessons.length} / {totalLessons}
          </p>
        </div>
        <div className="min-w-[220px] flex-1">
          <p className="font-mono text-xs uppercase tracking-widest text-pitch-touchline">Badges</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {badges.map((badge) => {
              const earned = state.earnedBadges.includes(badge.id);
              return (
                <span
                  key={badge.id}
                  title={badge.description}
                  className={`rounded-full border px-3 py-1 font-mono text-xs ${
                    earned
                      ? "border-attack bg-attack/10 text-attack"
                      : "border-defend/30 text-defend-bright/50"
                  }`}
                >
                  {badge.name}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {modules.map((module) => {
          const { done, total } = moduleProgress(module.slug);
          const hasContent = total > 0;
          const accentColor = moduleAccentColor[module.accent];

          const card = (
            <div
              className="flex h-full flex-col gap-3 rounded-lg border border-pitch-touchline/30 border-t-[3px] bg-pitch-card p-6"
              style={{ borderTopColor: accentColor }}
            >
              <p className="font-mono text-xs uppercase tracking-widest" style={{ color: accentColor }}>
                Module {module.order}
              </p>
              <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-pitch-line">
                {module.title}
              </h2>
              <p className="text-sm leading-relaxed text-pitch-touchline">{module.description}</p>
              {hasContent ? (
                <div className="mt-auto pt-2">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-pitch-slate">
                    <div
                      className="h-full rounded-full transition-[width] duration-500 ease-out"
                      style={{ width: `${(done / total) * 100}%`, background: accentColor }}
                    />
                  </div>
                  <p className="mt-1 font-mono text-xs text-pitch-touchline">
                    {done} / {total} lessons
                  </p>
                </div>
              ) : (
                <p className="mt-auto pt-2 font-mono text-xs uppercase tracking-widest text-pitch-touchline">
                  Coming soon
                </p>
              )}
            </div>
          );

          return hasContent ? (
            <Link
              key={module.slug}
              href={`/academy/${module.slug}`}
              className="rounded-lg transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
            >
              {card}
            </Link>
          ) : (
            <div key={module.slug} className="opacity-60">
              {card}
            </div>
          );
        })}
      </div>
    </div>
  );
}
