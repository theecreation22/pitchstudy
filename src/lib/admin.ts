import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * The one account allowed to see the admin dashboard — checked both here
 * (client-side, just for UI gating/redirects) and, more importantly,
 * inside `admin_stats()` itself in supabase/schema.sql, which is the
 * actual security boundary. The client-side check alone could be bypassed
 * by calling the RPC directly, which is exactly why the database function
 * re-checks `auth.email()` on every call rather than trusting the caller.
 */
export const ADMIN_EMAIL = "dgreatjosh123@gmail.com";

export function isAdminEmail(email: string | null | undefined): boolean {
  return email === ADMIN_EMAIL;
}

export type AdminStats = {
  totalUsers: number;
  signupsLast7Days: number;
  signupsLast30Days: number;
  usersWithPlayerCard: number;
  usersWithUsername: number;
  totalXp: number;
  totalLessonsCompleted: number;
  totalBadgesEarned: number;
  totalScenarioSaves: number;
  totalPlaybookEntries: number;
  providerBreakdown: Record<string, number>;
  /** auth.users rows with no matching profiles row — people who authenticated but dropped off before the app created their profile. Absent until the updated admin_stats() SQL is applied. */
  authAccountsWithoutProfile?: number;
};

/** Calls admin_stats() (supabase/schema.sql) — returns null on any failure, including the expected "not authorized" case for every non-admin caller, so a rejected call reads the same as a network error rather than leaking *why* it failed. */
export async function fetchAdminStats(supabase: SupabaseClient): Promise<AdminStats | null> {
  const { data, error } = await supabase.rpc("admin_stats");
  if (error || !data) return null;
  return data as AdminStats;
}

export type AdminUser = {
  username: string | null;
  email: string | null;
  created_at: string;
};

/** Calls admin_list_users() — same not-authorized-reads-as-failure behavior as fetchAdminStats above. */
export async function fetchAdminUsers(supabase: SupabaseClient): Promise<AdminUser[] | null> {
  const { data, error } = await supabase.rpc("admin_list_users");
  if (error || !data) return null;
  return data as AdminUser[];
}
