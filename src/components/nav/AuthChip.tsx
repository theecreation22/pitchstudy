"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useSync } from "@/lib/sync/SyncProvider";
import { usePlayerCard } from "@/lib/playerCard";
import { isAdminEmail } from "@/lib/admin";

function initialsFor(label: string): string {
  return label.trim().slice(0, 2).toUpperCase();
}

/**
 * Signed-out: a quiet "Join" link into the club tunnel (/join), deliberately
 * unshowy, sitting alongside the other nav links rather than as a loud CTA,
 * since accounts are an optional add-on, not the point of the site.
 * Signed-in: the player's own card identity as a small chip, opening a menu
 * with Account + Sign out. Renders nothing at all when Supabase isn't
 * configured, since guest mode has no auth UI to speak of until that's set up.
 */
export function AuthChip() {
  const { status, user, signOut } = useSync();
  const { card } = usePlayerCard();
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (status === "disabled") return null;

  if (!user) {
    return (
      <Link
        href="/join"
        className="font-display text-sm font-semibold uppercase tracking-[0.15em] text-pitch-touchline transition-colors hover:text-pitch-marker"
      >
        Join
      </Link>
    );
  }

  const label = card?.nickname || user.username || user.email?.split("@")[0] || "Player";

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full border border-pitch-touchline/30 bg-pitch-card px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-wide text-pitch-line transition-colors hover:border-attack focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-attack text-[10px] font-black text-night-950">
          {initialsFor(label)}
        </span>
        {label}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: reduceMotion ? 0 : 0.15, ease: "easeOut" }}
            className="absolute right-0 top-full z-50 mt-2 flex w-44 flex-col gap-1 rounded-lg border border-pitch-touchline/30 bg-pitch-card p-2 shadow-xl"
          >
            <Link
              role="menuitem"
              href="/account"
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-left font-display text-sm font-semibold uppercase tracking-wide text-pitch-touchline transition-colors hover:bg-pitch-touchline/10 hover:text-pitch-marker"
            >
              Account
            </Link>
            {isAdminEmail(user.email) && (
              <Link
                role="menuitem"
                href="/admin"
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-left font-display text-sm font-semibold uppercase tracking-wide text-pitch-touchline transition-colors hover:bg-pitch-touchline/10 hover:text-pitch-marker"
              >
                Admin
              </Link>
            )}
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                void signOut();
              }}
              className="rounded-md px-3 py-2 text-left font-display text-sm font-semibold uppercase tracking-wide text-pitch-touchline transition-colors hover:bg-pitch-touchline/10 hover:text-pitch-marker"
            >
              Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
