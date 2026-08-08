import { describe, expect, it } from "vitest";
import { segmentProse } from "./glossaryMatch";
import { glossary } from "./glossary";

function terms(text: string): string[] {
  return segmentProse(text)
    .filter((segment) => segment.kind === "term")
    .map((segment) => segment.text);
}

function rebuild(text: string): string {
  return segmentProse(text)
    .map((segment) => segment.text)
    .join("");
}

describe("segmentProse", () => {
  it("never loses or duplicates text", () => {
    const samples = [
      "The low block sits deep and invites pressure.",
      "half-space",
      "",
      "No tactical vocabulary at all in this one.",
      "Ends on a term: gegenpress",
      "gegenpress starts it",
    ];
    for (const sample of samples) {
      expect(rebuild(sample)).toBe(sample);
    }
  });

  it("links a known term", () => {
    expect(terms("They defend in a low block.")).toEqual(["low block"]);
  });

  it("links each entry only once per block", () => {
    expect(terms("An overload here, an overload there, and a third overload.")).toEqual(["overload"]);
  });

  it("resolves aliases to the same entry, so an alias does not re-link the term", () => {
    // "gegenpressing" and "counter-press" are both aliases of `gegenpress`.
    expect(terms("Gegenpressing is the idea; the counter-press is the act.")).toEqual(["Gegenpressing"]);
  });

  it("preserves the casing found in the prose", () => {
    expect(terms("Low block early, low block late.")).toEqual(["Low block"]);
  });

  it("prefers the longest matching form", () => {
    // "high block" must win over nothing, and "half-space" over a bare "half".
    expect(terms("A high block squeezes the pitch.")).toEqual(["high block"]);
  });

  it("does not match inside a larger word", () => {
    expect(terms("The overlapping run")).toEqual(["overlapping"]);
    expect(terms("unoverloaded")).toEqual([]);
    expect(terms("half-spaces")).toEqual(["half-spaces"]);
  });

  it("does not link terms flagged ambiguous with everyday English", () => {
    expect(terms("They played with real width down both flanks.")).toEqual([]);
    expect(terms("A quick transition and a tight pocket of space.")).toEqual([]);
  });

  it("is case-insensitive on entry but keeps entries distinct", () => {
    const segments = segmentProse("A LOW BLOCK and a mid block.");
    const ids = segments.filter((s) => s.kind === "term").map((s) => s.entry.id);
    expect(ids).toEqual(["low-block", "mid-block"]);
  });
});

describe("glossary data", () => {
  it("has unique ids", () => {
    const ids = glossary.map((entry) => entry.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has no surface form claimed by two entries", () => {
    const forms = glossary.flatMap((entry) => [entry.term, ...(entry.aliases ?? [])].map((f) => f.toLowerCase()));
    expect(new Set(forms).size).toBe(forms.length);
  });

  it("defines every term in one sentence a beginner can read", () => {
    for (const entry of glossary) {
      expect(entry.definition.length).toBeGreaterThan(30);
      expect(entry.definition.length).toBeLessThan(220);
      expect(entry.definition.endsWith(".")).toBe(true);
    }
  });
});
