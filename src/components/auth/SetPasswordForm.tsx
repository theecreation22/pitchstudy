"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const MIN_LENGTH = 8;

type State = "checking" | "ready" | "no-session" | "saving" | "saved" | "error";

/**
 * Sets a new password for the signed-in user.
 *
 * Serves both arrival paths with one form: someone who followed a recovery
 * email (the link exchanges its code at /auth/callback, which leaves a real
 * session behind) and someone already signed in who just wants to change it.
 * Supabase's updateUser is identical in both cases, so there is no reason to
 * build two screens.
 *
 * A recovery session is a genuine session, which is why this checks for one
 * rather than reading a token out of the URL: by the time the page renders,
 * the callback has already done the exchange.
 */
export function SetPasswordForm() {
  const router = useRouter();
  const [state, setState] = useState<State>("checking");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // All state writes happen inside the async body rather than the effect
    // body itself, and `cancelled` stops a late getUser() resolving onto an
    // unmounted form if someone navigates away mid-check.
    let cancelled = false;

    async function checkSession() {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        if (!cancelled) setState("no-session");
        return;
      }
      const { data } = await supabase.auth.getUser();
      if (!cancelled) setState(data.user ? "ready" : "no-session");
    }

    void checkSession();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    if (password.length < MIN_LENGTH) {
      setState("error");
      setErrorMessage(`Password needs to be at least ${MIN_LENGTH} characters.`);
      return;
    }
    if (password !== confirmPassword) {
      setState("error");
      setErrorMessage("Passwords don't match.");
      return;
    }

    setState("saving");
    setErrorMessage("");

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setState("error");
      setErrorMessage(error.message);
      return;
    }
    setState("saved");
  }

  if (state === "checking") {
    return <p className="text-sm text-pitch-touchline">Checking your link…</p>;
  }

  if (state === "no-session") {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm leading-relaxed text-pitch-touchline">
          This reset link has expired or has already been used. Request a new one and it will land in your inbox
          within a minute.
        </p>
        <Link
          href="/login"
          className="inline-flex min-h-11 w-fit items-center rounded-full border border-pitch-marker px-6 font-mono text-xs uppercase tracking-widest text-pitch-marker transition-colors hover:bg-pitch-marker/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
        >
          Back to sign in →
        </Link>
      </div>
    );
  }

  if (state === "saved") {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm leading-relaxed text-pitch-line">
          Password updated. You can use it to sign in from now on.
        </p>
        <button
          type="button"
          onClick={() => router.push("/settings")}
          className="inline-flex min-h-11 w-fit items-center rounded-full border border-attack/60 px-6 font-mono text-xs uppercase tracking-widest text-attack transition-colors hover:bg-attack/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
        >
          Done →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label htmlFor="new-password" className="sr-only">
        New password
      </label>
      <input
        id="new-password"
        type="password"
        autoComplete="new-password"
        required
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder={`New password (${MIN_LENGTH}+ characters)`}
        className="min-h-11 rounded-full border border-pitch-touchline/40 bg-pitch-slate px-5 text-sm text-pitch-line focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
      />
      <label htmlFor="confirm-password" className="sr-only">
        Confirm new password
      </label>
      <input
        id="confirm-password"
        type="password"
        autoComplete="new-password"
        required
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
        placeholder="Confirm new password"
        className="min-h-11 rounded-full border border-pitch-touchline/40 bg-pitch-slate px-5 text-sm text-pitch-line focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
      />
      {errorMessage && <p className="text-xs text-press">{errorMessage}</p>}
      <button
        type="submit"
        disabled={state === "saving"}
        className="inline-flex min-h-11 w-fit items-center rounded-full border border-attack/60 px-6 font-mono text-xs uppercase tracking-widest text-attack transition-colors hover:bg-attack/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker disabled:opacity-60"
      >
        {state === "saving" ? "Saving…" : "Save password"}
      </button>
    </form>
  );
}
