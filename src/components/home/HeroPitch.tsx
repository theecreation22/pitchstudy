import { getFormation } from "@/lib/formations";
import { PitchMarkings } from "@/components/pitch/PitchMarkings";

/** Non-interactive preview of the real pitch explorer — a fixed 4-3-3, no links, no switching. */
export function HeroPitch() {
  const formation = getFormation("4-3-3");
  if (!formation) return null;

  return (
    <div className="telemetry-panel-lift rounded-xl border-2 border-pitch-touchline/25 bg-pitch-deep p-2 sm:p-3">
      <div className="relative w-full aspect-[68/105] select-none" aria-hidden="true">
        <PitchMarkings />

        {formation.players.map((player) => (
          <div
            key={player.id}
            className="absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-pitch-line/20 bg-pitch-card font-mono text-xs font-semibold text-pitch-line shadow-[0_2px_6px_rgba(34,56,74,0.3)]"
            style={{ left: `${player.x}%`, top: `${player.y}%` }}
          >
            {player.code}
          </div>
        ))}
      </div>
    </div>
  );
}
