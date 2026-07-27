import Link from "next/link";
import { getInfluenced, getManager, type LineageLink } from "@/lib/managers";

function LineageRow({ link }: { link: LineageLink }) {
  const target = getManager(link.slug);
  if (!target) return null;

  return (
    <Link
      href={`/managers/${target.slug}`}
      className="group flex gap-3 rounded-lg border border-pitch-touchline/20 bg-pitch-card/60 p-3 transition-colors hover:border-pitch-marker/50"
    >
      <span aria-hidden="true" className="mt-0.5 w-0 border-l border-dashed border-pitch-touchline/40" />
      <span className="flex flex-col gap-1">
        <span className="font-mono text-xs uppercase tracking-widest text-pitch-marker">
          {target.name} <span className="text-pitch-touchline">· {target.years}</span>
        </span>
        <span className="text-sm leading-relaxed text-pitch-line/90">{link.note}</span>
      </span>
    </Link>
  );
}

/** Bidirectional "who shaped them / who they shaped" section — the `influencedBy` half is authored directly on each manager, the influenced half is derived via `getInfluenced` so every connection only needs to be written once. Renders nothing for managers with no documented connections either way. */
export function CoachingTree({ slug }: { slug: string }) {
  const manager = getManager(slug);
  if (!manager) return null;

  const influencedBy = manager.influencedBy ?? [];
  const influenced = getInfluenced(slug);
  if (influencedBy.length === 0 && influenced.length === 0) return null;

  return (
    <div className="flex flex-col gap-6 sm:flex-row">
      {influencedBy.length > 0 && (
        <div className="flex flex-1 flex-col gap-2">
          <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-pitch-touchline">
            Influenced by
          </h3>
          <div className="flex flex-col gap-2">
            {influencedBy.map((link) => (
              <LineageRow key={link.slug} link={link} />
            ))}
          </div>
        </div>
      )}
      {influenced.length > 0 && (
        <div className="flex flex-1 flex-col gap-2">
          <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-pitch-touchline">
            Went on to influence
          </h3>
          <div className="flex flex-col gap-2">
            {influenced.map((link) => (
              <LineageRow key={link.slug} link={link} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
