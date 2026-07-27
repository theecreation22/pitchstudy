import type { Formation } from "@/lib/formations";

type Props = {
  formations: Formation[];
  selectedSlug: string;
  onSelect: (slug: string) => void;
};

/** A compact secondary dropdown for the opponent's formation — deliberately smaller than the main FormationSelector so it never competes with it. */
export function OpponentFormationSelect({ formations, selectedSlug, onSelect }: Props) {
  return (
    <label className="inline-flex min-h-11 items-center gap-2 rounded-full border border-defend/40 bg-pitch-card px-3">
      <span className="font-mono text-[10px] uppercase tracking-widest text-defend-bright">
        Opponent
      </span>
      <select
        value={selectedSlug}
        onChange={(event) => onSelect(event.target.value)}
        aria-label="Choose the opponent's formation"
        className="bg-transparent font-mono text-xs uppercase tracking-widest text-pitch-line"
      >
        {formations.map((formation) => (
          <option key={formation.slug} value={formation.slug} className="bg-pitch-card text-pitch-line">
            {formation.name}
          </option>
        ))}
      </select>
    </label>
  );
}
