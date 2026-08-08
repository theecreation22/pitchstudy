import { ImageResponse } from "next/og";
import { getFormation } from "@/lib/formations";
import { OG_CONTENT_TYPE, OG_SIZE, OgCard } from "@/lib/og";

export const alt = "PitchStudy: learn football tactics, interactively";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/**
 * The card every route inherits unless it defines its own. Shows a 4-3-3
 * because it is the shape most visitors already half-recognise, so the card
 * reads as football at a glance rather than as an abstract diagram.
 */
export default async function Image() {
  const formation = getFormation("4-3-3");

  return new ImageResponse(
    (
      <OgCard
        eyebrow="Interactive football tactics"
        title="Learn how football actually works"
        subtitle="Formations on a pitch you can move. Every position explained. Train for the role you want."
        players={formation?.players}
      />
    ),
    size,
  );
}
