"use client";

import { motion, useReducedMotion } from "framer-motion";
import { getPosition, positionMarkerPoint } from "@/lib/positions";
import { getPlaystyle, equipmentLabels, levelLabels, type Attribute } from "@/lib/workouts";
import type { PlayerCard } from "@/lib/playerCard";
import { AttributeRadar } from "./AttributeRadar";

const PITCH_W = 68;
const PITCH_H = 105;

const BALANCED_PROFILE: Record<Attribute, number> = {
  strength: 55,
  power: 55,
  speed: 55,
  agility: 55,
  endurance: 55,
  technical: 55,
};

/** A small chalk pitch silhouette with a single glowing dot at the card's position — the same marker language as the Trial Day picker, just fixed to one spot instead of tappable. */
function MiniPitchMarker({ x, y }: { x: number; y: number }) {
  const px = (x / 100) * PITCH_W;
  const py = (y / 100) * PITCH_H;

  return (
    <svg viewBox={`0 0 ${PITCH_W} ${PITCH_H}`} className="h-full w-full overflow-visible" aria-hidden="true">
      <rect x="1" y="1" width={PITCH_W - 2} height={PITCH_H - 2} rx="1.5" fill="var(--pitch-deep)" stroke="var(--pitch-touchline)" strokeOpacity="0.4" strokeWidth="0.4" />
      <line x1="1" y1={PITCH_H / 2} x2={PITCH_W - 1} y2={PITCH_H / 2} stroke="var(--pitch-touchline)" strokeOpacity="0.3" strokeWidth="0.3" />
      <circle cx={PITCH_W / 2} cy={PITCH_H / 2} r="9" fill="none" stroke="var(--pitch-touchline)" strokeOpacity="0.3" strokeWidth="0.3" />
      <circle cx={px} cy={py} r="5" fill="var(--attack)" opacity="0.25" />
      <circle cx={px} cy={py} r="2.6" fill="var(--attack)" stroke="var(--pitch-card)" strokeWidth="0.6" />
    </svg>
  );
}

type Props = {
  card: PlayerCard;
  onEdit?: () => void;
  compact?: boolean;
  /** This block's training coverage (§2) — when given, the radar shows it growing inside the archetype's target outline instead of just the static target shape. */
  coverage?: Record<Attribute, number>;
};

/** The Player Card — the Training Ground's center of gravity (§1). Tapping it (when `onEdit` is given) opens edit mode. */
export function PlayerCardView({ card, onEdit, compact, coverage }: Props) {
  const reduceMotion = useReducedMotion();
  const position = getPosition(card.positionCode);
  const playstyle = card.playstyleId ? getPlaystyle(card.playstyleId) : undefined;
  const marker = position ? positionMarkerPoint(position) : { x: 50, y: 50 };
  const profile = playstyle?.attributeProfile ?? BALANCED_PROFILE;
  const roleLine = playstyle ? playstyle.name : "Balanced";

  if (compact) {
    return (
      <button
        type="button"
        onClick={onEdit}
        className="group flex w-full items-center gap-3 rounded-lg border border-pitch-touchline/30 bg-pitch-card px-4 py-2.5 text-left transition-colors hover:border-pitch-marker focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
      >
        <div className="h-9 w-7 shrink-0">
          <MiniPitchMarker x={marker.x} y={marker.y} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate font-display text-sm font-bold uppercase tracking-tight text-pitch-line">
            {card.nickname || position?.name || card.positionCode}
          </span>
          <span className="truncate font-mono text-[10px] uppercase tracking-widest text-pitch-touchline">
            {position?.code} · {roleLine}
          </span>
        </div>
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-pitch-touchline group-hover:text-pitch-marker">
          Edit
        </span>
      </button>
    );
  }

  return (
    <motion.div
      initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.4, ease: "easeOut" }}
      className="relative overflow-hidden rounded-lg border-2 border-pitch-touchline/40 bg-pitch-card p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_16px_40px_-16px_rgba(0,0,0,0.7)]"
    >
      <div className="pointer-events-none absolute inset-2 rounded border border-dashed border-pitch-touchline/20" aria-hidden="true" />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
        <div className="flex shrink-0 flex-col items-center gap-2 sm:w-24">
          <div className="h-28 w-20 sm:h-32">
            <MiniPitchMarker x={marker.x} y={marker.y} />
          </div>
          <span className="font-mono text-xs uppercase tracking-widest text-pitch-marker">{card.positionCode}</span>
        </div>

        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center gap-2">
            <p className="font-display text-2xl font-black uppercase leading-none tracking-tight text-pitch-line sm:text-3xl">
              {card.nickname || position?.name || "Your Card"}
            </p>
            {typeof card.squadNumber === "number" && (
              <span className="font-display text-xl font-black leading-none text-attack sm:text-2xl">#{card.squadNumber}</span>
            )}
          </div>
          <p className="font-mono text-xs uppercase tracking-widest text-attack">{roleLine}</p>
          <div className="mt-2 flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-widest text-pitch-touchline">
            <span className="rounded-full border border-pitch-touchline/40 px-2 py-0.5">{levelLabels[card.level]}</span>
            <span className="rounded-full border border-pitch-touchline/40 px-2 py-0.5">{equipmentLabels[card.equipment]}</span>
          </div>
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="mt-3 inline-flex w-fit items-center rounded-full border border-pitch-touchline/50 px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest text-pitch-touchline transition-colors hover:border-pitch-marker hover:text-pitch-marker focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
            >
              Edit Card
            </button>
          )}
        </div>

        <div className="w-full max-w-[200px] shrink-0 sm:w-40">
          <AttributeRadar
            profile={profile}
            color={playstyle ? "var(--attack)" : "var(--touchline-muted)"}
            secondaryProfile={coverage}
            animateDraw={!coverage}
          />
        </div>
      </div>
    </motion.div>
  );
}
