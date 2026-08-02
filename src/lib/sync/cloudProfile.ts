import type { SupabaseClient } from "@supabase/supabase-js";
import type { PlayerCard } from "@/lib/playerCard";
import type { ProgressState } from "@/lib/progress";
import type { SavedPlay } from "@/lib/scenario-mode/persistence";
import type { PlaybookEntry } from "@/lib/tactics-lab/playbookSchema";
import type { CloudProfile, LocalSnapshot } from "./types";

type ProfileRow = {
  id: string;
  email: string | null;
  username: string | null;
  squad_number: number | null;
  player_card: PlayerCard | null;
  progress: ProgressState | null;
  playbook: SavedPlay[] | null;
  tactics_playbook: PlaybookEntry[] | null;
  updated_at: string;
};

function rowToCloudProfile(row: ProfileRow): CloudProfile {
  return {
    id: row.id,
    email: row.email,
    username: row.username,
    squadNumber: row.squad_number,
    playerCard: row.player_card,
    progress: row.progress,
    playbook: row.playbook,
    tacticsPlaybook: row.tactics_playbook,
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
    tactics_playbook: snapshot.tacticsPlaybook,
  });
}

export async function deleteCloudProfile(supabase: SupabaseClient, userId: string): Promise<void> {
  await supabase.from("profiles").delete().eq("id", userId);
}

/** Resolves a username to its account's email via the `email_for_username` security-definer function (supabase/schema.sql) — the one narrow, deliberate exception to "RLS blocks reading anyone else's row," scoped to exactly this lookup. Returns null if no account has that username. */
export async function emailForUsername(supabase: SupabaseClient, username: string): Promise<string | null> {
  const { data, error } = await supabase.rpc("email_for_username", { lookup_username: username });
  if (error || !data) return null;
  return data as string;
}

export type ClaimUsernameResult = "ok" | "taken" | "error";

/**
 * Sets a user's username — deliberately a separate write from
 * `pushCloudProfile`'s general sync upsert (which never includes
 * `username` in its payload at all, so the routine background push can
 * never accidentally touch it). Uses upsert rather than a plain update
 * since this can run immediately after signup, before the regular sync
 * push has necessarily created the row yet — an update would silently
 * affect zero rows in that race, losing the username with no error. RLS
 * already restricts this to the caller's own row; the table's unique
 * constraint is what actually enforces sitewide uniqueness, surfaced here
 * as a friendly "taken" result rather than a raw Postgres error code
 * leaking to the UI.
 */
export async function claimUsername(supabase: SupabaseClient, userId: string, username: string): Promise<ClaimUsernameResult> {
  const { error } = await supabase.from("profiles").upsert({ id: userId, username });
  if (!error) return "ok";
  // Postgres unique_violation
  if (error.code === "23505") return "taken";
  return "error";
}
