"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { useSync } from "@/lib/sync/SyncProvider";

type Status = "idle" | "sending" | "sent" | "error";

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.07 5.07 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.85A10.98 10.98 0 0 0 12 23z"
      />
      <path
        fill="currentColor"
        d="M5.84 13.09A6.6 6.6 0 0 1 5.5 11c0-.72.13-1.42.34-2.09V6.06H2.18A11 11 0 0 0 1 11c0 1.77.42 3.45 1.18 4.94l3.66-2.85z"
      />
      <path
        fill="currentColor"
        d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.19 14.97 0 12 0 7.7 0 3.99 2.47 2.18 6.06l3.66 2.85C6.71 6.31 9.14 4.75 12 4.75z"
      />
    </svg>
  );
}

/** The sign-in half of "Join the Club": for anyone who already registered on another device and just needs to get back in, whether they're a player, a manager, or just here for the Academy. Registration itself lives at /join. */
export function LoginForm() {
  const searchParams = useSearchParams();
  const linkExpired = searchParams.get("error") === "link-expired";
  const { user } = useSync();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  if (!isSupabaseConfigured) {
    return (
      <div className="flex flex-col gap-3 rounded-lg border border-pitch-touchline/30 bg-pitch-card p-6 text-sm leading-relaxed text-pitch-touchline">
        <p>Accounts aren&apos;t switched on for this squad yet, but everything still works exactly the same as a guest.</p>
        <Link href="/" className="font-display text-xs font-semibold uppercase tracking-widest text-attack">
          ← Back to the pitch
        </Link>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex flex-col gap-3 rounded-lg border border-pitch-touchline/30 bg-pitch-card p-6 text-sm leading-relaxed text-pitch-touchline">
        <p>You&apos;re already logged in as {user.email}.</p>
        <Link href="/account" className="font-display text-xs font-semibold uppercase tracking-widest text-attack">
          Go to your account →
        </Link>
      </div>
    );
  }

  async function handleMagicLink(event: FormEvent) {
    event.preventDefault();
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    setStatus("sending");
    setErrorMessage("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/account` },
    });
    if (error) {
      setStatus("error");
      setErrorMessage(error.message);
      return;
    }
    setStatus("sent");
  }

  async function handleGoogle() {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/account` },
    });
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col gap-3 rounded-lg border border-attack/40 bg-attack/10 p-6 text-sm leading-relaxed text-pitch-line">
        <p className="font-display text-lg font-bold uppercase tracking-tight">Check your inbox.</p>
        <p>We sent a sign-in link to {email}. Tap it on this device or any other to get back to your progress.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {linkExpired && (
        <p className="rounded-md border border-press/40 bg-press/10 px-4 py-3 text-sm text-pitch-line">
          That link expired. Request a new one below.
        </p>
      )}

      <button
        type="button"
        onClick={handleGoogle}
        className="flex min-h-11 items-center justify-center gap-2 rounded-full border border-pitch-touchline/40 bg-pitch-card px-6 font-mono text-xs font-semibold uppercase tracking-widest text-pitch-line transition-colors hover:border-pitch-marker focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
      >
        <GoogleMark />
        Continue with Google
      </button>

      <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-pitch-touchline/60">
        <span className="h-px flex-1 bg-pitch-touchline/20" />
        or
        <span className="h-px flex-1 bg-pitch-touchline/20" />
      </div>

      <form onSubmit={handleMagicLink} className="flex flex-col gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="rounded-full border border-pitch-touchline/40 bg-pitch-card px-5 py-2.5 text-sm text-pitch-line placeholder:text-pitch-touchline/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
        />
        {status === "error" && <p className="text-sm text-press">{errorMessage}</p>}
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-attack px-8 font-mono text-xs font-semibold uppercase tracking-widest text-night-950 disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send sign-in link"}
        </button>
      </form>

      <p className="text-center text-xs text-pitch-touchline/70">
        New here? <Link href="/join" className="text-attack">Join the club</Link> instead.
      </p>
    </div>
  );
}
