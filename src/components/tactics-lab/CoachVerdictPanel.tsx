"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLocalStorageValue } from "@/lib/useLocalStorageValue";
import type { Design } from "@/lib/tactics-lab/designSchema";
import { emptyVerdict, hashDesign, parseVerdictStream, type PartialCoachVerdict } from "@/lib/tactics-lab/coachSchema";

const CACHE_KEY = "pitchiq:tactics-lab:coach-cache:v1";
/** Caps the cache so it can't grow unbounded across a long session — oldest entries drop first. */
const MAX_CACHE_ENTRIES = 20;

type CacheMap = Record<string, PartialCoachVerdict>;

function parseCache(raw: string | null): CacheMap {
  if (!raw) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as CacheMap) : {};
  } catch {
    return {};
  }
}

type Status = "idle" | "loading" | "streaming" | "done" | "error";

const UNAVAILABLE_MESSAGE = "Coach verdict unavailable — running on the live analysis engine";
const UNREACHABLE_MESSAGE = "The coaching staff couldn't be reached — the live analysis engine above still stands.";

type Props = { design: Design; coachAvailable: boolean };

/** The optional, on-demand LLM layer. The deterministic engine above this panel is always live and free — this is purely an additional prose verdict, never a dependency the rest of the Lab needs. */
export function CoachVerdictPanel({ design, coachAvailable }: Props) {
  const reduceMotion = useReducedMotion();
  const [cacheRaw, setCacheRaw] = useLocalStorageValue(CACHE_KEY);
  const [status, setStatus] = useState<Status>("idle");
  const [verdict, setVerdict] = useState<PartialCoachVerdict>(emptyVerdict());
  const [errorMessage, setErrorMessage] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const designHash = hashDesign(design);
  const cache = parseCache(cacheRaw);

  async function requestVerdict() {
    if (status === "loading" || status === "streaming") return;

    const cached = cache[designHash];
    if (cached && cached.grade && cached.summary) {
      setVerdict(cached);
      setStatus("done");
      return;
    }

    setStatus("loading");
    setErrorMessage("");
    setVerdict(emptyVerdict());

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch("/api/tactics-lab/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ design }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        setErrorMessage(
          response.status === 429
            ? "Too many requests to the coaching staff — try again in a minute."
            : UNREACHABLE_MESSAGE,
        );
        setStatus("error");
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        setStatus("streaming");
        setVerdict(parseVerdictStream(buffer));
      }

      const finalVerdict = parseVerdictStream(buffer, true);

      // A well-formed response always has at least a grade and a summary —
      // if the model's output didn't match the expected format (or was cut
      // off before producing anything usable), don't cache an empty result
      // that would otherwise silently replay as a blank panel on every
      // future click for this exact design.
      if (!finalVerdict.grade || !finalVerdict.summary) {
        setErrorMessage(UNREACHABLE_MESSAGE);
        setStatus("error");
        return;
      }

      setVerdict(finalVerdict);
      setStatus("done");

      const entries = Object.entries({ ...cache, [designHash]: finalVerdict });
      const trimmedEntries = entries.length > MAX_CACHE_ENTRIES ? entries.slice(entries.length - MAX_CACHE_ENTRIES) : entries;
      setCacheRaw(JSON.stringify(Object.fromEntries(trimmedEntries)));
    } catch {
      if (controller.signal.aborted) return;
      setErrorMessage(UNREACHABLE_MESSAGE);
      setStatus("error");
    }
  }

  if (!coachAvailable) {
    return (
      <div className="flex flex-col gap-2 rounded-lg border border-pitch-touchline/20 bg-pitch-card/60 p-4">
        <p className="font-mono text-xs uppercase tracking-widest text-pitch-touchline">Coaching staff</p>
        <button
          type="button"
          disabled
          className="min-h-11 cursor-not-allowed rounded-md border border-pitch-touchline/30 px-4 text-left font-mono text-xs uppercase tracking-widest text-pitch-touchline/60"
        >
          {UNAVAILABLE_MESSAGE}
        </button>
      </div>
    );
  }

  const isBusy = status === "loading" || status === "streaming";

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-pitch-touchline/30 bg-pitch-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-xs uppercase tracking-widest text-pitch-marker">Coaching staff</p>
        <button
          type="button"
          onClick={requestVerdict}
          disabled={isBusy}
          className="min-h-11 rounded-md border border-attack px-4 font-mono text-xs uppercase tracking-widest text-attack transition-colors hover:bg-attack/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isBusy ? "Reviewing…" : status === "done" ? "Send again" : "Send to the coaching staff"}
        </button>
      </div>

      {status === "loading" && <p className="text-sm italic text-pitch-touchline">The staff are reviewing your setup…</p>}

      {status === "error" && <p className="text-sm leading-relaxed text-press">{errorMessage}</p>}

      {(status === "streaming" || status === "done") && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.3 }}
          className="flex flex-col gap-3"
        >
          {verdict.grade && (
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-pitch-touchline">Grade</span>
              <span className="font-display text-2xl font-black text-pitch-line">{verdict.grade}</span>
            </div>
          )}

          {verdict.summary && <p className="text-sm leading-relaxed text-pitch-line/90">{verdict.summary}</p>}

          {verdict.strengths.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-attack">Strengths</p>
              <ul className="flex flex-col gap-1.5">
                {verdict.strengths.map((strength) => (
                  <li key={strength} className="rounded-md border border-attack/30 bg-attack/10 px-3 py-2 text-sm text-pitch-line/90">
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {verdict.vulnerabilities.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-press">Vulnerabilities</p>
              <ul className="flex flex-col gap-1.5">
                {verdict.vulnerabilities.map((vulnerability) => (
                  <li key={vulnerability} className="rounded-md border border-press/30 bg-press/10 px-3 py-2 text-sm text-pitch-line/90">
                    {vulnerability}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {verdict.opponentPlan && (
            <div className="flex flex-col gap-1.5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-defend-bright">How a smart opponent attacks this</p>
              <p className="rounded-md border border-defend/30 bg-defend/10 px-3 py-2 text-sm text-pitch-line/90">{verdict.opponentPlan}</p>
            </div>
          )}

          {verdict.oneTweak && (
            <div className="flex flex-col gap-1.5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-pitch-marker">The one tweak</p>
              <p className="rounded-md border border-pitch-marker/40 bg-pitch-marker/10 px-3 py-2 text-sm font-semibold text-pitch-line">
                {verdict.oneTweak}
              </p>
            </div>
          )}
        </motion.div>
      )}

      <p className="text-[11px] leading-relaxed text-pitch-touchline/70">
        Coaching interpretation for learning — one read on this shape, not objective truth.
      </p>
    </div>
  );
}
