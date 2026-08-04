"use client";

import { getFormation } from "@/lib/formations";
import { managers } from "@/lib/managers";

const PITCH_W = 68;
const PITCH_H = 105;

// Two managers whose signature shapes read as genuinely different silhouettes
// side by side (4-4-2 flat bank vs. a front-three), so the hover tween has
// something real to show rather than two near-identical dot clouds.
const MANAGER_A = managers.find((m) => m.slug === "arrigo-sacchi")!;
const MANAGER_B = managers.find((m) => m.slug === "pep-guardiola")!;
const FROM = getFormation(MANAGER_A.signatureFormationSlug)!.players;
const TO = getFormation(MANAGER_B.signatureFormationSlug)!.players;

/** Cycles between two managers' signature formations on hover/focus — same CSS-tween mechanic as the Explore card, different data. */
export function ManagersMiniCard() {
  return (
    <div className="flex items-center gap-3">
      <svg viewBox={`0 0 ${PITCH_W} ${PITCH_H}`} className="h-11 w-auto shrink-0 overflow-visible" aria-hidden="true">
        <rect x="1" y="1" width={PITCH_W - 2} height={PITCH_H - 2} rx="2" fill="none" stroke="var(--pitch-touchline)" strokeOpacity="0.35" strokeWidth="0.5" />
        {FROM.map((player, i) => {
          const to = TO[i] ?? player;
          return (
            <circle
              key={player.id}
              r="2.6"
              fill="var(--press)"
              className="managers-mini-dot"
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
      <div className="flex flex-col font-mono text-[10px] uppercase tracking-widest">
        <span className="managers-mini-label-a text-pitch-line">{MANAGER_A.name}</span>
        <span className="managers-mini-label-b text-pitch-line">{MANAGER_B.name}</span>
      </div>
    </div>
  );
}
