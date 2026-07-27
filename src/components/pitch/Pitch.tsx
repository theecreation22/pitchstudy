import Link from "next/link";
import type { FormationPlayer } from "@/lib/formations";
import { getPosition } from "@/lib/positions";
import { PitchMarkings } from "./PitchMarkings";

type Props = {
  players: FormationPlayer[];
  formationName: string;
};

export function Pitch({ players, formationName }: Props) {
  return (
    <div className="rounded-xl border-2 border-pitch-touchline/25 bg-pitch-deep p-2 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.7)] sm:p-3">
      <div className="relative w-full aspect-[68/105] select-none">
        <PitchMarkings />

        <ul
          className="absolute inset-0"
          role="list"
          aria-label={`${formationName} formation — click a position to learn about it`}
        >
          {players.map((player) => {
            const position = getPosition(player.code);
            return (
              <li
                key={player.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 transition-[left,top] duration-500 ease-out"
                style={{ left: `${player.x}%`, top: `${player.y}%` }}
              >
                <Link
                  href={`/positions/${player.code.toLowerCase()}`}
                  aria-label={`${position?.name ?? player.code} — view position guide`}
                  className="group flex h-11 w-11 items-center justify-center rounded-full border-2 border-pitch-line/20 bg-pitch-card font-mono text-xs font-semibold text-pitch-line shadow-[0_2px_6px_rgba(0,0,0,0.5)] transition-colors hover:border-pitch-marker hover:bg-pitch-marker hover:text-pitch-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
                >
                  {player.code}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
