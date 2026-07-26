import type { Zone } from "@/lib/positions";

const PITCH_W = 68;
const PITCH_H = 105;

type Props = {
  zones: Zone[];
};

export function ZoneDiagram({ zones }: Props) {
  return (
    <svg
      viewBox={`0 0 ${PITCH_W} ${PITCH_H}`}
      className="mx-auto w-full max-w-[160px]"
      aria-hidden="true"
    >
      <defs>
        <filter id="zone-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
      </defs>

      <rect x="0" y="0" width={PITCH_W} height={PITCH_H} rx="1.5" fill="var(--pitch-slate)" />

      <g fill="none" stroke="var(--pitch-touchline)" strokeWidth="0.3" strokeOpacity="0.5">
        <rect x="1" y="1" width={PITCH_W - 2} height={PITCH_H - 2} />
        <line x1="1" y1={PITCH_H / 2} x2={PITCH_W - 1} y2={PITCH_H / 2} />
        <rect x="13.84" y="1" width="40.32" height="16.5" />
        <rect x="13.84" y={PITCH_H - 17.5} width="40.32" height="16.5" />
      </g>

      {zones.map((zone, index) => (
        <rect
          key={index}
          x={(zone.x / 100) * PITCH_W}
          y={(zone.y / 100) * PITCH_H}
          width={(zone.width / 100) * PITCH_W}
          height={(zone.height / 100) * PITCH_H}
          rx="3"
          fill="var(--pitch-marker)"
          fillOpacity="0.4"
          filter="url(#zone-glow)"
        />
      ))}
    </svg>
  );
}
