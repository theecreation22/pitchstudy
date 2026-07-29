import type { Scenario, ScenarioStep } from "@/lib/scenario-mode/schema";

function describeStep(step: ScenarioStep, scenario: Scenario): string {
  const actorCode = scenario.stage.players.find((p) => p.id === step.playerId)?.code ?? "Player";
  if (step.kind === "run") return `${actorCode} runs (steps ${step.startStep}-${step.endStep ?? step.startStep + 1})`;
  if (step.kind === "shot") return `${actorCode} shoots (step ${step.startStep})`;
  const targetCode = step.toPlayerId ? scenario.stage.players.find((p) => p.id === step.toPlayerId)?.code : null;
  return targetCode ? `${actorCode} passes to ${targetCode} (step ${step.startStep})` : `${actorCode} plays into space (step ${step.startStep})`;
}

type Props = {
  scenario: Scenario;
  steps: ScenarioStep[];
  currentIndex: number;
  canRedo: boolean;
  isPlaying: boolean;
  onSelectStep: (index: number) => void;
  onDeleteStep: (id: string) => void;
  onRetimeStep: (id: string, delta: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  onPlay: () => void;
};

export function ScenarioTimeline({
  scenario,
  steps,
  currentIndex,
  canRedo,
  isPlaying,
  onSelectStep,
  onDeleteStep,
  onRetimeStep,
  onUndo,
  onRedo,
  onPlay,
}: Props) {
  const passCount = steps.filter((s) => s.kind === "pass" || s.kind === "shot").length;
  const maxPasses = scenario.constraints.find((c) => c.kind === "maxPasses");
  const maxSteps = scenario.constraints.find((c) => c.kind === "maxSteps");
  const lastStepIndex = steps.reduce((max, s) => Math.max(max, s.endStep ?? s.startStep + 1), 0);

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-pitch-touchline/30 bg-pitch-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-xs uppercase tracking-widest text-pitch-marker">Move sequence</p>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onUndo} disabled={steps.length === 0} className="min-h-9 rounded-md border border-pitch-touchline/40 px-3 font-mono text-[10px] uppercase tracking-widest text-pitch-touchline transition-colors hover:border-pitch-touchline hover:text-pitch-line disabled:cursor-not-allowed disabled:opacity-40">
            Undo
          </button>
          <button type="button" onClick={onRedo} disabled={!canRedo} className="min-h-9 rounded-md border border-pitch-touchline/40 px-3 font-mono text-[10px] uppercase tracking-widest text-pitch-touchline transition-colors hover:border-pitch-touchline hover:text-pitch-line disabled:cursor-not-allowed disabled:opacity-40">
            Redo
          </button>
          <button type="button" onClick={onPlay} disabled={steps.length === 0 || isPlaying} className="min-h-9 rounded-md border border-attack px-4 font-mono text-[10px] uppercase tracking-widest text-attack transition-colors hover:bg-attack/10 disabled:cursor-not-allowed disabled:opacity-40">
            {isPlaying ? "Playing…" : "Play"}
          </button>
        </div>
      </div>

      <p className="font-mono text-[10px] uppercase tracking-widest text-pitch-touchline">
        {passCount} pass{passCount === 1 ? "" : "es"}
        {maxPasses ? ` / ${maxPasses.value} max` : ""} · {lastStepIndex} step{lastStepIndex === 1 ? "" : "s"}
        {maxSteps ? ` / ${maxSteps.value} max` : ""}
      </p>

      {steps.length === 0 ? (
        <p className="text-xs leading-relaxed text-pitch-touchline">
          Select a player on the pitch above, choose Pass, Run, or Shot, then click a teammate or a spot on the pitch.
        </p>
      ) : (
        <ol className="flex flex-col gap-1.5">
          {steps.map((step, index) => {
            const isActive = currentIndex === step.startStep;
            return (
              <li key={step.id}>
                <div className={`flex items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm transition-colors ${isActive ? "border-attack bg-attack/10 text-pitch-line" : "border-pitch-touchline/20 text-pitch-line/80"}`}>
                  <button type="button" onClick={() => onSelectStep(step.startStep)} className="flex-1 text-left">
                    <span className="mr-2 font-mono text-xs text-pitch-touchline">{index + 1}.</span>
                    {describeStep(step, scenario)}
                  </button>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onRetimeStep(step.id, -1)}
                      disabled={step.startStep <= 0}
                      aria-label={`Time ${describeStep(step, scenario)} one step earlier`}
                      className="font-mono text-xs text-pitch-touchline transition-colors hover:text-attack disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={() => onRetimeStep(step.id, 1)}
                      aria-label={`Time ${describeStep(step, scenario)} one step later`}
                      className="font-mono text-xs text-pitch-touchline transition-colors hover:text-attack"
                    >
                      →
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteStep(step.id)}
                      aria-label={`Delete: ${describeStep(step, scenario)}`}
                      className="ml-1 font-mono text-xs text-pitch-touchline transition-colors hover:text-press"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
