"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { usePlayerCard } from "@/lib/playerCard";
import { useProgress } from "@/lib/progress";
import { usePlaybook } from "@/lib/scenario-mode/persistence";
import { useTacticsPlaybook } from "@/lib/tactics-lab/usePlaybook";
import { mergeProfiles } from "./mergeProfiles";
import { deleteCloudProfile, fetchCloudProfile, pushCloudProfile } from "./cloudProfile";
import type { LocalSnapshot, MergeResult } from "./types";

export type SyncStatus = "disabled" | "guest" | "syncing" | "synced" | "error";

export type CloudUser = { id: string; email: string | null; provider: string | null };

const PUSH_DEBOUNCE_MS = 1500;

/**
 * Owns the entire "Join the Club" sync lifecycle for one browser tab: it
 * watches auth state, merges local progress into whatever's already in the
 * cloud the moment a user signs in (never overwriting, only combining — see
 * mergeProfiles.ts), and quietly re-pushes local changes afterwards.
 *
 * Guest mode never touches this beyond the disabled/guest status — every
 * localStorage read/write still goes through usePlayerCard/useProgress/
 * usePlaybook exactly as it did before accounts existed.
 */
export function useCloudSync() {
  const { card, replace: replaceCard } = usePlayerCard();
  const { state: progressState, replace: replaceProgress } = useProgress();
  const { plays, replaceAll: replacePlaybook } = usePlaybook();
  const { entries: tacticsPlaybookEntries, replaceAll: replaceTacticsPlaybook } = useTacticsPlaybook();

  const [status, setStatus] = useState<SyncStatus>(isSupabaseConfigured ? "guest" : "disabled");
  const [user, setUser] = useState<CloudUser | null>(null);
  const [lastMerge, setLastMerge] = useState<MergeResult | null>(null);

  // Which user id we've already pulled + merged for — guards against
  // re-running the merge on every unrelated auth event for the same session.
  const syncedUserRef = useRef<string | null>(null);
  const pushTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Local values change on every keystroke/checkbox; refs let the debounced
  // push always read the latest snapshot without re-subscribing constantly.
  const localRef = useRef<LocalSnapshot>({
    playerCard: card,
    progress: progressState,
    playbook: plays,
    tacticsPlaybook: tacticsPlaybookEntries,
  });
  useEffect(() => {
    localRef.current = { playerCard: card, progress: progressState, playbook: plays, tacticsPlaybook: tacticsPlaybookEntries };
  }, [card, progressState, plays, tacticsPlaybookEntries]);

  const runInitialMerge = useCallback(
    async (userId: string, email: string | null) => {
      setStatus("syncing");
      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        setStatus("error");
        return;
      }
      const cloud = await fetchCloudProfile(supabase, userId);
      const merged = mergeProfiles(localRef.current, cloud);
      if (merged.playerCard) replaceCard(merged.playerCard);
      replaceProgress(merged.progress);
      replacePlaybook(merged.playbook);
      replaceTacticsPlaybook(merged.tacticsPlaybook);
      setLastMerge(merged);
      await pushCloudProfile(supabase, userId, email, {
        playerCard: merged.playerCard,
        progress: merged.progress,
        playbook: merged.playbook,
        tacticsPlaybook: merged.tacticsPlaybook,
      });
      setStatus("synced");
    },
    [replaceCard, replaceProgress, replacePlaybook, replaceTacticsPlaybook],
  );

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    function handleUser(
      authUser: { id: string; email?: string | null; app_metadata?: { provider?: string } } | null,
    ) {
      if (authUser) {
        setUser({ id: authUser.id, email: authUser.email ?? null, provider: authUser.app_metadata?.provider ?? null });
        if (syncedUserRef.current !== authUser.id) {
          syncedUserRef.current = authUser.id;
          void runInitialMerge(authUser.id, authUser.email ?? null);
        }
      } else {
        setUser(null);
        syncedUserRef.current = null;
        setStatus("guest");
      }
    }

    supabase.auth.getUser().then(({ data }) => handleUser(data.user));

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      handleUser(session?.user ?? null);
    });

    return () => subscription.subscription.unsubscribe();
  }, [runInitialMerge]);

  // Quietly re-push whenever local data changes post-sync (a drill ticked
  // off, a new badge, a fresh scenario save) — never while the initial
  // pull-and-merge is still in flight, so a late local change can't race
  // ahead of it and get overwritten.
  useEffect(() => {
    if (!user || status === "syncing" || status === "disabled") return;
    if (pushTimerRef.current) clearTimeout(pushTimerRef.current);
    const userId = user.id;
    const email = user.email;
    pushTimerRef.current = setTimeout(() => {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) return;
      void pushCloudProfile(supabase, userId, email, localRef.current);
    }, PUSH_DEBOUNCE_MS);
    return () => {
      if (pushTimerRef.current) clearTimeout(pushTimerRef.current);
    };
  }, [user, card, progressState, plays, tacticsPlaybookEntries, status]);

  const signOut = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    await supabase.auth.signOut();
  }, []);

  /** Deletes the cloud row and signs out. Local progress is left untouched — the account going away doesn't take a player's training history with it. */
  const deleteAccount = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase || !user) return;
    await deleteCloudProfile(supabase, user.id);
    await supabase.auth.signOut();
  }, [user]);

  return { status, user, lastMerge, signOut, deleteAccount };
}
