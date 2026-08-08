"use client";

import { useState } from "react";
import Link from "next/link";
import { SegmentedTabs } from "@/components/ui/SegmentedTabs";
import { usePlayerCard } from "@/lib/playerCard";
import { useProgress } from "@/lib/progress";
import { useSoundPreference } from "@/lib/useSoundPreference";
import { useMotionPreference, type MotionPreference } from "@/lib/useMotionPreference";
import { equipmentLabels, levelLabels, positionGroupLabels, getPlaystyle } from "@/lib/workouts";
import { useSync } from "@/lib/sync/SyncProvider";
import { useTacticsPlaybook } from "@/lib/tactics-lab/usePlaybook";
import { usePlaybook } from "@/lib/scenario-mode/persistence";
import { downloadExport } from "@/lib/exportData";
import type { SyncStatus } from "@/lib/sync/useCloudSync";

const MOTION_OPTIONS = [
  { value: "system", label: "System" },
  { value: "reduced", label: "Reduced" },
  { value: "full", label: "Full" },
] as const satisfies { value: MotionPreference; label: string }[];

// Explicitly typed rather than `as const`: SegmentedTabs takes a mutable
// Option<T>[], which a readonly tuple is not assignable to.
const SOUND_OPTIONS: { value: "off" | "on"; label: string }[] = [
  { value: "off", label: "Off" },
  { value: "on", label: "On" },
];

/** Plain-language sync state. The raw union leaks implementation words ("guest", "disabled") that mean nothing to someone reading a settings page. */
const SYNC_COPY: Record<SyncStatus, { label: string; detail: string; tone: string }> = {
  synced: {
    label: "On",
    detail: "Your Player Card, progress, and playbooks are backed up to your account.",
    tone: "text-attack",
  },
  syncing: { label: "Syncing", detail: "Bringing this device up to date.", tone: "text-attack" },
  guest: {
    label: "Off",
    detail: "Everything is saved on this device only. Sign in to carry it to another one.",
    tone: "text-pitch-touchline",
  },
  disabled: {
    label: "Unavailable",
    detail: "Accounts aren't switched on for this build, so nothing leaves this device.",
    tone: "text-pitch-touchline",
  },
  error: {
    label: "Problem",
    detail: "The last sync didn't complete. Your device copy is safe and it will retry.",
    tone: "text-press",
  },
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-pitch-touchline/15 pb-2 last:border-0 last:pb-0">
      <span className="font-mono text-[10px] uppercase tracking-widest text-pitch-touchline">{label}</span>
      <span className="text-sm text-pitch-line">{value}</span>
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="tactics-panel flex flex-col gap-4 rounded-lg border border-pitch-touchline/30 p-5">
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-lg font-bold uppercase tracking-tight text-pitch-line">{title}</h2>
        <p className="text-sm leading-relaxed text-pitch-touchline">{description}</p>
      </div>
      {children}
    </section>
  );
}

/**
 * Preferences, deliberately separate from /account.
 *
 * Account owns identity: username, email, provider, squad number, and the
 * cloud copy. This page owns how the site behaves on this device. Everything
 * here is stored locally, which is why it works signed out — someone who
 * needs the animation calmed down should not have to make an account first.
 */
