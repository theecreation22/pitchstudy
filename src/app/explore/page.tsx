import type { Metadata } from "next";
import { Suspense } from "react";
import { FormationExplorer } from "@/components/pitch/FormationExplorer";
import { FormationExplorerFromSearchParams } from "@/components/pitch/FormationExplorerFromSearchParams";

export const metadata: Metadata = {
  title: "Explore Formations · PitchStudy",
  description:
    "Switch between 8 formations on an interactive pitch, compare two side by side, and click any player to learn what their position does.",
};

export default function ExplorePage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-4 py-6 sm:px-8 sm:py-10">
      {/* The visible headline and intro copy were removed by request so the
          tool itself leads the page. The heading stays in the document for
          screen readers and document structure — a page with no h1 is a real
          accessibility gap, not just a style choice. */}
      <h1 className="sr-only">Explore formations</h1>

      <Suspense fallback={<FormationExplorer />}>
        <FormationExplorerFromSearchParams />
      </Suspense>
    </div>
  );
}
