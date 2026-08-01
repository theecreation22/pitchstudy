import { computePlayFrames } from "@/lib/tactics-lab/playSchema";
import { getScenario } from "@/lib/scenario-mode/scenarios";
import type { PlaybookEntry } from "@/lib/tactics-lab/playbookSchema";

const PITCH_W = 68;
const PITCH_H = 105;

function px(x: number) {
  return (x / 100) * PITCH_W;
}
function py(y: number) {
  return (y / 100) * PITCH_H;
}

function PitchOutline() {
  return (
    <>
      <rect x="1" y="1" width={PITCH_W - 2} height={PITCH_H - 2} rx="2" fill="none" stroke="var(--pitch-touchline)" strokeOpacity="0.4" strokeWidth="1.2" />
      <line x1="1" y1={PITCH_H / 2} x2={PITCH_W - 1} y2={PITCH_H / 2} stroke="var(--pitch-touchline)" strokeOpacity="0.4" strokeWidth="1" />
    </>
  );
}

/**
 * Rendered live from entry data at gallery-render time (§4) — zero storage
 * cost, always crisp, never goes stale relative to the entry it depicts.
 * Formations show their 11 dots; designer-origin plays show the final
 * frame plus faint run/ball-path lines; scenario-origin plays show the
 * puzzle's starting stage (no timeline math needed for a static preview).
 */
export function PlaybookThumbnail({ entry, size = 56 }: { entry: PlaybookEntry; size?: number }) {
  const width = size;
  const height = size * (PITCH_H / PITCH_W);

  let dots: { id: string; x: number; y: number }[] = [];
  const runLines: { x1: number; y1: number; x2: number; y2: number }[] = [];
  let ballPath: { x: number; y: number }[] = [];

  if (entry.type === "formation") {
    dots = entry.players.map((p) => ({ id: p.id, x: p.x, y: p.y }));
  } else if (entry.origin === "designer") {
    const frames = computePlayFrames(entry.players, entry.steps);
    const finalFrame = frames[frames.length - 1];
    dots = entry.players.map((p) => ({ id: p.id, x: finalFrame.positions[p.id]?.x ?? p.x, y: finalFrame.positions[p.id]?.y ?? p.y }));
    ballPath = frames.map((f) => f.ballPosition);
    entry.steps.forEach((step, i) => {
      if (step.kind === "run" && step.toPoint) {
        const before = frames[i].positions[step.playerId];
        if (before) runLines.push({ x1: before.x, y1: before.y, x2: step.toPoint.x, y2: step.toPoint.y });
      }
    });
  } else {
    const scenario = getScenario(entry.scenarioSlug);
    if (scenario) {
      dots = scenario.stage.players.map((p) => ({ id: p.id, x: p.start.x, y: p.start.y }));
    }
  }

  return (
    <svg viewBox={`0 0 ${PITCH_W} ${PITCH_H}`} width={width} height={height} className="shrink-0 overflow-visible" aria-hidden="true">
      <PitchOutline />
      {ballPath.length > 1 && (
        <polyline
          points={ballPath.map((point) => `${px(point.x)},${py(point.y)}`).join(" ")}
          fill="none"
          stroke="var(--attack)"
          strokeOpacity="0.35"
          strokeWidth="0.6"
          strokeDasharray="1.5 1.2"
        />
      )}
      {runLines.map((line, i) => (
        <line
          key={i}
          x1={px(line.x1)}
          y1={py(line.y1)}
          x2={px(line.x2)}
          y2={py(line.y2)}
          stroke="var(--attack)"
          strokeOpacity="0.25"
          strokeWidth="0.5"
        />
      ))}
      {dots.map((dot) => (
        <circle key={dot.id} cx={px(dot.x)} cy={py(dot.y)} r="2.6" fill="var(--attack)" />
      ))}
    </svg>
  );
}
