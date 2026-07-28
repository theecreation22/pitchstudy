import type { LabPlayer } from "@/lib/tactics-lab/designSchema";
import { describeStep, type PlayStep } from "@/lib/tactics-lab/playSchema";

type Props = {
  steps: PlayStep[];
  players: LabPlayer[];
  /** The frame index currently on display (0 = initial state, i = after step i-1). */
  currentIndex: number;
  canRedo: boolean;
  isPlaying: boolean;
  onSelectStep: (frameIndex: number) => void;
  onDeleteStep: (id: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  onPlay: () => void;
};

export function StepTimeline({ steps, players, currentIndex, canRedo, isPlaying, onSelectStep, onDeleteStep, onUndo, onRedo, onPlay }: Props) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-pitch-touchline/30 bg-pitch-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-xs uppercase tracking-widest text-pitch-marker">Move sequence</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onUndo}
            disabled={steps.length === 0}
            className="min-h-9 rounded-md border border-pitch-touchline/40 px-3 font-mono text-[10px] uppercase tracking-widest text-pitch-touchline transition-colors hover:border-pitch-touchline hover:text-pitch-line disabled:cursor-not-allowed disabled:opacity-40"
          >
            Undo
          </button>
          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            className="min-h-9 rounded-md border border-pitch-touchline/40 px-3 font-mono text-[10px] uppercase tracking-widest text-pitch-touchline transition-colors hover:border-pitch-touchline hover:text-pitch-line disabled:cursor-not-allowed disabled:opacity-40"
          >
            Redo
          </button>
          <button
            type="button"
            onClick={onPlay}
            disabled={steps.length === 0 || isPlaying}
            className="min-h-9 rounded-md border border-attack px-4 font-mono text-[10px] uppercase tracking-widest text-attack transition-colors hover:bg-attack/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isPlaying ? "Playing…" : "Play"}
          </button>
        </div>
      </div>

      {steps.length === 0 ? (
        <p className="text-xs leading-relaxed text-pitch-touchline">
          No steps yet. Select a player on the pitch above, choose Pass, Run, or Shot, then click a teammate or a
          spot on the pitch.
        </p>
      ) : (
        <ol className="flex flex-col gap-1.5">
          {steps.map((step, index) => {
            const isActive = currentIndex === index + 1;
            return (
              <li key={step.id}>
                <div
                  className={`flex items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm transition-colors ${
                    isActive ? "border-attack bg-attack/10 text-pitch-line" : "border-pitch-touchline/20 text-pitch-line/80"
                  }`}
                >
                  <button type="button" onClick={() => onSelectStep(index + 1)} className="flex-1 text-left">
                    <span className="mr-2 font-mono text-xs text-pitch-touchline">{index + 1}.</span>
                    {describeStep(step, players)}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteStep(step.id)}
                    aria-label={`Delete step ${index + 1}`}
                    className="font-mono text-xs text-pitch-touchline transition-colors hover:text-press"
                  >
                    ×
                  </button>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
