"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { PitchMarkings } from "@/components/pitch/PitchMarkings";
import { getCarrierId, type ScenarioFrame } from "@/lib/scenario-mode/simulation";
import type { Point, Scenario, ScenarioActionKind, ScenarioStep } from "@/lib/scenario-mode/schema";

/** How long each step's movement animates for during playback. */
const STEP_ANIMATION_SECONDS = 0.7;

function pointFromClick(event: React.MouseEvent<HTMLDivElement>, container: HTMLDivElement): Point {
  const rect = container.getBoundingClientRect();
  return {
    x: Math.min(100, Math.max(0, ((event.clientX - rect.left) / rect.width) * 100)),
    y: Math.min(100, Math.max(0, ((event.clientY - rect.top) / rect.height) * 100)),
  };
}

function curveControlPoint(from: Point, to: Point) {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy) || 1;
  const offset = length * 0.18;
  return { x: midX + (-dy / length) * offset, y: midY + (dx / length) * offset };
}

type Props = {
  scenario: Scenario;
  steps: ScenarioStep[];
  frames: ScenarioFrame[];
  frame: ScenarioFrame;
  displayStepIndex: number;
  pendingActorId: string | null;
  pendingKind: ScenarioActionKind | null;
  interceptionPoint?: Point;
  readOnly?: boolean;
  onSelectPlayer: (id: string) => void;
  onPitchClick: (point: Point) => void;
};

/**
 * The staged pitch for one scenario attempt. Visually distinguishes
 * opponents from the user's own players by shape (rounded square, dashed)
 * as well as color, not color alone — a defending marker should never read
 * as "just a blue dot" to someone who can't see hue.
 */
export function ScenarioStage({
  scenario,
  steps,
  frames,
  frame,
  displayStepIndex,
  pendingActorId,
  pendingKind,
  interceptionPoint,
  readOnly = false,
  onSelectPlayer,
  onPitchClick,
}: Props) {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const carrierId = getCarrierId(frame);

  function handlePitchClick(event: React.MouseEvent<HTMLDivElement>) {
    if (readOnly || !containerRef.current || !pendingActorId || !pendingKind) return;
    onPitchClick(pointFromClick(event, containerRef.current));
  }

  return (
    <div
      ref={containerRef}
      onClick={handlePitchClick}
      className="telemetry-panel-lift relative w-full touch-none select-none aspect-[68/105] rounded-xl border-2 border-pitch-touchline/25 bg-pitch-deep p-2 sm:p-3"
    >
      <PitchMarkings />

      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
        {steps.map((step) => {
          const startFrame = frames[step.startStep];
          if (!startFrame) return null;
          const from = startFrame.playerPositions[step.playerId];
          const to = step.kind === "pass" && step.toPlayerId ? startFrame.playerPositions[step.toPlayerId] : step.toPoint;
          if (!from || !to) return null;
          const dimmed = displayStepIndex < step.startStep;
          const opacity = dimmed ? 0.25 : 0.8;
          if (step.kind === "run") {
            const control = curveControlPoint(from, to);
            return (
              <path
                key={step.id}
                d={`M ${from.x} ${from.y} Q ${control.x} ${control.y} ${to.x} ${to.y}`}
                fill="none"
                stroke="var(--attack)"
                strokeWidth="0.6"
                strokeDasharray="2 1.4"
                strokeOpacity={opacity}
              />
            );
          }
          return (
            <line
              key={step.id}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={step.kind === "shot" ? "var(--press)" : "var(--attack)"}
              strokeWidth={step.kind === "shot" ? 0.9 : 0.6}
              strokeOpacity={opacity}
            />
          );
        })}
      </svg>

      {interceptionPoint && (
        <motion.div
          aria-hidden="true"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: [0.6, 1.4, 1], opacity: 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.5 }}
          className="absolute z-30 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-press bg-press/20"
          style={{ left: `${interceptionPoint.x}%`, top: `${interceptionPoint.y}%` }}
        />
      )}

      {Object.entries(frame.opponentPositions).map(([id, position]) => {
        const opponent = scenario.stage.opponents.find((o) => o.id === id);
        return (
          <motion.div
            key={id}
            layout
            aria-hidden="true"
            style={{ left: `${position.x}%`, top: `${position.y}%` }}
            transition={reduceMotion ? { duration: 0 } : { duration: STEP_ANIMATION_SECONDS, ease: "easeInOut" }}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-md border-2 border-dashed border-press/70 bg-press/10 font-mono text-xs font-semibold text-press">
              {opponent?.code ?? "OP"}
            </div>
          </motion.div>
        );
      })}

      <motion.div
        aria-hidden="true"
        animate={{ left: `${frame.ballPosition.x}%`, top: `${frame.ballPosition.y}%` }}
        transition={reduceMotion ? { duration: 0 } : { duration: STEP_ANIMATION_SECONDS, ease: "easeInOut" }}
        className="pointer-events-none absolute z-20 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pitch-line shadow-[0_0_6px_rgba(34,56,74,0.45)]"
      />

      {scenario.stage.players.map((player) => {
        const position = frame.playerPositions[player.id];
        const isSelected = pendingActorId === player.id;
        const hasBall = carrierId === player.id;
        return (
          <motion.button
            key={player.id}
            type="button"
            disabled={readOnly}
            tabIndex={readOnly ? -1 : 0}
            aria-label={`${player.code}${hasBall ? " (has the ball)" : ""}${isSelected ? " (selected)" : ""}`}
            aria-pressed={isSelected}
            onClick={
              readOnly
                ? undefined
                : (event) => {
                    event.stopPropagation();
                    onSelectPlayer(player.id);
                  }
            }
            animate={{ left: `${position.x}%`, top: `${position.y}%` }}
            transition={reduceMotion ? { duration: 0 } : { duration: STEP_ANIMATION_SECONDS, ease: "easeInOut" }}
            className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 ${readOnly ? "" : "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"}`}
          >
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-full border-2 bg-pitch-card font-mono text-xs font-semibold text-pitch-line shadow-[0_2px_8px_rgba(34,56,74,0.35)] transition-colors ${
                isSelected
                  ? "border-press ring-2 ring-press ring-offset-2 ring-offset-pitch-deep"
                  : hasBall
                    ? "border-pitch-marker ring-2 ring-pitch-marker/60 ring-offset-2 ring-offset-pitch-deep"
                    : "border-attack/50"
              }`}
            >
              {player.code}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
