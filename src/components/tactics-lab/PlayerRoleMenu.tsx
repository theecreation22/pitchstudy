"use client";

import { positions } from "@/lib/positions";
import type { PositionCode } from "@/lib/formations";

const ROLE_GROUPS: { label: string; codes: PositionCode[] }[] = [
  { label: "Goalkeeper", codes: ["GK", "SK"] },
  { label: "Defense", codes: ["LB", "RB", "CB", "LWB", "RWB", "IFB"] },
  { label: "Midfield", codes: ["CDM", "CM", "CAM", "LM", "RM", "DLP", "B2B"] },
  { label: "Attack", codes: ["LW", "RW", "ST", "IW", "F9"] },
];

type Props = {
  currentRole: PositionCode;
  onSelectRole: (role: PositionCode) => void;
  onClose: () => void;
};

/** Docked role picker for the currently-selected player — a dropdown-equivalent menu grouped by line, using the site's own position dataset for names so hybrid roles (Inverted Full-Back, False 9, etc.) read the same way they do everywhere else on PitchStudy. */
export function PlayerRoleMenu({ currentRole, onSelectRole, onClose }: Props) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-pitch-touchline/30 bg-pitch-card p-4">
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs uppercase tracking-widest text-pitch-marker">
          Assign role — currently {positions[currentRole].name}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="font-mono text-[10px] uppercase tracking-widest text-pitch-touchline transition-colors hover:text-pitch-line"
        >
          Close
        </button>
      </div>
      <div className="flex flex-col gap-3">
        {ROLE_GROUPS.map((group) => (
          <div key={group.label} className="flex flex-col gap-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-pitch-touchline">{group.label}</p>
            <div className="flex flex-wrap gap-1.5">
              {group.codes.map((code) => {
                const isActive = code === currentRole;
                return (
                  <button
                    key={code}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => onSelectRole(code)}
                    className={`min-h-9 rounded-md border px-2.5 font-mono text-xs uppercase tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker ${
                      isActive
                        ? "border-attack bg-attack/15 text-attack"
                        : "border-pitch-touchline/40 text-pitch-touchline hover:border-pitch-touchline hover:text-pitch-line"
                    }`}
                    title={positions[code].name}
                  >
                    {code}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
