"use client";

import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { scenarios, getScenario } from "@/lib/scenario-mode/scenarios";
import { computeScenarioFrames, getCarrierId } from "@/lib/scenario-mode/simulation";
import { evaluateScenario, type ScenarioResult } from "@/lib/scenario-mode/evaluation";
import { decodeSharedPlay, encodeSharedPlay, usePlaybook } from "@/lib/scenario-mode/persistence";
import { useProgress } from "@/lib/progress";
import type { Constraint, DifficultyTier, Point, ScenarioActionKind, ScenarioStep } from "@/lib/scenario-mode/schema";
import { SegmentedTabs } from "@/components/ui/SegmentedTabs";
import { ScenarioPicker } from "./ScenarioPicker";
import { ScenarioStage } from "./ScenarioStage";
import { ScenarioTimeline } from "./ScenarioTimeline";
import { ScenarioOutcomePanel } from "./ScenarioOutcomePanel";

const STEP_INTERVAL_MS = 950;
const KIND_LABEL: Record<ScenarioActionKind, string> = { pass: "Pass", run: "Run", shot: "Shot" };
const GRADE_LABEL: Record<string, string> = { gold: "Gold", silver: "Silver", bronze: "Bronze" };
const TIER_OPTIONS = [
  { value: "bronze", label: "Bronze" },
  { value: "silver", label: "Silver" },
  { value: "gold", label: "Gold" },
] as const satisfies { value: DifficultyTier; label: string }[];

function describeConstraint(constraint: Constraint): string {
  if (constraint.kind === "maxPasses") return `At most ${constraint.value} passes.`;
  if (constraint.kind === "maxSteps") return `Complete it within ${constraint.value} steps.`;
  if (constraint.kind === "mustReachZone") return "The ball must reach the target zone.";
  return `At least ${constraint.value} decoy run(s).`;
}

