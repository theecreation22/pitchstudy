"use client";

import { useLocalStorageValue } from "@/lib/useLocalStorageValue";

export function QuizBestScore({ slug, total }: { slug: string; total: number }) {
  const [bestRaw] = useLocalStorageValue(`pitchstudy:quiz:${slug}:best`);
  if (!bestRaw) return null;

  return (
    <p className="font-mono text-xs uppercase tracking-widest text-pitch-marker">
      Best: {bestRaw} / {total}
    </p>
  );
}