export function SettingsView() {
  const [motion, setMotion] = useMotionPreference();
  const [soundEnabled, setSoundEnabled] = useSoundPreference();
  const { card } = usePlayerCard();
  const { state, reset, trainingStreak } = useProgress();
  const { status, user } = useSync();
  const { entries: tacticsEntries, replaceAll: replaceTactics } = useTacticsPlaybook();
  const { plays: scenarioPlays, replaceAll: replaceScenario } = usePlaybook();
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [confirmingClearSaved, setConfirmingClearSaved] = useState(false);

  const playstyle = card?.playstyleId ? getPlaystyle(card.playstyleId) : undefined;
  const completedCount = state.completedLessons.length;
  const sync = SYNC_COPY[status];
  const savedCount = tacticsEntries.length + scenarioPlays.length;

  return (
    <div className="flex flex-col gap-5">
      <Section
        title="Motion"
        description="This site animates a lot: pitch markers, page transitions, chalk effects. Reduced keeps everything functional and stops it moving. System follows your device setting."
      >
        <SegmentedTabs
          id="settings-motion"
          ariaLabel="Motion preference"
          fullWidth
          options={MOTION_OPTIONS}
          value={motion}
          onChange={setMotion}
        />
      </Section>

      <Section
        title="Sound"
        description="The only sound on the site is the interval cue in Session Mode, which marks the end of a work or rest period so you don't have to watch the timer."
      >
        <SegmentedTabs
          id="settings-sound"
          ariaLabel="Sound preference"
          fullWidth
          options={SOUND_OPTIONS}
          value={soundEnabled ? "on" : "off"}
          onChange={(next) => setSoundEnabled(next === "on")}
        />
      </Section>

      <Section
        title="Training profile"
        description="Your position, playstyle, level, and kit decide which drills your programme is built from. Changing them starts a fresh training block."
      >
        {card ? (
          <div className="flex flex-col gap-3">
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ["Position", card.positionCode],
                ["Group", positionGroupLabels[card.positionGroup]],
                ["Playstyle", playstyle?.name ?? "Balanced"],
                ["Level", levelLabels[card.level]],
                ["Kit", equipmentLabels[card.equipment]],
              ].map(([label, value]) => (
                <div key={label} className="flex flex-col gap-1">
                  <dt className="font-mono text-[10px] uppercase tracking-widest text-pitch-touchline">{label}</dt>
                  <dd className="text-sm text-pitch-line">{value}</dd>
                </div>
              ))}
            </dl>
            <Link
              href="/workouts"
              className="inline-flex min-h-11 w-fit items-center rounded-full border border-pitch-marker px-5 font-mono text-xs uppercase tracking-widest text-pitch-marker transition-colors hover:bg-pitch-marker/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
            >
              Redo Trial Day →
            </Link>
          </div>
        ) : (
          <Link
            href="/workouts"
            className="inline-flex min-h-11 w-fit items-center rounded-full border border-pitch-marker px-5 font-mono text-xs uppercase tracking-widest text-pitch-marker transition-colors hover:bg-pitch-marker/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
          >
            Build a Player Card →
          </Link>
        )}
      </Section>

      <Section
        title="Cloud sync"
        description="Signing in keeps a copy of your Player Card, progress, and playbooks on your account so they follow you to another device. Only you can read it."
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className={`font-display text-2xl font-black uppercase tracking-tight ${sync.tone}`}>
              {sync.label}
            </span>
            <span className="flex-1 text-sm leading-relaxed text-pitch-touchline">{sync.detail}</span>
          </div>
          {user ? (
            <div className="flex flex-col gap-2">
              <Row label="Signed in as" value={user.username ?? user.email ?? "-"} />
              <Link
                href="/account"
                className="inline-flex min-h-11 w-fit items-center rounded-full border border-pitch-touchline/40 px-5 font-mono text-xs uppercase tracking-widest text-pitch-touchline transition-colors hover:border-pitch-marker hover:text-pitch-marker focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
              >
                Manage account →
              </Link>
            </div>
          ) : (
            status === "guest" && (
              <Link
                href="/join"
                className="inline-flex min-h-11 w-fit items-center rounded-full border border-pitch-marker px-5 font-mono text-xs uppercase tracking-widest text-pitch-marker transition-colors hover:bg-pitch-marker/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
              >
                Sign in to sync →
              </Link>
            )
          )}
        </div>
      </Section>

      <Section
        title="Saved work"
        description="Formations and plays you've built in the Tactics Lab, and attempts saved from Scenario Mode."
      >
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <Row label="Tactics Lab playbook" value={`${tacticsEntries.length}`} />
            <Row label="Scenario Mode plays" value={`${scenarioPlays.length}`} />
          </div>
          {savedCount > 0 &&
            (!confirmingClearSaved ? (
              <button
                type="button"
                onClick={() => setConfirmingClearSaved(true)}
                className="inline-flex min-h-11 w-fit items-center rounded-full border border-press/50 px-5 font-mono text-xs uppercase tracking-widest text-press transition-colors hover:bg-press/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
              >
                Clear saved work
              </button>
            ) : (
              <div className="flex flex-col gap-3 rounded-lg border border-press/40 bg-press/10 p-4">
                <p className="text-sm leading-relaxed text-pitch-line">
                  This deletes all {savedCount} saved {savedCount === 1 ? "item" : "items"} on this device. Export
                  your data first if you want a copy.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      replaceTactics([]);
                      replaceScenario([]);
                      setConfirmingClearSaved(false);
                    }}
                    className="inline-flex min-h-9 items-center rounded-full bg-press px-5 font-mono text-xs font-semibold uppercase tracking-widest text-night-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-line"
                  >
                    Confirm clear
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingClearSaved(false)}
                    className="inline-flex min-h-9 items-center rounded-full px-5 font-mono text-xs uppercase tracking-widest text-pitch-touchline transition-colors hover:text-pitch-marker"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
        </div>
      </Section>

      <Section
        title="Export your data"
        description="Downloads everything PitchStudy has stored on this device as a JSON file: Player Card, progress, badges, and both playbooks."
      >
        <button
          type="button"
          onClick={downloadExport}
          className="inline-flex min-h-11 w-fit items-center rounded-full border border-pitch-marker px-5 font-mono text-xs uppercase tracking-widest text-pitch-marker transition-colors hover:bg-pitch-marker/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
        >
          Download JSON
        </button>
      </Section>

      <Section
        title="Progress on this device"
        description="Everything you've earned in the Academy and the Training Ground."
      >
        <div className="flex flex-col gap-2">
          <Row label="Lessons completed" value={`${completedCount}`} />
          <Row label="XP" value={`${state.xp}`} />
          <Row label="Badges" value={`${state.earnedBadges.length}`} />
          <Row label="Training streak" value={trainingStreak === 1 ? "1 day" : `${trainingStreak} days`} />
        </div>
        {!confirmingReset ? (
          <button
            type="button"
            onClick={() => setConfirmingReset(true)}
            className="inline-flex min-h-11 w-fit items-center rounded-full border border-press/50 px-5 font-mono text-xs uppercase tracking-widest text-press transition-colors hover:bg-press/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
          >
            Reset progress
          </button>
        ) : (
          <div className="flex flex-col gap-3 rounded-lg border border-press/40 bg-press/10 p-4">
            <p className="text-sm leading-relaxed text-pitch-line">
              This clears completed lessons, XP, badges, and quiz scores on this device. If you are signed in, your
              synced copy is untouched and will come back on the next sync — delete that from{" "}
              <Link href="/account" className="underline decoration-press/60 underline-offset-4 hover:text-press">
                your account
              </Link>{" "}
              instead.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  reset();
                  setConfirmingReset(false);
                }}
                className="inline-flex min-h-9 items-center rounded-full bg-press px-5 font-mono text-xs font-semibold uppercase tracking-widest text-night-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-line"
              >
                Confirm reset
              </button>
              <button
                type="button"
                onClick={() => setConfirmingReset(false)}
                className="inline-flex min-h-9 items-center rounded-full px-5 font-mono text-xs uppercase tracking-widest text-pitch-touchline transition-colors hover:text-pitch-marker"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Section>
    </div>
  );
}