export function ScenarioMode() {
  const reduceMotion = useReducedMotion();
  const { completeScenario } = useProgress();
  const { plays, savePlay, deletePlay } = usePlaybook();

  const [scenarioSlug, setScenarioSlug] = useState<string | null>(null);
  const [tier, setTier] = useState<DifficultyTier>("bronze");
  const [steps, setSteps] = useState<ScenarioStep[]>([]);
  const [redoStack, setRedoStack] = useState<ScenarioStep[]>([]);
  const [pendingActorId, setPendingActorId] = useState<string | null>(null);
  const [pendingKind, setPendingKind] = useState<ScenarioActionKind | null>(null);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackIndex, setPlaybackIndex] = useState(0);
  const [result, setResult] = useState<ScenarioResult | null>(null);
  const [isSharedReadOnly, setIsSharedReadOnly] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [shareStatus, setShareStatus] = useState<"idle" | "copied">("idle");

  // A shared play arrives as a one-time query param — read once on mount,
  // matching the rest of the codebase's client-only-read pattern rather than
  // wiring next/navigation's useSearchParams (which would need a Suspense
  // boundary threaded through the whole Tactics Lab tree for this one case).
  useEffect(() => {
    const encoded = new URLSearchParams(window.location.search).get("play");
    if (!encoded) return;
    const shared = decodeSharedPlay(encoded);
    if (!shared || !getScenario(shared.scenarioSlug)) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading a one-time URL param on mount, not derivable during render
    setScenarioSlug(shared.scenarioSlug);
    setTier(shared.tier);
    setSteps(shared.steps);
    setIsSharedReadOnly(true);
  }, []);

  const scenario = scenarioSlug ? getScenario(scenarioSlug) : undefined;

  const frames = useMemo(() => (scenario ? computeScenarioFrames(scenario, tier, steps) : []), [scenario, tier, steps]);
  const displayIndex = isPlaying ? playbackIndex : (previewIndex ?? Math.max(0, frames.length - 1));
  const frame = frames[displayIndex];
  const readOnly = isSharedReadOnly || isPlaying;

  // A new pass/shot always extends from the LATEST recorded state, not
  // whatever's being previewed via the timeline — the ball can only be
  // played by whoever is actually on it right now, never an arbitrary
  // player, matching the physical constraint of the real game.
  const latestFrame = frames[frames.length - 1];
  const carrierId = latestFrame ? getCarrierId(latestFrame) : null;
  const pendingActorHasBall = pendingActorId !== null && pendingActorId === carrierId;

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setTimeout(() => {
      if (playbackIndex >= frames.length - 1) {
        setIsPlaying(false);
        if (scenario) {
          const finalResult = evaluateScenario(scenario, tier, steps, frames);
          setResult(finalResult);
          if (finalResult.outcome === "GOAL" || finalResult.outcome === "CHANCE_CREATED") {
            const stepsUsed = steps.reduce((max, s) => Math.max(max, s.endStep ?? s.startStep + 1), 0);
            completeScenario(scenario.slug, scenario.family, tier, finalResult.grade ?? "bronze", stepsUsed, stepsUsed <= scenario.parSteps);
          }
        }
        return;
      }
      setPlaybackIndex((i) => i + 1);
    }, STEP_INTERVAL_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- scenario/tier/steps/frames are stable for the duration of a single playback run (the stage is read-only while isPlaying), so each re-run of this effect already sees the current values via the closure
  }, [isPlaying, playbackIndex, frames.length]);

  function resetPending() {
    setPendingActorId(null);
    setPendingKind(null);
  }

  function nextStartStep(): number {
    return steps.reduce((max, s) => Math.max(max, s.endStep ?? s.startStep + 1), 0);
  }

  function commitStep(step: ScenarioStep) {
    setSteps((prev) => [...prev, step]);
    setRedoStack([]);
    setPreviewIndex(null);
    setResult(null);
    resetPending();
  }

  function handleSelectPlayer(playerId: string) {
    // Re-checked here (not just at the Pass button itself) so a pass can
    // never commit for a player who isn't actually on the ball, regardless
    // of how `pendingKind` got set to "pass".
    if (pendingActorId && pendingKind === "pass" && playerId !== pendingActorId && pendingActorId === carrierId) {
      commitStep({ id: crypto.randomUUID(), kind: "pass", playerId: pendingActorId, toPlayerId: playerId, startStep: nextStartStep() });
      return;
    }
    setPendingActorId(playerId);
    setPendingKind(null);
  }

  function handlePitchClick(point: Point) {
    if (!pendingActorId || !pendingKind) return;
    if (pendingKind !== "run" && pendingActorId !== carrierId) return;
    const startStep = nextStartStep();
    if (pendingKind === "run") {
      commitStep({ id: crypto.randomUUID(), kind: "run", playerId: pendingActorId, startStep, endStep: startStep + 2, toPoint: point });
    } else {
      commitStep({ id: crypto.randomUUID(), kind: pendingKind, playerId: pendingActorId, startStep, toPoint: point });
    }
  }

  function handleUndo() {
    if (steps.length === 0) return;
    setRedoStack((s) => [...s, steps[steps.length - 1]]);
    setSteps(steps.slice(0, -1));
    setPreviewIndex(null);
    setResult(null);
  }

  function handleRedo() {
    if (redoStack.length === 0) return;
    const restored = redoStack[redoStack.length - 1];
    setRedoStack((s) => s.slice(0, -1));
    setSteps((prev) => [...prev, restored]);
    setPreviewIndex(null);
    setResult(null);
  }

  function handleDeleteStep(id: string) {
    setSteps((prev) => prev.filter((s) => s.id !== id));
    setPreviewIndex(null);
    setResult(null);
  }

  function handleRetimeStep(id: string, delta: number) {
    setSteps((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const duration = (s.endStep ?? s.startStep + 1) - s.startStep;
        const newStart = Math.max(0, s.startStep + delta);
        return { ...s, startStep: newStart, endStep: s.kind === "run" ? newStart + duration : s.endStep };
      }),
    );
    setResult(null);
  }

  function evaluateNow(finalFrames: typeof frames) {
    if (!scenario) return;
    const finalResult = evaluateScenario(scenario, tier, steps, finalFrames);
    setResult(finalResult);
    if (finalResult.outcome === "GOAL" || finalResult.outcome === "CHANCE_CREATED") {
      const stepsUsed = steps.reduce((max, s) => Math.max(max, s.endStep ?? s.startStep + 1), 0);
      completeScenario(scenario.slug, scenario.family, tier, finalResult.grade ?? "bronze", stepsUsed, stepsUsed <= scenario.parSteps);
    }
  }

  function handlePlay() {
    setPreviewIndex(null);
    setResult(null);
    if (reduceMotion) {
      setPlaybackIndex(frames.length - 1);
      setIsPlaying(false);
      evaluateNow(frames);
      return;
    }
    setPlaybackIndex(0);
    setIsPlaying(true);
  }

  function selectScenario(slug: string) {
    setScenarioSlug(slug);
    setSteps([]);
    setRedoStack([]);
    setResult(null);
    setTier("bronze");
    setIsSharedReadOnly(false);
    resetPending();
  }

  function loadTemplate() {
    if (!scenario?.templatePlay) return;
    setSteps(scenario.templatePlay);
    setRedoStack([]);
    setResult(null);
    resetPending();
  }

  function changeTier(next: DifficultyTier) {
    setTier(next);
    setResult(null);
  }

  function handleSave() {
    if (!scenario || !result) return;
    // The Playbook list already appends "— {tier} ({grade})" itself, so the
    // default name here is just the scenario — avoids a redundant "Silver —
    // bronze (Silver)" when the user doesn't type their own name.
    const name = saveName.trim() || scenario.name;
    savePlay({ scenarioSlug: scenario.slug, tier, steps, grade: result.grade, name });
    setSaveName("");
  }

  function handleShare() {
    if (!scenario) return;
    const encoded = encodeSharedPlay({ scenarioSlug: scenario.slug, tier, steps });
    const url = `${window.location.origin}${window.location.pathname}?play=${encoded}`;
    navigator.clipboard.writeText(url).then(() => {
      setShareStatus("copied");
      setTimeout(() => setShareStatus("idle"), 2000);
    });
  }

  if (!scenario) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-pitch-marker">Scenario Mode</p>
          <h2 className="mt-1 font-display text-2xl font-bold uppercase tracking-tight text-pitch-line">Pick a situation to solve</h2>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-pitch-touchline">
            Choreograph a move against a defense that reacts along scripted recovery paths — time your runs and passes to beat it before it recovers.
          </p>
        </div>
        <ScenarioPicker scenarios={scenarios} onSelect={selectScenario} />
        {plays.length > 0 && (
          <div className="flex flex-col gap-2 rounded-lg border border-pitch-touchline/30 bg-pitch-card p-4">
            <p className="font-mono text-xs uppercase tracking-widest text-pitch-marker">Playbook</p>
            <ul className="flex flex-col gap-1.5">
              {plays.map((play) => (
                <li key={play.id} className="flex items-center justify-between gap-2 text-sm text-pitch-line/90">
                  <button
                    type="button"
                    onClick={() => {
                      setScenarioSlug(play.scenarioSlug);
                      setTier(play.tier);
                      setSteps(play.steps);
                      setResult(null);
                      setIsSharedReadOnly(false);
                    }}
                    className="text-left hover:text-attack"
                  >
                    {play.name} — {play.tier}
                    {play.grade ? ` (${GRADE_LABEL[play.grade]})` : ""}
                  </button>
                  <button type="button" onClick={() => deletePlay(play.id)} aria-label={`Delete ${play.name}`} className="font-mono text-xs text-pitch-touchline hover:text-press">
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  const pendingActor = scenario.stage.players.find((p) => p.id === pendingActorId);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <button
            type="button"
            onClick={() => setScenarioSlug(null)}
            className="font-mono text-[10px] uppercase tracking-widest text-pitch-touchline hover:text-pitch-line"
          >
            ← Back to scenarios
          </button>
          <h2 className="mt-1 font-display text-2xl font-bold uppercase tracking-tight text-pitch-line">{scenario.name}</h2>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-pitch-touchline">{scenario.brief}</p>
        </div>
        {!isSharedReadOnly && (
          <SegmentedTabs id="scenario-tier" ariaLabel="Difficulty tier" options={TIER_OPTIONS} value={tier} onChange={changeTier} />
        )}
      </div>

      {isSharedReadOnly && (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-defend/40 bg-defend/10 p-3">
          <p className="text-xs text-pitch-line/90">Viewing a shared play, read-only.</p>
          <button
            type="button"
            onClick={() => setIsSharedReadOnly(false)}
            className="min-h-9 rounded-md border border-attack px-3 font-mono text-[10px] uppercase tracking-widest text-attack hover:bg-attack/10"
          >
            Duplicate to edit
          </button>
          <button
            type="button"
            onClick={() => {
              setSteps([]);
              setResult(null);
              setIsSharedReadOnly(false);
            }}
            className="min-h-9 rounded-md border border-pitch-touchline/40 px-3 font-mono text-[10px] uppercase tracking-widest text-pitch-touchline hover:text-pitch-line"
          >
            Attempt this scenario yourself
          </button>
        </div>
      )}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
        <div className="mx-auto w-full max-w-md lg:mx-0 lg:max-w-lg lg:flex-1">
          {frame && (
            <ScenarioStage
              scenario={scenario}
              steps={steps}
              frames={frames}
              frame={frame}
              displayStepIndex={displayIndex}
              pendingActorId={pendingActorId}
              pendingKind={pendingKind}
              interceptionPoint={result?.brokenAt}
              readOnly={readOnly}
              onSelectPlayer={handleSelectPlayer}
              onPitchClick={handlePitchClick}
            />
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {readOnly ? (
              <p className="text-xs leading-relaxed text-pitch-touchline">{isPlaying ? "Playing…" : "Read-only shared play."}</p>
            ) : pendingActor ? (
              <>
                <span className="font-mono text-xs uppercase tracking-widest text-pitch-marker">{pendingActor.code}:</span>
                {(["pass", "run", "shot"] as ScenarioActionKind[]).map((kind) => {
                  const disabled = kind !== "run" && !pendingActorHasBall;
                  return (
                    <button
                      key={kind}
                      type="button"
                      disabled={disabled}
                      aria-pressed={pendingKind === kind}
                      onClick={() => setPendingKind(kind)}
                      className={`min-h-9 rounded-md border px-3 font-mono text-xs uppercase tracking-widest transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker ${
                        disabled
                          ? "cursor-not-allowed border-pitch-touchline/20 text-pitch-touchline/40"
                          : pendingKind === kind
                            ? "border-attack bg-attack/15 text-attack"
                            : "border-pitch-touchline/40 text-pitch-touchline hover:border-pitch-touchline hover:text-pitch-line"
                      }`}
                    >
                      {KIND_LABEL[kind]}
                    </button>
                  );
                })}
                <span className="text-xs text-pitch-touchline">
                  {!pendingActorHasBall
                    ? `${pendingActor.code} doesn't have the ball — only a run is available.`
                    : pendingKind === "pass"
                      ? "Click a teammate, or the pitch for a pass into space."
                      : pendingKind
                        ? "Click the pitch for the destination."
                        : "Choose an action."}
                </span>
                <button type="button" onClick={resetPending} className="font-mono text-[10px] uppercase tracking-widest text-pitch-touchline hover:text-pitch-line">
                  Cancel
                </button>
              </>
            ) : (
              <p className="text-xs leading-relaxed text-pitch-touchline">Select a player to start choreographing this move.</p>
            )}
          </div>

          {!readOnly && scenario.templatePlay && steps.length === 0 && (
            <button type="button" onClick={loadTemplate} className="mt-2 font-mono text-[10px] uppercase tracking-widest text-defend-bright hover:text-pitch-line">
              Load a template routine to start from
            </button>
          )}
        </div>

        <aside className="flex w-full flex-col gap-4 lg:w-96">
          <div className="flex flex-col gap-2 rounded-lg border border-pitch-touchline/30 bg-pitch-card p-4">
            <p className="font-mono text-xs uppercase tracking-widest text-pitch-marker">Constraints</p>
            <ul className="flex flex-col gap-1 text-sm text-pitch-line/90">
              {scenario.constraints.map((constraint, index) => (
                <li key={index}>• {describeConstraint(constraint)}</li>
              ))}
            </ul>
          </div>

          {!readOnly && (
            <ScenarioTimeline
              scenario={scenario}
              steps={steps}
              currentIndex={displayIndex}
              canRedo={redoStack.length > 0}
              isPlaying={isPlaying}
              onSelectStep={(index) => {
                setIsPlaying(false);
                setPreviewIndex(index);
              }}
              onDeleteStep={handleDeleteStep}
              onRetimeStep={handleRetimeStep}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onPlay={handlePlay}
            />
          )}

          {result && <ScenarioOutcomePanel result={result} />}

          {result && (result.outcome === "GOAL" || result.outcome === "CHANCE_CREATED") && !readOnly && (
            <div className="flex flex-col gap-2 rounded-lg border border-pitch-touchline/30 bg-pitch-card p-4">
              <p className="font-mono text-xs uppercase tracking-widest text-pitch-marker">Save this play</p>
              <div className="flex gap-2">
                <input
                  value={saveName}
                  onChange={(event) => setSaveName(event.target.value)}
                  placeholder="Name this play"
                  className="min-h-9 flex-1 rounded-md border border-pitch-touchline/40 bg-pitch-deep px-2 text-sm text-pitch-line"
                />
                <button type="button" onClick={handleSave} className="min-h-9 shrink-0 rounded-md border border-attack px-3 font-mono text-[10px] uppercase tracking-widest text-attack hover:bg-attack/10">
                  Save
                </button>
              </div>
              <button
                type="button"
                onClick={handleShare}
                className="min-h-9 rounded-md border border-pitch-touchline/40 px-3 font-mono text-[10px] uppercase tracking-widest text-pitch-touchline hover:text-pitch-line"
              >
                {shareStatus === "copied" ? "Link copied!" : "Copy share link"}
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
