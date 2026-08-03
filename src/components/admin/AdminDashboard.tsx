"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSync } from "@/lib/sync/SyncProvider";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { fetchAdminStats, fetchAdminUsers, isAdminEmail, type AdminStats, type AdminUser } from "@/lib/admin";

/** The same "not available" card treatment LoginForm/AccountView use, so admin's guard states don't stand out as the one screen that skipped it. */
function InfoCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-pitch-touchline/30 bg-pitch-card p-6 text-sm leading-relaxed text-pitch-touchline">
      {children}
    </div>
  );
}

const PROVIDER_LABELS: Record<string, string> = {
  google: "Google",
  email: "Email link / password",
};

function StatTile({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-pitch-touchline/30 bg-pitch-card p-5">
      <span className="font-mono text-[10px] uppercase tracking-widest text-pitch-touchline">{label}</span>
      <span className={`font-display text-3xl font-black sm:text-4xl ${accent ? "text-attack" : "text-pitch-line"}`}>{value}</span>
    </div>
  );
}

type LoadState = "idle" | "loading" | "error" | "ready";

/**
 * Site stats plus a username/email/signup-date list — nothing beyond
 * those fields (no progress, no Player Card, no playbook contents). The
 * actual security boundary is admin_stats()/admin_list_users() themselves
 * (supabase/schema.sql, hard-gated to one email server-side); this
 * component's own email check is just what decides whether to bother
 * calling them, not something the data's safety depends on.
 */
export function AdminDashboard() {
  const { status, user } = useSync();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [loadState, setLoadState] = useState<LoadState>("idle");

  const load = useCallback(() => {
    if (!user || !isAdminEmail(user.email)) return;
    setLoadState("loading");
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setLoadState("error");
      return;
    }
    Promise.all([fetchAdminStats(supabase), fetchAdminUsers(supabase)]).then(([statsResult, usersResult]) => {
      if (statsResult && usersResult) {
        setStats(statsResult);
        setUsers(usersResult);
        setLoadState("ready");
      } else {
        setLoadState("error");
      }
    });
  }, [user]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- kicking off an async fetch in response to `user` becoming available, not deriving state from props during render
    load();
  }, [load]);

  if (!isSupabaseConfigured || status === "guest" || !user || !isAdminEmail(user.email)) {
    return (
      <InfoCard>
        <p>Nothing here.</p>
        <Link href="/" className="font-display text-xs font-semibold uppercase tracking-widest text-attack">
          ← Back to the pitch
        </Link>
      </InfoCard>
    );
  }

  if (loadState === "loading" || loadState === "idle") {
    return <InfoCard><p>Loading…</p></InfoCard>;
  }

  if (loadState === "error" || !stats) {
    return (
      <InfoCard>
        <p className="text-press">Couldn&apos;t load stats.</p>
        <button
          type="button"
          onClick={load}
          className="w-fit font-display text-xs font-semibold uppercase tracking-widest text-attack hover:text-attack-hi focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
        >
          Retry
        </button>
      </InfoCard>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Total users" value={stats.totalUsers} accent />
        <StatTile label="Signups, last 7 days" value={stats.signupsLast7Days} />
        <StatTile label="Signups, last 30 days" value={stats.signupsLast30Days} />
        <StatTile label="Have a username" value={stats.usersWithUsername} />
        <StatTile label="Have a Player Card" value={stats.usersWithPlayerCard} />
        <StatTile label="Total XP earned" value={stats.totalXp.toLocaleString()} accent />
        <StatTile label="Lessons completed" value={stats.totalLessonsCompleted} />
        <StatTile label="Badges earned" value={stats.totalBadgesEarned} />
        <StatTile label="Scenario plays saved" value={stats.totalScenarioSaves} />
        <StatTile label="Playbook entries saved" value={stats.totalPlaybookEntries} />
      </div>

      <div className="rounded-lg border border-pitch-touchline/30 bg-pitch-card p-5">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-pitch-touchline">Signed in via</p>
        {Object.keys(stats.providerBreakdown).length === 0 ? (
          <p className="text-sm text-pitch-touchline">No accounts yet.</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {Object.entries(stats.providerBreakdown).map(([provider, count]) => (
              <div key={provider} className="flex items-center gap-2 rounded-full border border-pitch-touchline/30 px-4 py-1.5">
                <span className="font-mono text-xs uppercase tracking-widest text-pitch-touchline">
                  {PROVIDER_LABELS[provider] ?? provider}
                </span>
                <span className="font-display text-sm font-bold text-pitch-line">{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-lg border border-pitch-touchline/30 bg-pitch-card p-5">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-pitch-touchline">
          Registered users ({users?.length ?? 0})
        </p>
        {!users || users.length === 0 ? (
          <p className="text-sm text-pitch-touchline">No accounts yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-pitch-touchline/30 text-left">
                  <th className="py-2 pr-4 font-mono text-[10px] font-normal uppercase tracking-widest text-pitch-touchline">Username</th>
                  <th className="py-2 pr-4 font-mono text-[10px] font-normal uppercase tracking-widest text-pitch-touchline">Email</th>
                  <th className="py-2 font-mono text-[10px] font-normal uppercase tracking-widest text-pitch-touchline">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={`${u.email}-${i}`} className="border-b border-pitch-touchline/10 last:border-none">
                    <td className="py-2 pr-4 text-pitch-line">{u.username ?? <span className="text-pitch-touchline/60">—</span>}</td>
                    <td className="py-2 pr-4 text-pitch-line">{u.email ?? <span className="text-pitch-touchline/60">—</span>}</td>
                    <td className="py-2 font-mono text-xs text-pitch-touchline">
                      {new Date(u.created_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
