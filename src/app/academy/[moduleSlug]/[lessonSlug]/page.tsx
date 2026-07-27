import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLesson, getModule, modules } from "@/lib/curriculum";
import { ConceptBlockView } from "@/components/curriculum/ConceptBlockView";
import { InlineCheckView } from "@/components/curriculum/InlineCheckView";
import { LessonCompletion } from "@/components/curriculum/LessonCompletion";
import { ChalkDivider } from "@/components/effects/ChalkDivider";

export function generateStaticParams() {
  return modules.flatMap((module) =>
    module.lessons.map((lesson) => ({ moduleSlug: module.slug, lessonSlug: lesson.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ moduleSlug: string; lessonSlug: string }>;
}): Promise<Metadata> {
  const { moduleSlug, lessonSlug } = await params;
  const lesson = getLesson(moduleSlug, lessonSlug);

  return {
    title: lesson ? `${lesson.title} — PitchIQ Academy` : "Lesson — PitchIQ",
    description: lesson?.hook,
  };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ moduleSlug: string; lessonSlug: string }>;
}) {
  const { moduleSlug, lessonSlug } = await params;
  const mod = getModule(moduleSlug);
  const lesson = getLesson(moduleSlug, lessonSlug);

  if (!mod || !lesson) {
    notFound();
  }

  const lessonIndex = mod.lessons.findIndex((candidate) => candidate.slug === lessonSlug);
  const nextLesson = mod.lessons[lessonIndex + 1] ?? null;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-10 sm:px-8 sm:py-16">
      <Link
        href={`/academy/${mod.slug}`}
        className="font-mono text-xs uppercase tracking-widest text-pitch-touchline hover:text-pitch-marker"
      >
        ← Back to {mod.title}
      </Link>

      <header className="flex flex-col gap-2">
        <p className="font-mono text-xs uppercase tracking-widest text-gold-flood">
          Lesson {lessonIndex + 1} of {mod.lessons.length} · {lesson.estimatedMinutes} min
        </p>
        <h1 className="font-display text-4xl font-black uppercase leading-none tracking-tight text-pitch-line sm:text-6xl">
          {lesson.title}
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-pitch-touchline">{lesson.hook}</p>
      </header>

      <div className="flex flex-col gap-6">
        {lesson.blocks.map((block) => (
          <div key={block.id}>
            <ChalkDivider className="mb-6" />
            <ConceptBlockView block={block} />
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-blue-volt/40 bg-pitch-card p-5">
        <p className="font-mono text-xs uppercase tracking-widest text-blue-volt">Try it</p>
        <p className="mt-2 text-sm leading-relaxed text-pitch-line/90">{lesson.tryIt}</p>
      </div>

      <InlineCheckView check={lesson.inlineCheck} />

      <div className="rounded-lg border border-pitch-touchline/30 bg-pitch-card p-6">
        <p className="font-mono text-xs uppercase tracking-widest text-gold-flood">Key takeaways</p>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-pitch-line/90">
          {lesson.takeaways.map((point) => (
            <li key={point} className="flex gap-2">
              <span aria-hidden="true" className="text-gold-flood">
                ›
              </span>
              {point}
            </li>
          ))}
        </ul>
      </div>

      <LessonCompletion module={mod} lesson={lesson} nextLesson={nextLesson} />
    </div>
  );
}
