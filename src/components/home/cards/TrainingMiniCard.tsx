"use client";

import { usePlayerCard } from "@/lib/playerCard";
import { getPosition, positionMarkerPoint } from "@/lib/positions";

const PITCH_W = 68;
const PITCH_H = 105;

/** A read-only echo of the visitor's own Player Card — position dot plus nickname — when one exists. Deliberately not PlayerCardView's `compact` mode: that renders a real <button>, which can't nest inside this card's own <a>. First-time visitors get generic copy instead. */
export function TrainingMiniCard() {
  const { card } = usePlayerCard();

  if (!card) {
    return (
      <p className="font-mono text-[10px] uppercase tracking-widest text-pitch-touchline/70">
        Build your Player Card →
      </p>
    );
  }

  const position = getPosition(card.positionCode);
  const marker = position ? positionMarkerPoint(position) : { x: 50, y: 50 };

  return (
    <div className="flex items-center gap-3">
      <svg viewBox={`0 0 ${PITCH_W} ${PITCH_H}`} className="h-11 w-auto shrink-0 overflow-visible" aria-hidden="true">
        <rect x="1" y="1" width={PITCH_W - 2} height={PITCH_H - 2} rx="2" fill="none" stroke="var(--pitch-touchline)" strokeOpacity="0.35" strokeWidth="0.5" />
        <circle cx={(marker.x / 100) * PITCH_W} cy={(marker.y / 100) * PITCH_H} r="2.8" fill="var(--attack)" />
      </svg>
      <div className="flex flex-col">
        <span className="font-mono text-[10px] uppercase tracking-widest text-gold-flood">{card.positionCode}</span>
        <span className="text-xs font-semibold text-pitch-line">{card.nickname || "Your Player Card"}</span>
      </div>
    </div>
  );
}
