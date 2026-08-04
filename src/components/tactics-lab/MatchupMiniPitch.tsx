import type { MatchupZone } from "@/lib/tactics-lab/opponentSim";

const ZONE_STYLE: Record<MatchupZone["severity"], string> = {
  overload: "bg-attack/15 border-attack/40",
  hole: "bg-press/15 border-press/40",
  even: "bg-transparent border-transparent",
};

const ZONE_TEXT: Record<MatchupZone["severity"], string> = {
  overload: "text-attack",
  hole: "text-press",
  even: "text-pitch-touchline",
};

/**
 * A compact chalk-styled pitch split into the same left/center/right
 * channels `computeMatchupZones` counts — tinted amber where the user
 * outnumbers the opponent, red where the opponent does, so the overload/hole
 * reads spatially instead of as a bare sentence. Purely decorative (aria-hidden);
 * the adjacent verdict line carries the same information in words.
 */
export function MatchupMiniPitch({ zones }: { zones: MatchupZone[] }) {
  return (
    <div
      aria-hidden="true"
      className="relative flex h-20 overflow-hidden rounded-sm border border-pitch-touchline/25 bg-pitch-deep"
    >
      <svg viewBox="0 0 3 2" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full opacity-40">
        <line x1="1" y1="0" x2="1" y2="2" stroke="var(--pitch-line)" strokeWidth="0.012" />
        <line x1="2" y1="0" x2="2" y2="2" stroke="var(--pitch-line)" strokeWidth="0.012" />
        <line x1="0" y1="1" x2="3" y2="1" stroke="var(--pitch-line)" strokeWidth="0.012" />
        <circle cx="1.5" cy="1" r="0.35" fill="none" stroke="var(--pitch-line)" strokeWidth="0.012" />
      </svg>

      {zones.map((zone) => (
        <div
          key={zone.channel}
          className={`flex flex-1 flex-col items-center justify-center gap-0.5 border-x transition-colors first:border-l-0 last:border-r-0 ${ZONE_STYLE[zone.severity]}`}
        >
          <span className={`font-mono text-sm font-bold ${ZONE_TEXT[zone.severity]}`}>
            {zone.mine}v{zone.theirs}
          </span>
          <span className="font-mono text-[9px] uppercase tracking-widest text-pitch-touchline">{zone.channel}</span>
        </div>
      ))}
    </div>
  );
}
