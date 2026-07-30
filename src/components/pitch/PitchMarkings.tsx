/** Static hand-drawn pitch line art — the board itself, no interactivity. */
export function PitchMarkings() {
  return (
    <svg
      viewBox="0 0 68 105"
      className="absolute inset-0 h-full w-full overflow-visible"
      aria-hidden="true"
    >
      <defs>
        <filter id="pitchstudy-chalk" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            seed="7"
            result="noise"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.9" />
        </filter>
      </defs>

      <rect x="0" y="0" width="68" height="105" rx="1.5" fill="var(--pitch-deep)" />

      <g
        fill="none"
        stroke="var(--pitch-line)"
        strokeWidth="0.35"
        strokeLinecap="round"
        strokeOpacity="0.55"
        filter="url(#pitchstudy-chalk)"
      >
        <rect className="pitch-draw" x="1" y="1" width="66" height="103" pathLength={1} />
        <line className="pitch-draw" x1="1" y1="52.5" x2="67" y2="52.5" pathLength={1} />
        <circle className="pitch-draw" cx="34" cy="52.5" r="9.15" pathLength={1} />

        <rect className="pitch-draw" x="13.84" y="1" width="40.32" height="16.5" pathLength={1} />
        <rect className="pitch-draw" x="24.84" y="1" width="18.32" height="5.5" pathLength={1} />
        <path className="pitch-draw" d="M 24.85 17.5 A 9.15 9.15 0 0 0 43.15 17.5" pathLength={1} />

        <rect className="pitch-draw" x="13.84" y="87.5" width="40.32" height="16.5" pathLength={1} />
        <rect className="pitch-draw" x="24.84" y="98.5" width="18.32" height="5.5" pathLength={1} />
        <path className="pitch-draw" d="M 24.85 87.5 A 9.15 9.15 0 0 1 43.15 87.5" pathLength={1} />

        <path className="pitch-draw" d="M 1 3 A 2 2 0 0 0 3 1" pathLength={1} />
        <path className="pitch-draw" d="M 65 1 A 2 2 0 0 0 67 3" pathLength={1} />
        <path className="pitch-draw" d="M 67 102 A 2 2 0 0 0 65 104" pathLength={1} />
        <path className="pitch-draw" d="M 3 104 A 2 2 0 0 0 1 102" pathLength={1} />
      </g>

      <circle cx="34" cy="52.5" r="0.4" fill="var(--pitch-line)" fillOpacity="0.55" />
      <circle cx="34" cy="11" r="0.4" fill="var(--pitch-line)" fillOpacity="0.55" />
      <circle cx="34" cy="94" r="0.4" fill="var(--pitch-line)" fillOpacity="0.55" />
    </svg>
  );
}
