import type { EngineNote } from "@/lib/tactics-lab/engine";

const SEVERITY_STYLES: Record<EngineNote["severity"], string> = {
  good: "border-attack/40 bg-attack/10 text-attack",
  warn: "border-defend/40 bg-defend/10 text-defend-bright",
  bad: "border-press/40 bg-press/10 text-press",
};

const SEVERITY_MARK: Record<EngineNote["severity"], string> = {
  good: "+",
  warn: "!",
  bad: "−",
};

type Props = { notes: EngineNote[] };

/** 2–4 plain-language auto-verdicts from the deterministic engine's threshold rules, colored by severity so a real weakness (red) reads differently from a strength (amber) at a glance. */
export function AutoNotes({ notes }: Props) {
  return (
    <ul className="flex flex-col gap-2">
      {notes.map((note) => (
        <li
          key={note.text}
          className={`flex gap-2 rounded-sm border px-3 py-2 text-sm leading-relaxed ${SEVERITY_STYLES[note.severity]}`}
        >
          <span aria-hidden="true" className="font-mono font-bold">
            {SEVERITY_MARK[note.severity]}
          </span>
          <span className="text-pitch-line/90">{note.text}</span>
        </li>
      ))}
    </ul>
  );
}
