"use client";

import { useState } from "react";
import Link from "next/link";
import { SegmentedTabs } from "@/components/ui/SegmentedTabs";
import { usePlayerCard } from "@/lib/playerCard";
import { useProgress } from "@/lib/progress";
import { useSoundPreference } from "@/lib/useSoundPreference";
import { useMotionPreference, type MotionPreference } from "@/lib/useMotionPreference";
import { equipmentLabels, levelLabels, positionGroupLabels, getPlaystyle } from "@/lib/workouts";

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
  const { state, reset } = useProgress();
  const [confirmingReset, setConfirmingReset] = useState(false);

  const playstyle = card?.playstyleId ? getPlaystyle(card.playstyleId) : undefined;
  const completedCount = state.completedLessons.length;

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
        title="Progress on this device"
        description={`${completedCount} ${completedCount === 1 ? "lesson" : "lessons"} completed, ${state.xp} XP, ${state.earnedBadges.length} ${state.earnedBadges.length === 1 ? "badge" : "badges"}.`}
      >
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
