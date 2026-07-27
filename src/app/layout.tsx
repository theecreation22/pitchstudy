import type { Metadata } from "next";
import Link from "next/link";
import { Big_Shoulders, Public_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const bigShoulders = Big_Shoulders({
  variable: "--font-big-shoulders",
  weight: ["500", "700", "900"],
  subsets: ["latin"],
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PitchIQ — Learn football tactics, interactively",
  description:
    "Explore formations on an interactive pitch, learn what every position does, and train for the role you want to play.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bigShoulders.variable} ${publicSans.variable} ${plexMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-pitch-slate text-pitch-line antialiased">
        <nav className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 pt-6 sm:px-8 sm:pt-8">
          <Link
            href="/"
            className="font-display text-sm font-semibold uppercase tracking-[0.15em] text-pitch-touchline transition-colors hover:text-pitch-marker"
          >
            PitchIQ
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/explore"
              className="font-display text-sm font-semibold uppercase tracking-[0.15em] text-pitch-touchline transition-colors hover:text-pitch-marker"
            >
              Explore
            </Link>
            <Link
              href="/managers"
              className="font-display text-sm font-semibold uppercase tracking-[0.15em] text-pitch-touchline transition-colors hover:text-pitch-marker"
            >
              Managers
            </Link>
            <Link
              href="/workouts"
              className="font-display text-sm font-semibold uppercase tracking-[0.15em] text-pitch-touchline transition-colors hover:text-pitch-marker"
            >
              Workouts
            </Link>
            <Link
              href="/quiz"
              className="font-display text-sm font-semibold uppercase tracking-[0.15em] text-pitch-touchline transition-colors hover:text-pitch-marker"
            >
              Quiz
            </Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
