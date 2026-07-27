import Link from "next/link";
import type { Phase } from "@/lib/formations";
import type { PositionInfo } from "@/lib/positions";

type Props = {
  position: PositionInfo;
  phase: Phase;
  matchupText: string;
  onClear: () => void;
};

/** Shown in place of the formation notes aside once a player is selected under the opponent overlay. */
export function PositionBreakdownPanel({ position, phase, matchupText, onClear }: Props) {
  const phaseBlurb = phase === "in-possession" ? position.inPossession : position.outOfPossession;

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-pitch-marker">
            Position breakdown
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-pitch-line">
            {position.name}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="shrink-0 rounded-full border border-pitch-touchline/40 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-pitch-touchline transition-colors hover:border-pitch-touchline hover:text-pitch-line focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
        >
          Clear
        </button>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-pitch-line/90">{phaseBlurb}</p>

      <h3 className="mt-5 text-xs font-semibold uppercase tracking-wide text-pitch-touchline">
        Matchup
      </h3>
      <p className="mt-1 flex gap-2 text-sm leading-relaxed text-pitch-line/90">
        <span aria-hidden="true" className="text-press">
          ⚔
        </span>
        {matchupText}
      </p>

      <Link
        href={`/positions/${position.code.toLowerCase()}`}
        className="mt-5 inline-flex min-h-11 w-fit items-center gap-2 rounded-full border border-pitch-marker px-4 font-mono text-xs uppercase tracking-widest text-pitch-marker transition-colors hover:bg-pitch-marker/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
      >
        View full position guide →
      </Link>
    </div>
  );
}
