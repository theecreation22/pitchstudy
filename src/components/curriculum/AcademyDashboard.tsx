"use client";

import Link from "next/link";
import { badges, useProgress } from "@/lib/progress";
import { moduleAccentColor, totalLessonCount, type Module } from "@/lib/curriculum";
import { ModuleIcon } from "./ModuleIcon";
import { ProgressRing } from "./ProgressRing";

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
          const isComplete = hasContent && done === total;
          const accentColor = moduleAccentColor[module.accent];

          const card = (
            <div
              className={`relative flex h-full flex-col gap-3 rounded-lg border bg-pitch-card p-6 ${
                isComplete ? "border-attack shadow-[0_0_24px_-6px_var(--attack)]" : "border-pitch-touchline/30"
              }`}
            >
              {!hasContent && (
                <span
                  title={`Content coming soon for ${module.title}`}
                  className="absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-full border border-pitch-touchline/40 text-xs text-pitch-touchline"
                  aria-label={`Locked — content coming soon for ${module.title}`}
                >
                  🔒
                </span>
              )}

              <div className="flex items-center gap-3">
                <ProgressRing value={hasContent ? done / total : 0} color={accentColor} label={module.order} />
                <div className="flex flex-col gap-1">
                  <span className="flex items-center gap-1.5" style={{ color: accentColor }}>
                    <ModuleIcon slug={module.slug} color={accentColor} />
                    <span className="font-mono text-xs uppercase tracking-widest">Module {module.order}</span>
                  </span>
                  <h2 className="font-display text-xl font-bold uppercase tracking-tight text-pitch-line">
                    {module.title}
                  </h2>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-pitch-touchline">{module.description}</p>

              <div className="mt-auto flex items-center gap-3 pt-2">
                {hasContent ? (
                  <>
                    <div className="flex gap-1">
                      {Array.from({ length: total }, (_, index) => (
                        <span
                          key={index}
                          className="h-2 w-2 rounded-full"
                          style={{
                            background: index < done ? accentColor : "var(--night-800)",
                          }}
                        />
                      ))}
                    </div>
                    <p className="font-mono text-xs text-pitch-touchline">
                      {done} / {total} lessons
                    </p>
                  </>
                ) : (
                  <p className="font-mono text-xs uppercase tracking-widest text-pitch-touchline">
                    Coming soon
                  </p>
                )}
              </div>
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
