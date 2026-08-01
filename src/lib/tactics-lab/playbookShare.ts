import type { Instructions, LabPlayer } from "./designSchema";
import type { PlayStep } from "./playSchema";

/**
 * Share encoding for designer-origin Playbook entries (formations and
 * freeform plays) — scenario-origin entries reuse the existing
 * `encodeSharedPlay`/`?play=` mechanism in scenario-mode/persistence.ts
 * unchanged, since that already works and this isn't replacing it.
 */
export type SharedBoard =
  | { kind: "formation"; name: string; players: LabPlayer[]; instructions: Instructions }
  | { kind: "play"; name: string; players: LabPlayer[]; instructions: Instructions; steps: PlayStep[] };

export function encodeSharedBoard(board: SharedBoard): string {
  return encodeURIComponent(JSON.stringify(board));
}

export function decodeSharedBoard(encoded: string): SharedBoard | null {
  try {
    const parsed = JSON.parse(decodeURIComponent(encoded)) as Partial<SharedBoard>;
    if (!Array.isArray(parsed.players) || typeof parsed.name !== "string" || !parsed.instructions) return null;
    if (parsed.kind === "play" && Array.isArray(parsed.steps)) {
      return { kind: "play", name: parsed.name, players: parsed.players, instructions: parsed.instructions, steps: parsed.steps };
    }
    return { kind: "formation", name: parsed.name, players: parsed.players, instructions: parsed.instructions };
  } catch {
    return null;
  }
}
