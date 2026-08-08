import type { Metadata } from "next";
import Link from "next/link";
import { SettingsView } from "@/components/settings/SettingsView";

export const metadata: Metadata = {
  title: "Settings · PitchStudy",
  description: "Motion, sound, training profile, and progress on this device.",
  // Per-device preferences with no content value to a search result, and
  // robots.ts disallows the path for the same reason.
  robots: { index: false, follow: false },
};

export default function SettingsPage() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-8 px-4 py-16">
      <header className="flex flex-col gap-1">
        <p className="font-mono text-xs uppercase tracking-widest text-attack">Preferences</p>
        <h1 className="font-display text-3xl font-black uppercase leading-none tracking-tight text-pitch-line sm:text-4xl">
          Settings.
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-pitch-touchline">
          These are stored on this device, so they apply whether or not you are signed in. Your username, email, and
          synced copy live on{" "}
          <Link
            href="/account"
            className="underline decoration-attack/50 underline-offset-4 transition-colors hover:text-attack"
          >
            your account
          </Link>
          .
        </p>
      </header>
      <SettingsView />
    </div>
  );
}
