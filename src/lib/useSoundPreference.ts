"use client";

import { useCallback } from "react";
import { useLocalStorageValue } from "./useLocalStorageValue";

const STORAGE_KEY = "pitchstudy:sound-enabled";

/** A single site-wide sound preference, default off — used by Session Mode's interval-end cue (§B4). */
export function useSoundPreference(): [boolean, (next: boolean) => void] {
  const [raw, setRaw] = useLocalStorageValue(STORAGE_KEY);
  const enabled = raw === "true";
  const setEnabled = useCallback((next: boolean) => setRaw(String(next)), [setRaw]);
  return [enabled, setEnabled];
}

/** A short sine-wave beep via the Web Audio API — no audio asset needed for a single interval-end cue. */
export function playBeep(frequency = 880, duration = 0.15) {
  if (typeof window === "undefined") return;
  const AudioContextCtor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextCtor) return;

  const ctx = new AudioContextCtor();
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = "sine";
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start();
  oscillator.stop(ctx.currentTime + duration);
  oscillator.onended = () => ctx.close();
}
