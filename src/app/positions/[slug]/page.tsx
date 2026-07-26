import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPosition, positions } from "@/lib/positions";

export function generateStaticParams() {
  return Object.keys(positions).map((code) => ({ slug: code.toLowerCase() }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const position = getPosition(slug.toUpperCase());

  return {
    title: position ? `${position.name} (${position.code}) — PitchIQ` : "Position — PitchIQ",
    description: position?.summary,
  };
}

export default async function PositionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const position = getPosition(slug.toUpperCase());

  if (!position) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-16 sm:px-8">
      <Link
        href="/"
        className="font-mono text-xs uppercase tracking-widest text-pitch-touchline hover:text-pitch-marker"
      >
        ← Back to the pitch
      </Link>
      <p className="font-mono text-sm text-pitch-marker">{position.code}</p>
      <h1 className="font-display text-4xl font-black uppercase tracking-tight text-pitch-line sm:text-5xl">
        {position.name}
      </h1>
      <p className="text-lg leading-relaxed text-pitch-line/90">{position.summary}</p>
      <p className="text-sm text-pitch-touchline">
        Full position guide — strong suits, how to play it, and zone diagrams — is coming soon.
      </p>
    </div>
  );
}
