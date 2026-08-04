import type { Scenario, ScenarioFamily } from "@/lib/scenario-mode/schema";

const FAMILY_LABEL: Record<ScenarioFamily, string> = {
  "set-piece": "Set-Pieces",
  "counter-attack": "Counter-Attacks",
  "build-up": "Build-Up",
  "low-block": "Breaking a Low Block",
  "wide-play": "Wide Play",
};

/** A distinct accent per family so the library reads as organized rather than a flat grid — colors drawn from the existing chalk palette, no new tokens. */
const FAMILY_ACCENT: Record<ScenarioFamily, string> = {
  "set-piece": "border-attack/40 hover:border-attack",
  "counter-attack": "border-press/40 hover:border-press",
  "build-up": "border-defend/40 hover:border-defend",
  "low-block": "border-pitch-marker/40 hover:border-pitch-marker",
  "wide-play": "border-attack/40 hover:border-attack",
};

type Props = { scenarios: Scenario[]; onSelect: (slug: string) => void };

export function ScenarioPicker({ scenarios, onSelect }: Props) {
  const families = Array.from(new Set(scenarios.map((s) => s.family)));

  return (
    <div className="flex flex-col gap-6">
      {families.map((family) => (
        <div key={family} className="flex flex-col gap-3">
          <p className="font-mono text-xs uppercase tracking-widest text-pitch-marker">{FAMILY_LABEL[family]}</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {scenarios
              .filter((s) => s.family === family)
              .map((scenario) => (
                <button
                  key={scenario.slug}
                  type="button"
                  onClick={() => onSelect(scenario.slug)}
                  className={`flex flex-col gap-2 rounded-lg border-2 bg-pitch-card p-4 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker ${FAMILY_ACCENT[family]}`}
                >
                  <div className="relative aspect-[68/105] w-full max-w-[7rem] rounded-md border border-pitch-touchline/30 bg-pitch-deep">
                    {scenario.stage.players.map((player) => (
                      <div
                        key={player.id}
                        className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-attack"
                        style={{ left: `${player.start.x}%`, top: `${player.start.y}%` }}
                      />
                    ))}
                    {scenario.stage.opponents.map((opponent) => (
                      <div
                        key={opponent.id}
                        className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-sm bg-press"
                        style={{ left: `${opponent.start.x}%`, top: `${opponent.start.y}%` }}
                      />
                    ))}
                  </div>
                  <p className="font-display text-lg font-bold uppercase tracking-tight text-pitch-line">{scenario.name}</p>
                  <p className="text-xs leading-relaxed text-pitch-touchline">{scenario.brief}</p>
                </button>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
