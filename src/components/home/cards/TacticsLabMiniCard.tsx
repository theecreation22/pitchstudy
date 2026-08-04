"use client";

import { useTacticsPlaybook } from "@/lib/tactics-lab/usePlaybook";
import { PlaybookThumbnail } from "@/components/tactics-lab/PlaybookThumbnail";

/** Shows the visitor's own most recently saved Tactics Lab page when one exists — otherwise a generic demo thumbnail. Read-only: this lives inside the card's own <a>, so nothing here is interactive on its own. */
export function TacticsLabMiniCard() {
  const { entries } = useTacticsPlaybook();
  const latest = entries.length > 0 ? [...entries].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0] : null;

  if (!latest) {
    return (
      <p className="font-mono text-[10px] uppercase tracking-widest text-pitch-touchline/70">
        Build your first page →
      </p>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <PlaybookThumbnail entry={latest} size={44} />
      <div className="flex flex-col">
        <span className="font-mono text-[10px] uppercase tracking-widest text-defend-bright">
          No. {latest.number}
        </span>
        <span className="text-xs font-semibold text-pitch-line">{latest.name}</span>
      </div>
    </div>
  );
}
