"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useSync } from "@/lib/sync/SyncProvider";
import { usePlayerCard } from "@/lib/playerCard";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { claimUsername } from "@/lib/sync/cloudProfile";
import { PENDING_USERNAME_KEY } from "@/lib/sync/useCloudSync";
import { PlayerCardView } from "@/components/workouts/PlayerCardView";
import { GoogleMark } from "./GoogleMark";

type Stage = "tunnel" | "register" | "sent";
type SendStatus = "idle" | "sending" | "error";
type AuthMethod = "magic" | "password";

function StepShell({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
      transition={{ duration: reduceMotion ? 0 : 0.25, ease: "easeOut" }}
      className="flex flex-col items-center gap-6 text-center"
    >
      {children}
    </motion.div>
  );
}

/**
 * The "Join the Club" tunnel (§4 of the accounts spec). Three doors: start
 * training as a guest (no account, ever, if that's what someone wants),
 * register for cross-device sync, or a quiet link back in for a returning
 * player. A Player Card is only one of three things an account can carry:
 * Academy/Quiz progress and the Tactics Lab playbook sync with no card at
 * all, so registration never requires one. Whoever's here (a player, a
 * manager who just uses the Tactics Lab, a fan working through the Academy)
 * gets the same two sign-in options; the card preview and squad number
 * picker only show up if there's already a card to stamp.
 */
