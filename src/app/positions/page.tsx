import type { Metadata } from "next";
import Link from "next/link";
import { positions } from "@/lib/positions";
import { POSITION_TO_GROUP, positionGroupLabels, type PositionGroup } from "@/lib/workouts";
import { ChalkDivider } from "@/components/effects/ChalkDivider";

export const metadata: Metadata = {
  title: "Positions · PitchStudy",
  description:
    "Every position on the pitch — what each role does in and out of possession, plus the tactical variations teams play within it.",
};

const GROUPS: PositionGroup[] = ["goalkeepers", "defenders", "midfielders", "attackers"];

export default function PositionsIndexPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-4 py-10 sm:px-8 sm:py-16">
      <header className="flex flex-col gap-3">
        <h1 className="font-display text-4xl font-black uppercase leading-none tracking-tight text-pitch-line sm:text-6xl">
          Every role on the pitch.
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-pitch-touchline sm:text-lg">
          What each position actually does, in and out of possession — plus the tactical
          variations teams play within it.
        </p>
      </header>

      <ChalkDivider />

      {GROUPS.map((group) => {
        const entries = Object.values(positions).filter((position) => POSITION_TO_GROUP[position.code] === group);
        if (entries.length === 0) return null;

        return (
          <section key={group} className="flex flex-col gap-4">
            <h2 className="font-mono text-xs uppercase tracking-widest text-pitch-marker">
              {positionGroupLabels[group]}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {entries.map((position) => (
                <Link
                  key={position.code}
                  href={`/positions/${position.code.toLowerCase()}`}
                  className="group flex flex-col gap-2 rounded-lg border border-pitch-touchline/30 bg-pitch-card p-5 transition-colors hover:border-pitch-marker focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs uppercase tracking-widest text-pitch-touchline">
                      {position.code}
                    </span>
                    {position.isHybrid && (
                      <span className="rounded-full border border-pitch-touchline/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-pitch-touchline">
                        Variation
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-xl font-bold uppercase tracking-tight text-pitch-line group-hover:text-pitch-marker">
                    {position.name}
                  </h3>
                  <p className="line-clamp-2 text-sm leading-relaxed text-pitch-touchline">{position.summary}</p>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
