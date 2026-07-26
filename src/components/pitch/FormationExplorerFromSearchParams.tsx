"use client";

import { useSearchParams } from "next/navigation";
import { FormationExplorer } from "./FormationExplorer";

export function FormationExplorerFromSearchParams() {
  const searchParams = useSearchParams();
  return <FormationExplorer initialSlug={searchParams.get("formation") ?? undefined} />;
}
