"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSync } from "@/lib/sync/SyncProvider";
import { usePlayerCard } from "@/lib/playerCard";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const PROVIDER_LABELS: Record<string, string> = {
  email: "Email link",
  google: "Google",
};

/** The plain-language home for "what does an account actually do here": email, squad number, connected provider, and a working, honest delete path. */
export function AccountView() {
  const router = useRouter();
  const { user, signOut, deleteAccount, setUsername } = useSync();
  const { card, setSquadNumber } = usePlayerCard();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [usernameDraft, setUsernameDraft] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [savingUsername, setSavingUsername] = useState(false);

  // user.username arrives asynchronously (resolved from the cloud profile
  // fetch, not available on the very first render) — sync the draft field
  // once when it shows up, same fix as JoinFlow's squad-number field
  // earlier: a useState initializer here would permanently capture the
  // pre-resolution "undefined".
  const syncedUsername = useRef(false);
  useEffect(() => {
    if (!syncedUsername.current && user?.username) {
      setUsernameDraft(user.username);
      syncedUsername.current = true;
    }
  }, [user?.username]);

  if (!isSupabaseConfigured) {
    return (
      <div className="flex flex-col gap-3 rounded-lg border border-pitch-touchline/30 bg-pitch-card p-6 text-sm leading-relaxed text-pitch-touchline">
        <p>Accounts aren&apos;t switched on for this squad yet.</p>
        <Link href="/" className="font-display text-xs font-semibold uppercase tracking-widest text-attack">
          ← Back to the pitch
        </Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col gap-3 rounded-lg border border-pitch-touchline/30 bg-pitch-card p-6 text-sm leading-relaxed text-pitch-touchline">
        <p>You&apos;re using PitchStudy as a guest, so there&apos;s no account to manage.</p>
        <div className="flex gap-4">
          <Link href="/join" className="font-display text-xs font-semibold uppercase tracking-widest text-attack">
            Join the Club
          </Link>
          <Link href="/login" className="font-display text-xs font-semibold uppercase tracking-widest text-pitch-touchline">
            Log in
          </Link>
        </div>
      </div>
    );
  }

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  async function handleDelete() {
    setDeleting(true);
    await deleteAccount();
    router.push("/");
  }

  async function handleSaveUsername() {
    const trimmed = usernameDraft.trim();
    if (!user || !trimmed || trimmed === user.username) return;
    setSavingUsername(true);
    setUsernameError("");
    const result = await setUsername(trimmed);
    setSavingUsername(false);
    if (result === "taken") setUsernameError("That username is taken.");
    else if (result === "error") setUsernameError("Something went wrong — try again.");
  }

  const providerLabel = user.provider ? (PROVIDER_LABELS[user.provider] ?? user.provider) : "Unknown";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-lg border border-pitch-touchline/30 bg-pitch-card p-6">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase tracking-widest text-pitch-touchline">Username</span>
          <div className="flex items-center gap-3">
            <input
              value={usernameDraft}
              onChange={(event) => setUsernameDraft(event.target.value)}
              minLength={3}
              maxLength={20}
              pattern="[a-zA-Z0-9_]+"
              placeholder="username"
              className="w-48 rounded-full border border-pitch-touchline/40 bg-pitch-slate px-4 py-1.5 text-sm text-pitch-line focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
            />
            {usernameDraft.trim() && usernameDraft.trim() !== user.username && (
              <button
                type="button"
                onClick={handleSaveUsername}
                disabled={savingUsername}
                className="inline-flex min-h-9 items-center rounded-full border border-attack/60 px-4 font-mono text-xs uppercase tracking-widest text-attack hover:bg-attack/10 disabled:opacity-60"
              >
                {savingUsername ? "Saving…" : "Save"}
              </button>
            )}
          </div>
          {usernameError && <span className="text-xs text-press">{usernameError}</span>}
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase tracking-widest text-pitch-touchline">Email</span>
          <span className="text-sm text-pitch-line">{user.email ?? "-"}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase tracking-widest text-pitch-touchline">Connected via</span>
          <span className="text-sm text-pitch-line">{providerLabel}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase tracking-widest text-pitch-touchline">Squad number</span>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={1}
              max={99}
              value={card?.squadNumber ?? ""}
              onChange={(event) => {
                const next = Number(event.target.value);
                if (!Number.isNaN(next) && next >= 1 && next <= 99) setSquadNumber(next);
              }}
              disabled={!card}
              className="w-20 rounded-full border border-pitch-touchline/40 bg-pitch-slate px-4 py-1.5 text-center text-sm text-pitch-line focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker disabled:opacity-50"
            />
            {!card && <span className="text-xs text-pitch-touchline/70">Build a Player Card first.</span>}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-pitch-touchline/20 bg-pitch-card/50 p-5 text-sm leading-relaxed text-pitch-touchline">
        Your Player Card, training progress, and Tactics Lab playbook are stored here so they can follow you to
        another device. Only your account can read or write it, and nobody else can see it.
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleSignOut}
          className="inline-flex min-h-11 items-center rounded-full border border-pitch-touchline/40 px-6 font-mono text-xs uppercase tracking-widest text-pitch-touchline hover:border-pitch-marker hover:text-pitch-marker"
        >
          Sign out
        </button>
        {!confirmingDelete ? (
          <button
            type="button"
            onClick={() => setConfirmingDelete(true)}
            className="inline-flex min-h-11 items-center rounded-full border border-press/50 px-6 font-mono text-xs uppercase tracking-widest text-press hover:bg-press/10"
          >
            Delete account
          </button>
        ) : (
          <div className="flex flex-col gap-2 rounded-lg border border-press/40 bg-press/10 p-4">
            <p className="text-sm text-pitch-line">
              This deletes your synced copy in the cloud. Everything on this device stays exactly as it is.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex min-h-9 items-center rounded-full bg-press px-5 font-mono text-xs font-semibold uppercase tracking-widest text-night-950 disabled:opacity-60"
              >
                {deleting ? "Deleting…" : "Confirm delete"}
              </button>
              <button
                type="button"
                onClick={() => setConfirmingDelete(false)}
                className="inline-flex min-h-9 items-center rounded-full px-5 font-mono text-xs uppercase tracking-widest text-pitch-touchline hover:text-pitch-marker"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
