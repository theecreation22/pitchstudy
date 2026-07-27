import type { Metadata } from "next";
import { Suspense } from "react";
import { FormationExplorer } from "@/components/pitch/FormationExplorer";
import { FormationExplorerFromSearchParams } from "@/components/pitch/FormationExplorerFromSearchParams";
import { ChalkDivider } from "@/components/effects/ChalkDivider";

export const metadata: Metadata = {
  title: "Explore Formations — PitchIQ",
  description:
    "Switch between 8 formations on an interactive pitch, compare two side by side, and click any player to learn what their position does.",
};

export default function ExplorePage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-4 py-10 sm:px-8 sm:py-16">
      <header className="flex flex-col gap-3">
        <h1 className="font-display text-4xl font-black uppercase leading-none tracking-tight text-pitch-line sm:text-6xl">
          Every shape tells you something.
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-pitch-touchline sm:text-lg">
          Pick a formation, watch it take shape on the pitch, and click any position to learn
          what it actually does out there.
        </p>
      </header>

      <ChalkDivider />

      <Suspense fallback={<FormationExplorer />}>
        <FormationExplorerFromSearchParams />
      </Suspense>
    </div>
  );
}
