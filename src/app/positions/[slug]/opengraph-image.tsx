import { ImageResponse } from "next/og";
import { getPosition } from "@/lib/positions";
import { OG_CONTENT_TYPE, OG_SIZE, OgCard } from "@/lib/og";

export const alt = "A football position explained on PitchStudy";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/**
 * Shares the page's own zones, so the card previews the actual answer to
 * "where does this position play" rather than restating the title in a box.
 */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const position = getPosition(slug.toUpperCase());

  return new ImageResponse(
    (
      <OgCard
        eyebrow={position ? `Position · ${position.code}` : "Position"}
        title={position?.name ?? "Positions"}
        subtitle={position?.summary}
        zones={position?.zones}
      />
    ),
    size,
  );
}
