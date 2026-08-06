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
  | {
      kind: "play";
      name: string;
      players: LabPlayer[];
      instructions: Instructions;
      steps: PlayStep[];
      /** Absent means the neutral default kick-off spot — links shared before ball placement existed decode to exactly what they always did. */
      ballStart?: { x: number; y: number };
    };

export function encodeSharedBoard(board: SharedBoard): string {
  return encodeURIComponent(JSON.stringify(board));
}

/** A share link is untrusted input, so a malformed kick-off spot degrades to the default rather than feeding NaN coordinates into the board. */
export function parseBallStart(value: unknown): { x: number; y: number } | undefined {
  if (!value || typeof value !== "object") return undefined;
  const { x, y } = value as { x?: unknown; y?: unknown };
  if (typeof x !== "number" || typeof y !== "number" || !Number.isFinite(x) || !Number.isFinite(y)) return undefined;
  return { x, y };
}

export function decodeSharedBoard(encoded: string): SharedBoard | null {
  try {
    const parsed = JSON.parse(decodeURIComponent(encoded)) as Partial<SharedBoard>;
    if (!Array.isArray(parsed.players) || typeof parsed.name !== "string" || !parsed.instructions) return null;
    if (parsed.kind === "play" && Array.isArray(parsed.steps)) {
      return {
        kind: "play",
        name: parsed.name,
        players: parsed.players,
        instructions: parsed.instructions,
        steps: parsed.steps,
        ballStart: parseBallStart(parsed.ballStart),
      };
    }
    return { kind: "formation", name: parsed.name, players: parsed.players, instructions: parsed.instructions };
  } catch {
    return null;
  }
}
