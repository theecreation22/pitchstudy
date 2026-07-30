import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getModule, modules } from "@/lib/curriculum";
import { ModuleQuizRunner } from "@/components/curriculum/ModuleQuizRunner";

export function generateStaticParams() {
  return modules.filter((module) => module.quiz.length > 0).map((module) => ({ moduleSlug: module.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ moduleSlug: string }>;
}): Promise<Metadata> {
  const { moduleSlug } = await params;
  const mod = getModule(moduleSlug);

  return {
    title: mod ? `${mod.title} Quiz · PitchStudy Academy` : "Module quiz · PitchStudy",
  };
}

export default async function ModuleQuizPage({
  params,
}: {
  params: Promise<{ moduleSlug: string }>;
}) {
  const { moduleSlug } = await params;
  const mod = getModule(moduleSlug);

  if (!mod || mod.quiz.length === 0) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-4 py-10 sm:px-8 sm:py-16">
      <Link
        href={`/academy/${mod.slug}`}
        className="font-mono text-xs uppercase tracking-widest text-pitch-touchline hover:text-pitch-marker"
      >
        ← Back to {mod.title}
      </Link>

      <header className="flex flex-col gap-2">
        <p className="font-mono text-xs uppercase tracking-widest text-blue-volt">Module quiz</p>
        <h1 className="font-display text-4xl font-black uppercase leading-none tracking-tight text-pitch-line sm:text-6xl">
          {mod.title}
        </h1>
      </header>

      <ModuleQuizRunner key={mod.slug} module={mod} />
    </div>
  );
}
