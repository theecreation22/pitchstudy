import type { ReactNode } from "react";

/**
 * Shared shell for the legal pages.
 *
 * Deliberately narrower than the rest of the site (max-w-2xl) and plainer:
 * these are read top to bottom, so line length matters more than the
 * instrument-panel styling that suits the interactive surfaces.
 */
export function LegalPage({
  eyebrow,
  title,
  updated,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-4 py-16">
      <header className="flex flex-col gap-2">
        <p className="font-mono text-xs uppercase tracking-widest text-attack">{eyebrow}</p>
        <h1 className="font-display text-3xl font-black uppercase leading-none tracking-tight text-pitch-line sm:text-4xl">
          {title}
        </h1>
        <p className="font-mono text-[10px] uppercase tracking-widest text-pitch-touchline">Last updated {updated}</p>
        <p className="mt-3 text-sm leading-relaxed text-pitch-touchline">{intro}</p>
      </header>
      <div className="flex flex-col gap-7">{children}</div>
    </div>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="font-display text-lg font-bold uppercase tracking-tight text-pitch-line">{title}</h2>
      <div className="flex flex-col gap-3 text-sm leading-relaxed text-pitch-touchline">{children}</div>
    </section>
  );
}

export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item, index) => (
        <li key={index} className="flex gap-2">
          <span aria-hidden="true" className="text-pitch-marker">
            ›
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
