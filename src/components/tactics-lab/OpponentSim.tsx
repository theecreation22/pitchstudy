import { formations, type FormationPlayer } from "@/lib/formations";
import type { LabPlayer } from "@/lib/tactics-lab/designSchema";
import { computeMatchupZones, type MatchupZone } from "@/lib/tactics-lab/opponentSim";
import { PLAYBOOK_OPPONENT_PREFIX, type PlaybookFormationEntry } from "@/lib/tactics-lab/playbookSchema";
import { MatchupMiniPitch } from "./MatchupMiniPitch";

type Props = {
  myPlayers: LabPlayer[];
  opponentSlug: string | undefined;
  opponentPlayers: FormationPlayer[] | undefined;
  onOpponentSlugChange: (slug: string | undefined) => void;
  /** Saved formations from the Playbook (§6) — shown in their own group below the 8 presets, so you can test a play against a formation you designed yourself. */
  playbookFormations?: PlaybookFormationEntry[];
};

function describeZone(zone: MatchupZone): string {
  const label = zone.channel === "left" ? "Left flank" : zone.channel === "right" ? "Right flank" : "Central channel";
  if (zone.severity === "overload") return `${label} — ${zone.mine}v${zone.theirs} in your favor`;
  if (zone.severity === "hole") return `${label} — ${zone.theirs}v${zone.mine} in their favor`;
  return `${label} — even, ${zone.mine}v${zone.theirs}`;
}

type Verdict = { icon: string; tone: "good" | "warn" | "neutral"; zoneLabel?: string; sentence: string };

/** Coach-voiced read on the matchup — leads with a specific flank when the numbers actually favor one side, rather than a generic "no mismatch" line every time the same shape comes up. */
function buildVerdict(zones: MatchupZone[]): Verdict {
  const flankZones = zones.filter((z) => z.channel !== "center");
  const holes = flankZones.filter((z) => z.severity === "hole");
  const overloads = flankZones.filter((z) => z.severity === "overload");

  if (holes.length > 0) {
    const worst = holes.reduce((a, b) => (b.theirs - b.mine > a.theirs - a.mine ? b : a));
    return {
      icon: "!",
      tone: "warn",
      zoneLabel: describeZone(worst),
      sentence: "They can find a spare man there before you're set — tuck a body across early, or dare them to beat you somewhere else.",
    };
  }

  if (overloads.length > 0) {
    const best = overloads.reduce((a, b) => (b.mine - b.theirs > a.mine - a.theirs ? b : a));
    return {
      icon: "+",
      tone: "good",
      zoneLabel: describeZone(best),
      sentence: "Get the ball there quickly and make the extra man count before they can shuffle across.",
    };
  }

  return {
    icon: "=",
    tone: "neutral",
    sentence: "Evenly matched by the numbers — you'll win this with movement, not overloads.",
  };
}

const VERDICT_TEXT: Record<Verdict["tone"], string> = {
  good: "text-attack",
  warn: "text-press",
  neutral: "text-pitch-touchline",
};

/** Opponent formation picker plus a spatial read on the matchup once selected — a tinted mini-pitch and a coach-voiced verdict instead of a bare "no mismatch" sentence. */
export function OpponentSim({ myPlayers, opponentSlug, opponentPlayers, onOpponentSlugChange, playbookFormations = [] }: Props) {
  const zones = opponentPlayers ? computeMatchupZones(myPlayers, opponentPlayers) : [];
  const verdict = opponentPlayers ? buildVerdict(zones) : null;

  return (
    <div className="tactics-panel flex flex-col gap-3 rounded-sm border border-pitch-touchline/30 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-xs uppercase tracking-widest text-pitch-marker">Opponent Sim</p>
        <div className="relative">
          <select
            value={opponentSlug ?? ""}
            onChange={(event) => onOpponentSlugChange(event.target.value === "" ? undefined : event.target.value)}
            className="min-h-9 appearance-none rounded-sm border border-pitch-touchline/40 bg-pitch-card py-1 pl-3 pr-8 font-mono text-xs uppercase tracking-widest text-pitch-line transition-colors hover:border-attack/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
          >
            <option value="">None</option>
            <optgroup label="Presets">
              {formations.map((formation) => (
                <option key={formation.slug} value={formation.slug}>
                  {formation.name}
                </option>
              ))}
            </optgroup>
            {playbookFormations.length > 0 && (
              <optgroup label="My Playbook">
                {playbookFormations.map((entry) => (
                  <option key={entry.id} value={`${PLAYBOOK_OPPONENT_PREFIX}${entry.id}`}>
                    No. {entry.number} — {entry.name}
                  </option>
                ))}
              </optgroup>
            )}
          </select>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-pitch-touchline"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>

      {opponentPlayers && verdict ? (
        <div className="flex flex-col gap-2.5">
          <MatchupMiniPitch zones={zones} />
          <div className="flex gap-2 text-sm leading-relaxed">
            <span aria-hidden="true" className={`font-mono font-bold ${VERDICT_TEXT[verdict.tone]}`}>
              {verdict.icon}
            </span>
            <p className="text-pitch-line/90">
              {verdict.zoneLabel && <span className={`font-semibold ${VERDICT_TEXT[verdict.tone]}`}>{verdict.zoneLabel}. </span>}
              {verdict.sentence}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-xs leading-relaxed text-pitch-touchline">
          Pick an opponent formation to see it overlaid on the pitch (dashed blue) and get a spatial read on numerical overloads and space to exploit.
        </p>
      )}
    </div>
  );
}
