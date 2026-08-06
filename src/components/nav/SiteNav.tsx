"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AuthChip } from "./AuthChip";
import { PitchStudyMark } from "@/components/brand/PitchStudyMark";
import { useSync } from "@/lib/sync/SyncProvider";

type IconProps = { className?: string };

/* Hand-drawn stroke icons in the codebase's shared convention (24-box,
   currentColor stroke) — monochrome on purpose: they take the link's own
   color, muted at rest and cyan when active, instead of importing the
   reference app's multicolor icon language into the telemetry world. */

function AcademyIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 4 2.5 8.5 12 13l9.5-4.5L12 4Z" />
      <path d="M6 10.5V16c0 1.2 2.7 2.7 6 2.7s6-1.5 6-2.7v-5.5" />
      <path d="M21.5 8.5V14" />
    </svg>
  );
}

function ExploreIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
    </svg>
  );
}

function ManagersIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="5" y="4" width="14" height="17" rx="1.5" />
      <path d="M9 4V2.8h6V4" />
      <path d="M8.5 9.5h7M8.5 13h7M8.5 16.5h4" />
    </svg>
  );
}

function TrainingIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M7.5 12h9" />
      <rect x="3.5" y="8.5" width="3" height="7" rx="0.8" />
      <rect x="17.5" y="8.5" width="3" height="7" rx="0.8" />
      <path d="M1.8 10.5v3M22.2 10.5v3" />
    </svg>
  );
}

function ChallengeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 2.5c1.5 3-1 4.5-1 7 0 1.2 1 2 2 2s2-.8 2-2c2 1.5 3 3.5 3 6a6 6 0 0 1-12 0c0-4.5 3.5-6.5 6-13Z" />
    </svg>
  );
}

function TacticsLabIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M10 2.5h4M11 2.5v6l-5.5 9a2 2 0 0 0 1.7 3h9.6a2 2 0 0 0 1.7-3L13 8.5v-6" />
      <path d="M8 14.5h8" />
    </svg>
  );
}

const NAV_LINKS = [
  { href: "/academy", label: "Academy", Icon: AcademyIcon },
  { href: "/explore", label: "Explore", Icon: ExploreIcon },
  { href: "/managers", label: "Managers", Icon: ManagersIcon },
  { href: "/workouts", label: "Training", Icon: TrainingIcon },
  { href: "/challenge", label: "Challenge", Icon: ChallengeIcon },
  { href: "/tactics-lab", label: "Tactics Lab", Icon: TacticsLabIcon },
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
 * Site-wide nav, split by viewport. Desktop (lg+): a fixed left rail —
 * logo, stacked icon links with the active page in an outlined cyan tile,
 * account chip pinned to the bottom. The root layout offsets page content
 * with lg:pl-60 to make room. Below lg: the sticky glass top bar with a
 * hamburger sheet, unchanged behavior.
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

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      {/* Desktop left rail */}
      <nav className="telemetry-glass fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r p-4 lg:flex" aria-label="Site">
        <Link href="/" className={`${LINK_CLASS} flex items-center gap-2.5 px-3 py-3 text-base text-pitch-line`}>
          <PitchStudyMark id="ps-mark-rail" className="h-8 w-8 shrink-0" strokeWidth={3} detail="compact" />
          PitchStudy
        </Link>

        <div className="mt-4 flex flex-col gap-1">
          {NAV_LINKS.map(({ href, label, Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-11 items-center gap-3 rounded-lg border px-3 font-display text-sm font-semibold uppercase tracking-[0.15em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker ${
                  active
                    ? "border-attack/60 bg-attack/10 text-attack"
                    : "border-transparent text-pitch-touchline hover:bg-pitch-touchline/10 hover:text-pitch-line"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {label}
              </Link>
            );
          })}
        </div>

        <div className="mt-auto border-t border-pitch-touchline/20 pt-4">
          <AuthChip menuPlacement="up" />
        </div>
      </nav>

      {/* Mobile / tablet top bar */}
      <nav className="telemetry-glass sticky top-0 z-40 w-full border-b lg:hidden" aria-label="Site">
        <div className="relative mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4 sm:px-8">
          <Link href="/" className={`${LINK_CLASS} flex items-center gap-2 text-pitch-line`}>
            <PitchStudyMark id="ps-mark-bar" className="h-7 w-7 shrink-0" strokeWidth={3.4} detail="compact" />
            PitchStudy
          </Link>

          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-11 w-11 items-center justify-center rounded-md text-pitch-touchline transition-colors hover:text-pitch-marker focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
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
                className="fixed inset-0 z-40 bg-night-950/70"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.2 }}
              />
              <motion.div
                key="panel"
                id={menuId}
                className="telemetry-glass absolute left-4 right-4 top-full z-50 mt-2 flex flex-col gap-1 rounded-lg border p-2"
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                transition={{ duration: reduceMotion ? 0 : 0.18, ease: "easeOut" }}
              >
                {NAV_LINKS.map(({ href, label, Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 rounded-md px-3 py-3 font-display text-sm font-semibold uppercase tracking-[0.15em] transition-colors ${
                      isActive(href)
                        ? "text-attack"
                        : "text-pitch-touchline hover:bg-pitch-touchline/10 hover:text-pitch-marker"
                    }`}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {label}
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
    </>
  );
}
