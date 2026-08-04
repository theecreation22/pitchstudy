"use client";

import { getFormation } from "@/lib/formations";

const PITCH_W = 68;
const PITCH_H = 105;

const FROM = getFormation("4-4-2")!.players;
const TO = getFormation("4-3-3")!.players;

/** A tiny live pitch that tweens 4-4-2 into 4-3-3 on hover/focus — the card demonstrates the product instead of describing it. CSS-only (transform transition per dot), so it costs nothing until touched; group-hover on the parent card link drives it, no JS state. */
export function ExploreMiniPitch() {
  return (
    <svg viewBox={`0 0 ${PITCH_W} ${PITCH_H}`} className="mx-auto max-h-40 w-auto overflow-visible" aria-hidden="true">
      <rect x="1" y="1" width={PITCH_W - 2} height={PITCH_H - 2} rx="2" fill="var(--pitch-deep)" stroke="var(--pitch-touchline)" strokeOpacity="0.35" strokeWidth="0.4" />
      <line x1="1" y1={PITCH_H / 2} x2={PITCH_W - 1} y2={PITCH_H / 2} stroke="var(--pitch-touchline)" strokeOpacity="0.25" strokeWidth="0.3" />
      <circle cx={PITCH_W / 2} cy={PITCH_H / 2} r="9" fill="none" stroke="var(--pitch-touchline)" strokeOpacity="0.25" strokeWidth="0.3" />
      {FROM.map((player, i) => {
        const to = TO[i] ?? player;
        return (
          <circle
            key={player.id}
            r="2.4"
            fill="var(--attack)"
            className="explore-mini-dot"
            style={
              {
                "--dot-x-from": `${(player.x / 100) * PITCH_W}px`,
                "--dot-y-from": `${(player.y / 100) * PITCH_H}px`,
                "--dot-x-to": `${(to.x / 100) * PITCH_W}px`,
                "--dot-y-to": `${(to.y / 100) * PITCH_H}px`,
              } as React.CSSProperties
            }
          />
        );
      })}
    </svg>
  );
}
