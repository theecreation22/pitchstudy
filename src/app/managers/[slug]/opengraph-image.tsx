import { ImageResponse } from "next/og";
import { getFormation } from "@/lib/formations";
import { managers } from "@/lib/managers";
import { OG_CONTENT_TYPE, OG_SIZE, OgCard } from "@/lib/og";

export const alt = "A manager's tactical approach on PitchStudy";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/**
 * Draws the manager's signature formation. Per the project's IP constraint
 * the card carries no crest, kit, or likeness — the shape is the portrait.
 */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const manager = managers.find((entry) => entry.slug === slug);
  const formation = manager ? getFormation(manager.signatureFormationSlug) : undefined;

  return new ImageResponse(
    (
      <OgCard
        eyebrow={formation ? `Manager · ${formation.name}` : "Manager"}
        title={manager?.name ?? "Managers"}
        subtitle={manager?.tagline}
        players={formation?.players}
      />
    ),
    size,
  );
}
