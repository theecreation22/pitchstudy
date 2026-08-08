import { ImageResponse } from "next/og";
import { modules } from "@/lib/curriculum";
import { OG_CONTENT_TYPE, OG_SIZE, OgCard } from "@/lib/og";

export const alt = "An Academy lesson on PitchStudy";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/**
 * Text-only by design: a lesson has no single shape to draw, and an
 * unrelated pitch would imply the lesson is about that formation. The card
 * gives the full width to the lesson's own hook instead.
 */
export default async function Image({ params }: { params: Promise<{ moduleSlug: string; lessonSlug: string }> }) {
  const { moduleSlug, lessonSlug } = await params;
  // Not named `module`: that shadows a reserved runtime global and Next lints against it.
  const academyModule = modules.find((entry) => entry.slug === moduleSlug);
  const lesson = academyModule?.lessons.find((entry) => entry.slug === lessonSlug);

  return new ImageResponse(
    (
      <OgCard
        eyebrow={academyModule ? `Academy · ${academyModule.title}` : "Academy"}
        title={lesson?.title ?? "Academy"}
        subtitle={lesson?.hook}
      />
    ),
    size,
  );
}
