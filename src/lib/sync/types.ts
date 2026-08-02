import type { PlayerCard } from "@/lib/playerCard";
import type { ProgressState } from "@/lib/progress";
import type { SavedPlay } from "@/lib/scenario-mode/persistence";
import type { PlaybookEntry } from "@/lib/tactics-lab/playbookSchema";

/** The shape of one `profiles` row (supabase/schema.sql), as seen by the app after camelCasing the jsonb columns. */
export type CloudProfile = {
  id: string;
  email: string | null;
  username: string | null;
  squadNumber: number | null;
  playerCard: PlayerCard | null;
  progress: ProgressState | null;
  playbook: SavedPlay[] | null;
  /** The general Tactics Lab Playbook (formations + plays) — a separate collection from `playbook` above (the older, scenario-attempt-only list), kept distinct since the two hold structurally different entries. */
  tacticsPlaybook: PlaybookEntry[] | null;
  updatedAt: string;
};

/** Everything a device holds locally, gathered from the four independent localStorage slices that get synced. */
export type LocalSnapshot = {
  playerCard: PlayerCard | undefined;
  progress: ProgressState;
  playbook: SavedPlay[];
  tacticsPlaybook: PlaybookEntry[];
};

export type MergeResult = {
  playerCard: PlayerCard | undefined;
  progress: ProgressState;
  playbook: SavedPlay[];
  tacticsPlaybook: PlaybookEntry[];
  /** True when both sides already had real progress before merging — the signal the "Get Started" reveal uses to show a merge summary instead of a plain welcome. */
  hadConflict: boolean;
};
