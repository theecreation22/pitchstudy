"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { emailForUsername } from "@/lib/sync/cloudProfile";
import { useSync } from "@/lib/sync/SyncProvider";
import { GoogleMark } from "./GoogleMark";

type Status = "idle" | "sending" | "sent" | "error";
type LoginMethod = "magic" | "password";

/** The sign-in half of "Join the Club": for anyone who already registered on another device and just needs to get back in, whether they're a player, a manager, or just here for the Academy. Registration itself lives at /join. */
export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const linkExpired = searchParams.get("error") === "link-expired";
  const { user } = useSync();
  const [email, setEmail] = useState("");
  const [method, setMethod] = useState<LoginMethod>("magic");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
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

  async function handlePasswordLogin(event: FormEvent) {
    event.preventDefault();
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    setStatus("sending");
    setErrorMessage("");

    let resolvedEmail = identifier.trim();
    if (!resolvedEmail.includes("@")) {
      // Not an email — treat it as a username and resolve it server-side
      // via the security-definer lookup (supabase/schema.sql), which never
      // exposes anyone else's email to the client beyond this one match.
      const found = await emailForUsername(supabase, resolvedEmail);
      if (!found) {
        setStatus("error");
        setErrorMessage("No account found for that username.");
        return;
      }
      resolvedEmail = found;
    }

    const { error } = await supabase.auth.signInWithPassword({ email: resolvedEmail, password });
    if (error) {
      setStatus("error");
      setErrorMessage(error.message);
      return;
    }
    setStatus("idle");
    router.push("/account");
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

      <div className="flex justify-center gap-4 font-mono text-xs uppercase tracking-widest">
        <button
          type="button"
          onClick={() => setMethod("magic")}
          className={method === "magic" ? "text-attack" : "text-pitch-touchline hover:text-pitch-line"}
        >
          Email link
        </button>
        <button
          type="button"
          onClick={() => setMethod("password")}
          className={method === "password" ? "text-attack" : "text-pitch-touchline hover:text-pitch-line"}
        >
          Username or email
        </button>
      </div>

      {method === "magic" ? (
        <form onSubmit={handleMagicLink} className="flex flex-col gap-3">
          <label htmlFor="login-email-magic" className="sr-only">
            Email
          </label>
          <input
            id="login-email-magic"
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
      ) : (
        <form onSubmit={handlePasswordLogin} className="flex flex-col gap-3">
          <label htmlFor="login-identifier" className="sr-only">
            Username or email
          </label>
          <input
            id="login-identifier"
            required
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            placeholder="Username or email"
            className="rounded-full border border-pitch-touchline/40 bg-pitch-card px-5 py-2.5 text-sm text-pitch-line placeholder:text-pitch-touchline/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
          />
          <label htmlFor="login-password" className="sr-only">
            Password
          </label>
          <input
            id="login-password"
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            className="rounded-full border border-pitch-touchline/40 bg-pitch-card px-5 py-2.5 text-sm text-pitch-line placeholder:text-pitch-touchline/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
          />
          {status === "error" && <p className="text-sm text-press">{errorMessage}</p>}
          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-attack px-8 font-mono text-xs font-semibold uppercase tracking-widest text-night-950 disabled:opacity-60"
          >
            {status === "sending" ? "Signing in…" : "Log in"}
          </button>
        </form>
      )}

      <p className="text-center text-xs text-pitch-touchline/70">
        New here? <Link href="/join" className="text-attack">Join the club</Link> instead.
      </p>
    </div>
  );
}
