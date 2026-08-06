/**
 * Ambient chalkboard for the background atmosphere — a complete 4-3-3 drawn
 * the way a coach actually builds one on a board: unit by unit, back to
 * front, on clean horizontal lines, then the opposition block, then the
 * movement on top.
 *
 * "Organized yet full": every marker sits on one of four shared y-lines and
 * an even x-rhythm, so the board reads as structure rather than scribble
 * even though it carries a full 11 plus an opposition shape. Animation
 * delays run in drawing order (defence 0s -> midfield -> attack ->
 * connections -> opposition -> movement), so the build-up itself is legible.
 *
 * Same hand-drawn grammar as PitchMarkings (turbulence-displaced strokes).
 * Server-renderable; the global prefers-reduced-motion override freezes the
 * CSS animation that drives it.
 */

/** Shared y-lines — every marker sits on one of these, never between them. */
const LINE_DEF = 84;
const LINE_MID = 62;
const LINE_ATT = 38;
const LINE_OPP = 20;

const DEFENDERS = [12, 26.7, 41.3, 56];
const MIDFIELDERS = [20, 34, 48];
const ATTACKERS = [16, 34, 52];
const OPPONENTS = [20, 34, 48];

const MARKER_R = 2.4;

/** Cross arm length for opposition X's. */
const X_ARM = 2.4;

export function ChalkTacticsBoard() {
  return (
    <svg viewBox="0 0 68 105" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
      <defs>
        <filter id="chalk-tactics-rough" x="-10%" y="-10%" width="120%" height="120%">
          {/* Finer, shallower displacement than PitchMarkings' own filter:
              this board is scaled up to ~150vh, so the same settings there
              would smear each marker into a blob at this magnification. */}
          <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="2" seed="11" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.45" />
        </filter>
      </defs>

      <g
        fill="none"
        stroke="var(--chalk)"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#chalk-tactics-rough)"
      >
        {/* Unit 1 — back four, drawn first. */}
        {DEFENDERS.map((x, i) => (
          <circle
            key={`def-${x}`}
            className="chalk-ambient"
            cx={x}
            cy={LINE_DEF}
            r={MARKER_R}
            pathLength={1}
            style={{ animationDelay: `${i * 0.5}s` }}
          />
        ))}

        {/* Unit 2 — midfield three. */}
        {MIDFIELDERS.map((x, i) => (
          <circle
            key={`mid-${x}`}
            className="chalk-ambient"
            cx={x}
            cy={LINE_MID}
            r={MARKER_R}
            pathLength={1}
            style={{ animationDelay: `${2.4 + i * 0.5}s` }}
          />
        ))}

        {/* Unit 3 — front three. */}
        {ATTACKERS.map((x, i) => (
          <circle
            key={`att-${x}`}
            className="chalk-ambient"
            cx={x}
            cy={LINE_ATT}
            r={MARKER_R}
            pathLength={1}
            style={{ animationDelay: `${4.2 + i * 0.5}s` }}
          />
        ))}

        {/* The lines that make it a shape rather than ten dots — each unit
            joined along its own y-line, so the geometry stays flat and read
            as a bank. */}
        <path
          className="chalk-ambient"
          d={`M ${DEFENDERS[0] + MARKER_R} ${LINE_DEF} H ${DEFENDERS[3] - MARKER_R}`}
          strokeWidth="0.32"
          pathLength={1}
          style={{ animationDelay: "6s" }}
        />
        <path
          className="chalk-ambient"
          d={`M ${MIDFIELDERS[0] + MARKER_R} ${LINE_MID} H ${MIDFIELDERS[2] - MARKER_R}`}
          strokeWidth="0.32"
          pathLength={1}
          style={{ animationDelay: "6.4s" }}
        />
        <path
          className="chalk-ambient"
          d={`M ${ATTACKERS[0] + MARKER_R} ${LINE_ATT} H ${ATTACKERS[2] - MARKER_R}`}
          strokeWidth="0.32"
          pathLength={1}
          style={{ animationDelay: "6.8s" }}
        />

        {/* Opposition block — X's on their own line, same x-rhythm as the
            midfield so the two shapes visibly relate. */}
        {OPPONENTS.map((x, i) => (
          <path
            key={`opp-${x}`}
            className="chalk-ambient"
            d={`M ${x - X_ARM} ${LINE_OPP - X_ARM} L ${x + X_ARM} ${LINE_OPP + X_ARM} M ${x + X_ARM} ${LINE_OPP - X_ARM} L ${x - X_ARM} ${LINE_OPP + X_ARM}`}
            pathLength={1}
            style={{ animationDelay: `${8 + i * 0.5}s` }}
          />
        ))}

        {/* Passing lane — dashed, defence into midfield, with its arrowhead. */}
        <path
          className="chalk-ambient"
          d={`M ${DEFENDERS[1]} ${LINE_DEF - MARKER_R - 1} Q ${DEFENDERS[1] - 6} ${(LINE_DEF + LINE_MID) / 2}, ${MIDFIELDERS[0]} ${LINE_MID + MARKER_R + 1.5}`}
          strokeDasharray="2.2 1.8"
          strokeWidth="0.42"
          pathLength={1}
          style={{ animationDelay: "10s" }}
        />
        <path
          className="chalk-ambient"
          d={`M ${MIDFIELDERS[0] - 2.2} ${LINE_MID + MARKER_R + 3.4} L ${MIDFIELDERS[0]} ${LINE_MID + MARKER_R + 1} L ${MIDFIELDERS[0] + 2.2} ${LINE_MID + MARKER_R + 3.2}`}
          strokeWidth="0.42"
          pathLength={1}
          style={{ animationDelay: "11.4s" }}
        />
      </g>

      {/* The runs — the only cyan strokes, matching the accent the telemetry
          world reserves for attack. Two wide runs, mirrored, so the movement
          reads as a designed pattern instead of one stray arrow. */}
      <g
        fill="none"
        stroke="var(--attack)"
        strokeWidth="0.55"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#chalk-tactics-rough)"
      >
        <path
          className="chalk-ambient"
          d={`M ${ATTACKERS[0]} ${LINE_ATT - MARKER_R - 1} Q ${ATTACKERS[0] - 3} ${LINE_ATT - 10}, ${ATTACKERS[0] + 2} ${LINE_OPP + 6}`}
          pathLength={1}
          style={{ animationDelay: "12.6s" }}
        />
        <path
          className="chalk-ambient"
          d={`M ${ATTACKERS[0] - 0.4} ${LINE_OPP + 8.4} L ${ATTACKERS[0] + 2} ${LINE_OPP + 5.6} L ${ATTACKERS[0] + 4.2} ${LINE_OPP + 8}`}
          pathLength={1}
          style={{ animationDelay: "13.8s" }}
        />

        <path
          className="chalk-ambient"
          d={`M ${ATTACKERS[2]} ${LINE_ATT - MARKER_R - 1} Q ${ATTACKERS[2] + 3} ${LINE_ATT - 10}, ${ATTACKERS[2] - 2} ${LINE_OPP + 6}`}
          pathLength={1}
          style={{ animationDelay: "13.2s" }}
        />
        <path
          className="chalk-ambient"
          d={`M ${ATTACKERS[2] - 4.2} ${LINE_OPP + 8} L ${ATTACKERS[2] - 2} ${LINE_OPP + 5.6} L ${ATTACKERS[2] + 0.4} ${LINE_OPP + 8.4}`}
          pathLength={1}
          style={{ animationDelay: "14.4s" }}
        />
      </g>
    </svg>
  );
}
