import type { FormationPlayer, Phase } from "./formations";
import { getPosition } from "./positions";

const MAX_MATCHUPS = 2;
/** Pitch-percent points — a second opponent counts as a matchup only if nearly as close as the first. */
const NEAR_TIE_THRESHOLD = 6;

/** Attacking roles — used only to describe an opponent as having dropped deep to contest a matchup. */
const ADVANCED_ROLES = new Set(["ST", "CAM", "LW", "RW", "F9"]);

/**
 * Finds the nearest opposing player(s) to a given player by straight-line
 * pitch distance. Usually returns one — a second is included only when it's
 * nearly as close as the first, representing genuine zonal overlap (e.g. two
 * strikers both sitting closest to a single center-back).
 */
export function findMatchups(player: FormationPlayer, opponents: FormationPlayer[]): FormationPlayer[] {
  if (opponents.length === 0) return [];
  const ranked = opponents
    .map((opponent) => ({
      opponent,
      distance: Math.hypot(player.x - opponent.x, player.y - opponent.y),
    }))
    .sort((a, b) => a.distance - b.distance);

  const [closest, runnerUp] = ranked;
  const matches = [closest.opponent];
  if (runnerUp && runnerUp.distance - closest.distance <= NEAR_TIE_THRESHOLD) {
    matches.push(runnerUp.opponent);
  }
  return matches.slice(0, MAX_MATCHUPS);
}

/**
 * Plain-language matchup line for the position breakdown panel, e.g.
 * "In a 4-3-3 vs 4-4-2, the CDM likely battles the opposing ST, dropping in
 * to help defend." The "dropping in" qualifier only appears when it's
 * actually true of the current phase — an advanced opponent role shown in
 * their out-of-possession (dropped-back) shape.
 */
export function describeMatchup({
  formationName,
  opponentFormationName,
  playerCode,
  opponents,
  opponentPhase,
}: {
  formationName: string;
  opponentFormationName: string;
  playerCode: string;
  opponents: FormationPlayer[];
  opponentPhase: Phase;
}): string | null {
  if (opponents.length === 0) return null;

  const position = getPosition(playerCode);
  const opponentNames = [
    ...new Set(opponents.map((opponent) => getPosition(opponent.code)?.name ?? opponent.code)),
  ];
  const opponentLabel =
    opponentNames.length > 1
      ? `${opponentNames.slice(0, -1).join(", ")} and ${opponentNames[opponentNames.length - 1]}`
      : opponentNames[0];

  const soleAdvancedDropping =
    opponents.length === 1 &&
    opponentPhase === "out-of-possession" &&
    ADVANCED_ROLES.has(opponents[0].code);
  const qualifier = soleAdvancedDropping ? ", dropping in to help defend" : "";

  return `In a ${formationName} vs ${opponentFormationName}, the ${position?.name ?? playerCode} likely battles the opposing ${opponentLabel}${qualifier}.`;
}
