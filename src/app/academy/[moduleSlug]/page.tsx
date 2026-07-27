import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getModule, modules } from "@/lib/curriculum";
import { ModuleLessonList } from "@/components/curriculum/ModuleLessonList";

export function generateStaticParams() {
  return modules.filter((module) => module.lessons.length > 0).map((module) => ({ moduleSlug: module.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ moduleSlug: string }>;
}): Promise<Metadata> {
  const { moduleSlug } = await params;
  const mod = getModule(moduleSlug);

  return {
    title: mod ? `${mod.title} · PitchIQ Academy` : "Module · PitchIQ",
    description: mod?.description,
  };
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ moduleSlug: string }>;
}) {
  const { moduleSlug } = await params;
  const mod = getModule(moduleSlug);

  if (!mod || mod.lessons.length === 0) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-10 sm:px-8 sm:py-16">
      <Link
        href="/academy"
        className="font-mono text-xs uppercase tracking-widest text-pitch-touchline hover:text-pitch-marker"
      >
        ← Back to academy
      </Link>

      <header className="flex flex-col gap-2">
        <p className="font-mono text-xs uppercase tracking-widest text-gold-flood">
          Module {mod.order}
        </p>
        <h1 className="font-display text-4xl font-black uppercase leading-none tracking-tight text-pitch-line sm:text-6xl">
          {mod.title}
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-pitch-touchline">{mod.description}</p>
      </header>

      <ModuleLessonList module={mod} />
    </div>
  );
}
