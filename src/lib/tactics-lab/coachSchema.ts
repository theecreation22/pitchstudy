import type { Design } from "./designSchema";

export type CoachVerdict = {
  grade: string;
  summary: string;
  strengths: string[];
  vulnerabilities: string[];
  opponentPlan: string;
  oneTweak: string;
};

/** What's actually renderable at any point mid-stream — every field optional except the two arrays, which just start empty. */
export type PartialCoachVerdict = Partial<Omit<CoachVerdict, "strengths" | "vulnerabilities">> & {
  strengths: string[];
  vulnerabilities: string[];
};

export function emptyVerdict(): PartialCoachVerdict {
  return { strengths: [], vulnerabilities: [] };
}

/**
 * The wire format between the coach route and the client: one field per
 * line, tagged, rather than a single JSON blob. A streamed JSON object
 * needs bracket-matching to know when any field is "safe" to render, which
 * is exactly the kind of incremental-parser fragility this format avoids —
 * each line is independently complete and can be rendered the moment its
 * newline arrives. The route always emits exactly these tags, in this
 * order, terminated by a bare END line.
 */
const LINE_TAG_RE = /^([A-Z_]+):\s?(.*)$/;

/**
 * Parses whatever of the tagged wire format has arrived so far. Re-parses
 * the full buffer every call rather than tracking incremental state — with
 * only ~7 short lines total this is cheap, and it keeps the parser
 * stateless and trivially safe to call on every stream chunk. Pass
 * `isFinal: true` once the stream has actually ended so the last line (which
 * might otherwise still be mid-flight) is accepted too.
 */
export function parseVerdictStream(buffer: string, isFinal = false): PartialCoachVerdict {
  const verdict = emptyVerdict();
  const lines = buffer.split("\n");
  const completeLines = isFinal ? lines : lines.slice(0, -1);

  for (const rawLine of completeLines) {
    const line = rawLine.trim();
    if (!line) continue;
    const match = line.match(LINE_TAG_RE);
    if (!match) continue;
    const [, tag, value] = match;
    switch (tag) {
      case "GRADE":
        verdict.grade = value;
        break;
      case "SUMMARY":
        verdict.summary = value;
        break;
      case "STRENGTH":
        verdict.strengths.push(value);
        break;
      case "VULNERABILITY":
        verdict.vulnerabilities.push(value);
        break;
      case "OPPONENT_PLAN":
        verdict.opponentPlan = value;
        break;
      case "ONE_TWEAK":
        verdict.oneTweak = value;
        break;
      default:
        break; // END or anything unrecognized — ignored, not an error
    }
  }

  return verdict;
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b));
    return `{${entries.map(([k, v]) => `${k}:${stableStringify(v)}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

/**
 * A short, stable, non-cryptographic hash (djb2 variant) of a design, used
 * purely as a client-side cache key so re-clicking "send to the coaching
 * staff" on an unchanged design shows the cached verdict instead of
 * re-billing an identical request.
 */
export function hashDesign(design: Design): string {
  const str = stableStringify(design);
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return (hash >>> 0).toString(36);
}
