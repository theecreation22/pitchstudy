import type { SupabaseClient } from "@supabase/supabase-js";
import type { PlayerCard } from "@/lib/playerCard";
import type { ProgressState } from "@/lib/progress";
import type { SavedPlay } from "@/lib/scenario-mode/persistence";
import type { CloudProfile, LocalSnapshot } from "./types";

type ProfileRow = {
  id: string;
  email: string | null;
  squad_number: number | null;
  player_card: PlayerCard | null;
  progress: ProgressState | null;
  playbook: SavedPlay[] | null;
  updated_at: string;
};

function rowToCloudProfile(row: ProfileRow): CloudProfile {
  return {
    id: row.id,
    email: row.email,
    squadNumber: row.squad_number,
    playerCard: row.player_card,
    progress: row.progress,
    playbook: row.playbook,
    updatedAt: row.updated_at,
  };
}

/** Reads this user's row, or null if they've never synced before (a brand-new account, or a returning user hitting a fresh row). */
export async function fetchCloudProfile(supabase: SupabaseClient, userId: string): Promise<CloudProfile | null> {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (error || !data) return null;
  return rowToCloudProfile(data as ProfileRow);
}

/**
 * Upserts the whole row. Doubles as row creation — the first push after a
 * brand-new sign-up has no existing row, so this one statement both
 * registers the account's cloud profile and syncs it, with no separate
 * "create profile" step.
 */
export async function pushCloudProfile(
  supabase: SupabaseClient,
  userId: string,
  email: string | null,
  snapshot: LocalSnapshot,
): Promise<void> {
  await supabase.from("profiles").upsert({
    id: userId,
    email,
    squad_number: snapshot.playerCard?.squadNumber ?? null,
    player_card: snapshot.playerCard ?? null,
    progress: snapshot.progress,
    playbook: snapshot.playbook,
  });
}

export async function deleteCloudProfile(supabase: SupabaseClient, userId: string): Promise<void> {
  await supabase.from("profiles").delete().eq("id", userId);
}