export function JoinFlow() {
  const router = useRouter();
  const { status, user, lastMerge, setUsername: setAccountUsername } = useSync();
  const { card, setSquadNumber } = usePlayerCard();
  const [stage, setStage] = useState<Stage>("tunnel");
  const [squadNumber, setSquadNumberInput] = useState(7);
  const [username, setUsernameInput] = useState("");
  const [email, setEmail] = useState("");
  const [authMethod, setAuthMethod] = useState<AuthMethod>("magic");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usernameTakenRetry, setUsernameTakenRetry] = useState(false);
  const [awaitingEmailConfirmation, setAwaitingEmailConfirmation] = useState(false);
  const [sendStatus, setSendStatus] = useState<SendStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const reduceMotion = useReducedMotion();

  // usePlayerCard's `card` reads localStorage via useSyncExternalStore, whose
  // hydration-render snapshot is always "empty" (no localStorage on the
  // server) — a useState initializer reading `card?.squadNumber` here would
  // permanently capture that stale `undefined` and never notice the real
  // value arriving a render later. Syncing once via effect (and never again,
  // so it doesn't clobber whatever the user types afterward) avoids that.
  const syncedSquadNumber = useRef(false);
  useEffect(() => {
    if (!syncedSquadNumber.current && card?.squadNumber) {
      setSquadNumberInput(card.squadNumber);
      syncedSquadNumber.current = true;
    }
  }, [card?.squadNumber]);

  async function handleUsernameRetry(event: FormEvent) {
    event.preventDefault();
    if (!username.trim()) return;
    setSendStatus("sending");
    setErrorMessage("");
    const result = await setAccountUsername(username.trim());
    if (result === "taken") {
      setSendStatus("error");
      setErrorMessage("Still taken — try another.");
      return;
    }
    if (result === "error") {
      setSendStatus("error");
      setErrorMessage("Something went wrong — try again.");
      return;
    }
    setSendStatus("idle");
    setUsernameTakenRetry(false);
  }

  if (user) {
    const isSyncing = status === "syncing";

    if (usernameTakenRetry) {
      return (
        <StepShell>
          <p className="font-mono text-xs uppercase tracking-widest text-attack">Almost there</p>
          <h1 className="text-grad-attack font-display text-3xl font-black uppercase leading-none tracking-tight sm:text-4xl">
            Pick a different username.
          </h1>
          <p className="max-w-sm text-sm leading-relaxed text-pitch-touchline">
            Your account&apos;s created — that username&apos;s just already taken.
          </p>
          <form onSubmit={handleUsernameRetry} className="flex w-full max-w-sm flex-col gap-3">
            <label htmlFor="username-retry" className="sr-only">
              Username
            </label>
            <input
              id="username-retry"
              value={username}
              onChange={(event) => setUsernameInput(event.target.value)}
              required
              minLength={3}
              maxLength={20}
              pattern="[a-zA-Z0-9_]+"
              placeholder="username"
              className="rounded-full border border-pitch-touchline/40 bg-pitch-card px-5 py-2.5 text-center text-sm text-pitch-line placeholder:text-pitch-touchline/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
            />
            {sendStatus === "error" && <p className="text-sm text-press">{errorMessage}</p>}
            <button
              type="submit"
              disabled={sendStatus === "sending"}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-attack px-8 font-mono text-xs font-semibold uppercase tracking-widest text-night-950 shadow-[0_0_32px_-8px_var(--attack)] transition-transform hover:scale-[1.02] disabled:opacity-60"
            >
              {sendStatus === "sending" ? "Saving…" : "Save username"}
            </button>
          </form>
        </StepShell>
      );
    }

    return (
      <StepShell>
        <p className="font-mono text-xs uppercase tracking-widest text-attack">
          {isSyncing ? "One second…" : "You're in."}
        </p>
        <h1 className="text-grad-attack font-display text-3xl font-black uppercase leading-none tracking-tight sm:text-4xl">
          {isSyncing ? "Combining your progress." : "Welcome to the club."}
        </h1>
        {card && !isSyncing && (
          <div className="w-full max-w-xl">
            <PlayerCardView card={card} />
          </div>
        )}
        {!isSyncing && lastMerge?.hadConflict && (
          <p className="max-w-md rounded-lg border border-attack/40 bg-attack/10 px-5 py-3 text-sm leading-relaxed text-pitch-line">
            We found progress on this account from another device and combined it here. Nothing was lost from either
            side.
          </p>
        )}
        {!isSyncing && (
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/workouts"
              className="inline-flex min-h-11 items-center rounded-full bg-attack px-8 font-mono text-xs font-semibold uppercase tracking-widest text-night-950 shadow-[0_0_32px_-8px_var(--attack)] transition-transform hover:scale-[1.02]"
            >
              Get to training →
            </Link>
            <Link
              href="/account"
              className="inline-flex min-h-11 items-center rounded-full border border-pitch-touchline/40 px-6 font-mono text-xs uppercase tracking-widest text-pitch-touchline hover:border-pitch-marker hover:text-pitch-marker"
            >
              Account settings
            </Link>
          </div>
        )}
      </StepShell>
    );
  }

  async function handleGoogle() {
    setSquadNumber(squadNumber);
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/join` },
    });
  }

  async function handleMagicLink(event: FormEvent) {
    event.preventDefault();
    setSquadNumber(squadNumber);
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    setSendStatus("sending");
    setErrorMessage("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/join` },
    });
    if (error) {
      setSendStatus("error");
      setErrorMessage(error.message);
      return;
    }
    setStage("sent");
  }

  async function handlePasswordSignup(event: FormEvent) {
    event.preventDefault();
    if (!username.trim()) {
      setSendStatus("error");
      setErrorMessage("Pick a username first.");
      return;
    }
    if (password.length < 8) {
      setSendStatus("error");
      setErrorMessage("Password needs to be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setSendStatus("error");
      setErrorMessage("Passwords don't match.");
      return;
    }
    setSquadNumber(squadNumber);
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    setSendStatus("sending");
    setErrorMessage("");
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/join` },
    });
    if (error) {
      setSendStatus("error");
      setErrorMessage(error.message);
      return;
    }
    if (!data.user) {
      setSendStatus("error");
      setErrorMessage("Something went wrong — try again.");
      return;
    }
    if (data.session) {
      // Signed in immediately — claim the username now while we have a
      // real session; the "You're in" reveal below takes over as soon as
      // useSync's auth listener catches up, no explicit navigation needed.
      const result = await claimUsername(supabase, data.user.id, username.trim());
      setSendStatus("idle");
      if (result === "taken") setUsernameTakenRetry(true);
      return;
    }
    // No session yet — this project requires confirming the email first.
    // The username can't be claimed until then (RLS has no session to
    // authorize the write), so it's stashed for useCloudSync to finish
    // once a real session appears, same as the magic-link "sent" state.
    window.localStorage.setItem(PENDING_USERNAME_KEY, username.trim());
    setSendStatus("idle");
    setAwaitingEmailConfirmation(true);
    setStage("sent");
  }

  return (
    <AnimatePresence mode="wait">
      {stage === "tunnel" && (
        <StepShell key="tunnel">
          <p className="font-mono text-xs uppercase tracking-widest text-attack">Join the Club</p>
          <h1 className="text-grad-attack font-display text-3xl font-black uppercase leading-none tracking-tight sm:text-4xl">
            Three ways in.
          </h1>
          <p className="max-w-sm text-sm leading-relaxed text-pitch-touchline">
            An account carries your progress across devices: lessons, quizzes, badges, your Tactics Lab plays, and
            your Player Card if you&apos;ve built one. Whether you&apos;re training, coaching, or just here to learn,
            it works the same way.
          </p>

          <div className="flex w-full max-w-sm flex-col gap-3">
            <button
              type="button"
              onClick={() => router.push("/workouts")}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-attack px-8 font-mono text-xs font-semibold uppercase tracking-widest text-night-950 shadow-[0_0_32px_-8px_var(--attack)] transition-transform hover:scale-[1.02]"
            >
              Start Training (stay a guest)
            </button>
            <button
              type="button"
              onClick={() => setStage("register")}
              disabled={status === "disabled"}
              className="border-grad-kickoff inline-flex min-h-11 items-center justify-center rounded-full px-8 font-mono text-xs font-semibold uppercase tracking-widest text-attack transition-colors hover:bg-attack/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Join the Club
            </button>
            {status === "disabled" && (
              <p className="text-xs text-pitch-touchline/70">Accounts aren&apos;t switched on for this squad yet.</p>
            )}
          </div>

          {isSupabaseConfigured && (
            <Link
              href="/login"
              className="font-mono text-xs uppercase tracking-widest text-pitch-touchline/70 hover:text-pitch-marker"
            >
              Already registered? Log in
            </Link>
          )}
        </StepShell>
      )}

      {stage === "register" && (
        <StepShell key="register">
          <p className="font-mono text-xs uppercase tracking-widest text-attack">{card ? "Squad Registration" : "Create Your Account"}</p>
          <h1 className="text-grad-attack font-display text-3xl font-black uppercase leading-none tracking-tight sm:text-4xl">
            {card ? "Pick your number." : "Join the club."}
          </h1>

          {card ? (
            <>
              <div className="flex items-center gap-3">
                <label htmlFor="squad-number" className="font-mono text-xs uppercase tracking-widest text-pitch-touchline">
                  Squad #
                </label>
                <input
                  id="squad-number"
                  type="number"
                  min={1}
                  max={99}
                  value={squadNumber}
                  onChange={(event) => {
                    const next = Number(event.target.value);
                    if (!Number.isNaN(next)) setSquadNumberInput(Math.min(99, Math.max(1, next)));
                  }}
                  className="w-20 rounded-full border border-pitch-touchline/40 bg-pitch-card px-4 py-2 text-center text-lg font-bold text-pitch-line focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
                />
              </div>

              <div className="w-full max-w-xl">
                <PlayerCardView card={{ ...card, squadNumber }} />
              </div>
            </>
          ) : (
            <p className="max-w-sm text-sm leading-relaxed text-pitch-touchline">
              No Player Card yet, and that&apos;s fine. Your Academy progress, quiz scores, and Tactics Lab plays will
              still sync. You can build a card anytime from Training.
            </p>
          )}

          <div className="flex w-full max-w-sm flex-col gap-3">
            <label htmlFor="username" className="sr-only">
              Username
            </label>
            <input
              id="username"
              value={username}
              onChange={(event) => setUsernameInput(event.target.value)}
              required
              minLength={3}
              maxLength={20}
              pattern="[a-zA-Z0-9_]+"
              title="3-20 characters: letters, numbers, underscores"
              placeholder="Pick a username"
              className="rounded-full border border-pitch-touchline/40 bg-pitch-card px-5 py-2.5 text-center text-sm text-pitch-line placeholder:text-pitch-touchline/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
            />

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
                onClick={() => setAuthMethod("magic")}
                className={authMethod === "magic" ? "text-attack" : "text-pitch-touchline hover:text-pitch-line"}
              >
                Email link
              </button>
              <button
                type="button"
                onClick={() => setAuthMethod("password")}
                className={authMethod === "password" ? "text-attack" : "text-pitch-touchline hover:text-pitch-line"}
              >
                Username &amp; password
              </button>
            </div>

            {authMethod === "magic" ? (
              <form onSubmit={handleMagicLink} className="flex flex-col gap-3">
                <label htmlFor="join-email-magic" className="sr-only">
                  Email
                </label>
                <input
                  id="join-email-magic"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="rounded-full border border-pitch-touchline/40 bg-pitch-card px-5 py-2.5 text-center text-sm text-pitch-line placeholder:text-pitch-touchline/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
                />
                {sendStatus === "error" && <p className="text-sm text-press">{errorMessage}</p>}
                <button
                  type="submit"
                  disabled={sendStatus === "sending"}
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-attack px-8 font-mono text-xs font-semibold uppercase tracking-widest text-night-950 shadow-[0_0_32px_-8px_var(--attack)] transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:shadow-none disabled:hover:scale-100"
                >
                  {sendStatus === "sending" ? "Sending…" : "Confirm & Send Link"}
                </button>
              </form>
            ) : (
              <form onSubmit={handlePasswordSignup} className="flex flex-col gap-3">
                <label htmlFor="join-email-password" className="sr-only">
                  Email
                </label>
                <input
                  id="join-email-password"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="rounded-full border border-pitch-touchline/40 bg-pitch-card px-5 py-2.5 text-center text-sm text-pitch-line placeholder:text-pitch-touchline/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
                />
                <label htmlFor="join-password" className="sr-only">
                  Password
                </label>
                <input
                  id="join-password"
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Password (8+ characters)"
                  className="rounded-full border border-pitch-touchline/40 bg-pitch-card px-5 py-2.5 text-center text-sm text-pitch-line placeholder:text-pitch-touchline/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
                />
                <label htmlFor="join-confirm-password" className="sr-only">
                  Confirm password
                </label>
                <input
                  id="join-confirm-password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Confirm password"
                  className="rounded-full border border-pitch-touchline/40 bg-pitch-card px-5 py-2.5 text-center text-sm text-pitch-line placeholder:text-pitch-touchline/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
                />
                {sendStatus === "error" && <p className="text-sm text-press">{errorMessage}</p>}
                <button
                  type="submit"
                  disabled={sendStatus === "sending"}
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-attack px-8 font-mono text-xs font-semibold uppercase tracking-widest text-night-950 shadow-[0_0_32px_-8px_var(--attack)] transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:shadow-none disabled:hover:scale-100"
                >
                  {sendStatus === "sending" ? "Creating…" : "Create Account"}
                </button>
              </form>
            )}
          </div>

          <button
            type="button"
            onClick={() => setStage("tunnel")}
            className="font-mono text-xs uppercase tracking-widest text-pitch-touchline/70 hover:text-pitch-marker"
          >
            ← Back
          </button>
        </StepShell>
      )}

      {stage === "sent" && (
        <motion.div
          key="sent"
          initial={reduceMotion ? undefined : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.3 }}
          className="flex flex-col items-center gap-4 rounded-lg border border-attack/40 bg-attack/10 px-6 py-8 text-center"
        >
          <p className="font-display text-lg font-bold uppercase tracking-tight text-pitch-line">
            {awaitingEmailConfirmation ? "Confirm your email." : "Check your inbox."}
          </p>
          <p className="max-w-sm text-sm leading-relaxed text-pitch-touchline">
            {awaitingEmailConfirmation
              ? `We sent a confirmation link to ${email}. Click it to finish creating your account — your username and squad number are already saved and waiting.`
              : `We sent a link to ${email}. Open it on this device or any other${card ? ", your squad number is already saved" : ""}.`}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
