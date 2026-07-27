import type { Formation } from "@/lib/formations";

type Props = {
  formations: Formation[];
  selectedSlug: string;
  onSelect: (slug: string) => void;
};

export function FormationSelector({ formations, selectedSlug, onSelect }: Props) {
  return (
    <div role="group" aria-label="Choose a formation" className="flex flex-wrap gap-2">
      {formations.map((formation) => {
        const isSelected = formation.slug === selectedSlug;
        return (
          <button
            key={formation.slug}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onSelect(formation.slug)}
            className={`rounded-md border-2 px-4 py-2 font-display text-lg font-bold tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker ${
              isSelected
                ? "border-pitch-marker bg-pitch-marker text-pitch-deep"
                : "border-pitch-touchline/50 text-pitch-touchline hover:border-pitch-touchline hover:text-pitch-line"
            }`}
          >
            {formation.name}
          </button>
        );
      })}
    </div>
  );
}
