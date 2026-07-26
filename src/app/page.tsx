import { Suspense } from "react";
import { FormationExplorer } from "@/components/pitch/FormationExplorer";
import { FormationExplorerFromSearchParams } from "@/components/pitch/FormationExplorerFromSearchParams";

export default function Home() {
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

      <Suspense fallback={<FormationExplorer />}>
        <FormationExplorerFromSearchParams />
      </Suspense>
    </div>
  );
}
