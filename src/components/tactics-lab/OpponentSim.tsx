import { formations, type FormationPlayer } from "@/lib/formations";
import type { LabPlayer } from "@/lib/tactics-lab/designSchema";
import { computeMatchupNotes } from "@/lib/tactics-lab/opponentSim";
import { AutoNotes } from "./AutoNotes";

type Props = {
  myPlayers: LabPlayer[];
  opponentSlug: string | undefined;
  opponentPlayers: FormationPlayer[] | undefined;
  onOpponentSlugChange: (slug: string | undefined) => void;
};

/** Opponent formation picker plus the deterministic matchup notes it produces once selected — the "how does my shape actually hold up" check the engine's own notes can't answer alone. */
export function OpponentSim({ myPlayers, opponentSlug, opponentPlayers, onOpponentSlugChange }: Props) {
  const notes = opponentPlayers ? computeMatchupNotes(myPlayers, opponentPlayers) : [];

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-pitch-touchline/30 bg-pitch-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-xs uppercase tracking-widest text-pitch-marker">Opponent Sim</p>
        <label className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-pitch-touchline">
          <select
            value={opponentSlug ?? ""}
            onChange={(event) => onOpponentSlugChange(event.target.value === "" ? undefined : event.target.value)}
            className="min-h-9 rounded-md border border-pitch-touchline/40 bg-pitch-card px-2 font-mono text-xs uppercase tracking-widest text-pitch-line focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
          >
            <option value="">None</option>
            {formations.map((formation) => (
              <option key={formation.slug} value={formation.slug}>
                {formation.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {opponentPlayers ? (
        <AutoNotes notes={notes} />
      ) : (
        <p className="text-xs leading-relaxed text-pitch-touchline">
          Pick an opponent formation to see it overlaid on the pitch (dashed blue) and get matchup notes on numerical overloads and space to exploit.
        </p>
      )}
    </div>
  );
}
