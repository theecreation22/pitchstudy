import Link from "next/link";

const LINKS = [
  { href: "/academy", label: "Academy" },
  { href: "/explore", label: "Explore" },
  { href: "/positions", label: "Positions" },
  { href: "/managers", label: "Managers" },
  { href: "/workouts", label: "Training" },
];

const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

/**
 * The site's first footer. Added primarily because the legal pages need a
 * reachable link from every page: an OAuth consent screen review and most
 * privacy regimes both expect them to be findable, not just to exist at a
 * URL somebody has to guess.
 */
export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-pitch-touchline/15 px-4 py-10">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-3">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-xs uppercase tracking-widest text-pitch-touchline transition-colors hover:text-pitch-marker"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-3 border-t border-pitch-touchline/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-relaxed text-pitch-touchline/80">
            Training content is general fitness guidance, not medical advice. Not affiliated with any club, league, or
            governing body.
          </p>
          <nav aria-label="Legal" className="flex shrink-0 gap-x-5">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-mono text-xs uppercase tracking-widest text-pitch-touchline transition-colors hover:text-pitch-marker"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
