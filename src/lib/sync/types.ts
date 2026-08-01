import type { PlayerCard } from "@/lib/playerCard";
import type { ProgressState } from "@/lib/progress";
import type { SavedPlay } from "@/lib/scenario-mode/persistence";

/** The shape of one `profiles` row (supabase/schema.sql), as seen by the app after camelCasing the jsonb columns. */
export type CloudProfile = {
  id: string;
  email: string | null;
  squadNumber: number | null;
  playerCard: PlayerCard | null;
  progress: ProgressState | null;
  playbook: SavedPlay[] | null;
  updatedAt: string;
};

/** Everything a device holds locally, gathered from the three independent localStorage slices that get synced. */
export type LocalSnapshot = {
  playerCard: PlayerCard | undefined;
  progress: ProgressState;
  playbook: SavedPlay[];
};

export type MergeResult = {
  playerCard: PlayerCard | undefined;
  progress: ProgressState;
  playbook: SavedPlay[];
  /** True when both sides already had real progress before merging — the signal the "Get Started" reveal uses to show a merge summary instead of a plain welcome. */
  hadConflict: boolean;
};
