import { PitchMarkings } from "@/components/pitch/PitchMarkings";

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

      <div
        className="absolute top-1/2 left-1/2 h-[150vh] w-[150vh] opacity-[0.035]"
        style={{ transform: "translate(-50%, -50%) rotate(-9deg)" }}
      >
        <PitchMarkings />
      </div>

      <div
        className="absolute top-[15%] -left-1/3 h-[85vh] w-[85vh] opacity-[0.025]"
        style={{ transform: "rotate(14deg)" }}
      >
        <PitchMarkings />
      </div>

      <div
        className="absolute -right-1/4 bottom-[5%] h-[70vh] w-[70vh] opacity-[0.02]"
        style={{ transform: "rotate(-22deg)" }}
      >
        <PitchMarkings />
      </div>

      <div className="atmosphere-grain absolute inset-0" />
    </div>
  );
}
