"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AuthChip } from "./AuthChip";
import { useSync } from "@/lib/sync/SyncProvider";

const NAV_LINKS = [
  { href: "/academy", label: "Academy" },
  { href: "/explore", label: "Explore" },
  { href: "/managers", label: "Managers" },
  { href: "/workouts", label: "Training" },
  { href: "/challenge", label: "Challenge" },
  { href: "/tactics-lab", label: "Tactics Lab" },
] as const;

const LINK_CLASS =
  "font-display text-sm font-semibold uppercase tracking-[0.15em] text-pitch-touchline transition-colors hover:text-pitch-marker";

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-5 w-5" aria-hidden="true">
      {open ? (
        <>
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="18" y1="6" x2="6" y2="18" />
        </>
      ) : (
        <>
          <line x1="4" y1="7" x2="20" y2="7" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="17" x2="20" y2="17" />
        </>
      )}
    </svg>
  );
}

/**
 * Site-wide nav. Desktop shows all 6 links inline, unchanged from before.
 * Below `sm`, the links collapse behind a hamburger toggle instead of
 * wrapping onto a second line — six items wrapping next to a single-line
 * logo has no clean way to align both without one overlapping the other.
 */
export function SiteNav() {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const pathname = usePathname();
  const menuId = useId();
  const { status } = useSync();

  // Closes on every way the route can change (link click, keyboard Enter,
  // browser back/forward), covered generically instead of an onClick per
  // link. Compared during render rather than in an effect — React's own
  // recommended pattern for "reset state when a prop changes" — since
  // setting state unconditionally inside an effect body causes an avoidable
  // extra render on top of the one the pathname change already triggered.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <nav className="relative mx-auto w-full max-w-5xl px-4 pt-6 sm:px-8 sm:pt-8">
      <div className="flex items-center justify-between">
        <Link href="/" className={LINK_CLASS}>
          PitchStudy
        </Link>

        <div className="hidden items-center gap-x-6 sm:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={LINK_CLASS}>
              {link.label}
            </Link>
          ))}
          <AuthChip />
        </div>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-11 w-11 items-center justify-center rounded-md text-pitch-touchline transition-colors hover:text-pitch-marker focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker sm:hidden"
        >
          <MenuIcon open={open} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              aria-hidden="true"
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-night-950/70 sm:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
            />
            <motion.div
              key="panel"
              id={menuId}
              className="absolute left-4 right-4 top-full z-50 mt-2 flex flex-col gap-1 rounded-lg border border-pitch-touchline/30 bg-pitch-card p-2 shadow-xl sm:hidden"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: reduceMotion ? 0 : 0.18, ease: "easeOut" }}
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-md px-3 py-3 font-display text-sm font-semibold uppercase tracking-[0.15em] text-pitch-touchline transition-colors hover:bg-pitch-touchline/10 hover:text-pitch-marker"
                >
                  {link.label}
                </Link>
              ))}
              {status !== "disabled" && (
                <div className="mt-1 border-t border-pitch-touchline/20 px-3 pt-3">
                  <AuthChip />
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
