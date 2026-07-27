import { PitchMarkings } from "@/components/pitch/PitchMarkings";

/**
 * Shared atmospheric layer mounted once in the root layout: two fixed
 * corner floodlight cones, an oversized rotated "ghost" pitch texture
 * (reuses the real chalk-line art, not a separate diagram), and a faint
 * animated grain so dark areas never read as flat, empty voids.
 *
 * Static (server-renderable) by design — no motion values, so it costs
 * nothing extra under prefers-reduced-motion. The grain's flicker is a
 * plain CSS animation and is already frozen by the global
 * prefers-reduced-motion override in globals.css.
 */
export function FloodlitAtmosphere() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute -top-1/4 -left-1/4 h-[70vmax] w-[70vmax] rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, var(--attack) 0%, transparent 70%)",
          opacity: 0.06,
        }}
      />
      <div
        className="absolute -top-1/4 -right-1/4 h-[70vmax] w-[70vmax] rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, var(--attack) 0%, transparent 70%)",
          opacity: 0.06,
        }}
      />

      <div
        className="absolute top-1/2 left-1/2 h-[140vh] w-[140vh] -translate-x-1/2 -translate-y-1/2 opacity-[0.05]"
        style={{ transform: "translate(-50%, -50%) rotate(-9deg)" }}
      >
        <PitchMarkings />
      </div>

      <div className="atmosphere-grain absolute inset-0" />
    </div>
  );
}
