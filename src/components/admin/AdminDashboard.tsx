"use client";

import { useEffect, useState } from "react";
import { useSync } from "@/lib/sync/SyncProvider";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { fetchAdminStats, isAdminEmail, type AdminStats } from "@/lib/admin";

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
 * Aggregate-only site stats — never an individual email, username, or
 * progress record. The actual security boundary is admin_stats() itself
 * (supabase/schema.sql, hard-gated to one email server-side); this
 * component's own email check is just what decides whether to bother
 * calling it, not something the data's safety depends on.
 */
export function AdminDashboard() {
  const { status, user } = useSync();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loadState, setLoadState] = useState<LoadState>("idle");

  useEffect(() => {
    if (!user || !isAdminEmail(user.email)) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- kicking off an async fetch in response to `user` becoming available, not deriving state from props during render
    setLoadState("loading");
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setLoadState("error");
      return;
    }
    fetchAdminStats(supabase).then((result) => {
      if (result) {
        setStats(result);
        setLoadState("ready");
      } else {
        setLoadState("error");
      }
    });
  }, [user]);

  if (!isSupabaseConfigured || status === "guest" || !user || !isAdminEmail(user.email)) {
    return <p className="text-sm text-pitch-touchline">Nothing here.</p>;
  }

  if (loadState === "loading" || loadState === "idle") {
    return <p className="text-sm text-pitch-touchline">Loading…</p>;
  }

  if (loadState === "error" || !stats) {
    return <p className="text-sm text-press">Couldn&apos;t load stats — try reloading.</p>;
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
    </div>
  );
}
