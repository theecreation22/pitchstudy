import { PitchMarkings } from "@/components/pitch/PitchMarkings";
import { ChalkTacticsBoard } from "@/components/effects/ChalkTacticsBoard";

/**
 * Shared atmospheric layer mounted once in the root layout. Pitch Telemetry's
 * night sky: an overhead light beam (the page's single light source, matching
 * body's top-lit gradient), two slow-drifting colored light fields — cyan and
 * kit-blue clouds moving on ~90s loops — and the rotated ghost-pitch
 * technical underlay with film grain on top.
 *
 * Server-renderable by design: all motion is plain CSS keyframes
 * (cloud-drift-a/b in globals.css), so the global prefers-reduced-motion
 * override freezes everything with no JS involved.
 */
export function FloodlitAtmosphere() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Drifting light fields — the "weather." */}
      <div
        className="absolute -left-1/4 top-[10%] h-[60vmax] w-[60vmax] rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle closest-side, var(--attack) 0%, transparent 100%)",
          opacity: 0.07,
          animation: "cloud-drift-a 96s ease-in-out infinite",
        }}
      />
      <div
        className="absolute -right-1/4 top-[35%] h-[55vmax] w-[55vmax] rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle closest-side, var(--defend) 0%, transparent 100%)",
          opacity: 0.08,
          animation: "cloud-drift-b 118s ease-in-out infinite",
        }}
      />

      {/* The main board — one big ghost pitch, tilted as if the board were
          set down at an angle. The play below shares this exact transform so
          every marker still lands inside the lines. */}
      <div
        className="absolute top-1/2 left-1/2 h-[150vh] w-[150vh] opacity-[0.06]"
        style={{ transform: "translate(-50%, -50%) rotate(-9deg)" }}
      >
        <PitchMarkings />
      </div>

      {/* Two far-off boards, kept only as depth — small, heavily faded, and
          pushed to the corners so they never compete with the main one. */}
      <div
        className="absolute top-[8%] -left-1/4 h-[55vh] w-[55vh] opacity-[0.03]"
        style={{ transform: "rotate(12deg)" }}
      >
        <PitchMarkings />
      </div>

      <div
        className="absolute -right-1/5 bottom-[4%] h-[50vh] w-[50vh] opacity-[0.025]"
        style={{ transform: "rotate(-16deg)" }}
      >
        <PitchMarkings />
      </div>

      {/* The coach's hand — one full 4-3-3 drawn unit by unit on the main
          board. Transform must stay identical to the ghost pitch above, or
          the play drifts off its own lines. */}
      <div
        className="absolute top-1/2 left-1/2 h-[150vh] w-[150vh] opacity-[0.11]"
        style={{ transform: "translate(-50%, -50%) rotate(-9deg)" }}
      >
        <ChalkTacticsBoard />
      </div>

      <div className="atmosphere-grain absolute inset-0" />
    </div>
  );
}
