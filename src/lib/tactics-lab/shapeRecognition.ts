import { formations, matchFormationPlayers, type FormationPlayer } from "@/lib/formations";
import type { LabPlayer } from "./designSchema";

/** Average per-player deviation (in pitch-percent units) below which a custom layout is close enough to call it a recognized formation rather than "Custom Shape". */
const MATCH_THRESHOLD = 12;

function toFormationPlayers(players: LabPlayer[]): FormationPlayer[] {
  return players.map((p) => ({ id: p.id, code: p.role, x: p.x, y: p.y }));
}

/** Matches a freely-placed 11-player layout against the 8 canonical formations via nearest-neighbor pairing, live-labeling the board the way Football Manager names your system as you drag players around. */
export function recognizeShape(players: LabPlayer[]): string {
  if (players.length !== 11) return "Custom Shape";

  const candidate = toFormationPlayers(players);
  let best: { name: string; avgDistance: number } | null = null;

  for (const formation of formations) {
    const pairs = matchFormationPlayers(candidate, formation.players);
    const avgDistance = pairs.reduce((sum, pair) => sum + Math.hypot(pair.from.x - pair.to.x, pair.from.y - pair.to.y), 0) / pairs.length;
    if (!best || avgDistance < best.avgDistance) best = { name: formation.name, avgDistance };
  }

  return best && best.avgDistance <= MATCH_THRESHOLD ? best.name : "Custom Shape";
}
