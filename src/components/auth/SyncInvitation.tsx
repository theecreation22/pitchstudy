"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useSync } from "@/lib/sync/SyncProvider";
import { useProgress } from "@/lib/progress";

const DISMISSED_KEY = "pitchstudy:sync-invitation-dismissed";
const XP_THRESHOLD = 100;
const SUPPRESSED_PATHS = ["/join", "/login", "/account"];

/**
 * A single, dismissible nudge toward "Join the Club": shown once a guest
 * has real progress worth protecting (100+ XP or a first badge), never
 * before. Dismissing it (or joining) hides it for good; guest mode never
 * sees it again after that one decision.
 */
export function SyncInvitation() {
  const { status } = useSync();
  const { state } = useProgress();
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  // Starts hidden until localStorage is read on mount, so there's no flash
  // of the banner during the first SSR-hydrated paint.
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDismissed(window.localStorage.getItem(DISMISSED_KEY) === "1");
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function dismiss() {
    window.localStorage.setItem(DISMISSED_KEY, "1");
    setDismissed(true);
  }

  const milestoneHit = state.xp >= XP_THRESHOLD || state.earnedBadges.length >= 1;
  const suppressedHere = SUPPRESSED_PATHS.some((path) => pathname.startsWith(path));
  const shouldShow = status === "guest" && milestoneHit && !dismissed && !suppressedHere;

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          role="status"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: reduceMotion ? 0 : 0.3, ease: "easeOut" }}
          className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-md items-center gap-4 rounded-lg border border-attack/40 bg-pitch-card p-4 shadow-xl sm:inset-x-auto sm:right-6"
        >
          <p className="flex-1 text-sm leading-relaxed text-pitch-line">
            Training&apos;s adding up. Want your card and progress to follow you to another device?
          </p>
          <div className="flex shrink-0 flex-col gap-2">
            <Link
              href="/join"
              onClick={dismiss}
              className="rounded-full bg-attack px-4 py-1.5 text-center font-mono text-[11px] font-semibold uppercase tracking-widest text-night-950"
            >
              Join
            </Link>
            <button
              type="button"
              onClick={dismiss}
              className="font-mono text-[10px] uppercase tracking-widest text-pitch-touchline hover:text-pitch-marker"
            >
              Not now
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
