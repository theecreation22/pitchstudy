"use client";

import { useEffect, useState } from "react";
import { PLAYER_CARD_STORAGE_KEY, usePlayerCard } from "@/lib/playerCard";
import { TrialDayFlow } from "./TrialDayFlow";
import { TrainingGroundHub } from "./TrainingGroundHub";

/**
 * Routes between first-run Trial Day and the returning-user Training
 * Ground. The one-time decision reads `localStorage` directly inside a
 * deferred effect callback rather than trusting `usePlayerCard()`'s `card`
 * value at mount: `card` comes from `useSyncExternalStore`, whose server
 * snapshot is always "no card" (no localStorage during SSR) — and critically,
 * a `useEffect(() => {...}, [])` callback closes over whatever `card` *was*
 * on the render that scheduled it. Wrapping that stale read in a
 * `setTimeout` doesn't help; it only delays *using* the same frozen value.
 * A raw `localStorage.getItem` call inside the timeout isn't a closure over
 * a React value at all — it's a live call at actual execution time, by
 * which point hydration has genuinely settled. From there, `showTrialDay`
 * is controlled purely by `onComplete` — Trial Day's own "reveal" step
 * already calls `save()` partway through its flow, and not re-deciding on
 * every `card` change is what stops that from booting the user out of
 * their own reveal.
 */
export function WorkoutsEntry() {
  const { card } = usePlayerCard();
  const [decided, setDecided] = useState(false);
  const [showTrialDay, setShowTrialDay] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const hasCard = window.localStorage.getItem(PLAYER_CARD_STORAGE_KEY) !== null;
      setShowTrialDay(!hasCard);
      setDecided(true);
    }, 0);
    return () => clearTimeout(timeout);
  }, []);

  // Renders a placeholder shaped like the destination card rather than
  // nothing — the decision above resolves within a tick, but a blank
  // frame still reads as broken for the instant it's visible.
  if (!decided) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-4 py-16" aria-hidden="true">
        <div className="h-40 animate-pulse rounded-lg border border-pitch-touchline/20 bg-pitch-card" />
        <div className="h-24 animate-pulse rounded-lg border border-pitch-touchline/20 bg-pitch-card" />
      </div>
    );
  }

  if (showTrialDay) {
    return <TrialDayFlow onComplete={() => setShowTrialDay(false)} />;
  }

  return <TrainingGroundHub card={card!} />;
}
