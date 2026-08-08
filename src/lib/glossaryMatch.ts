import { autoLinkForms, type GlossaryEntry } from "./glossary";

export type ProseSegment =
  | { kind: "text"; text: string }
  | { kind: "term"; text: string; entry: GlossaryEntry };

/** Escapes a surface form for use inside a RegExp. Terms contain hyphens and digits ("false 9", "box-to-box"), none of which are regex-safe by default. */
function escape(form: string): string {
  return form.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * One alternation over every auto-linkable form, longest first, so the regex
 * engine prefers "low block" over any shorter form that overlaps it.
 *
 * The boundaries are custom rather than \b: \b treats a hyphen as a boundary,
 * so "half-space" would match inside "half-spaces" incorrectly and "press"
 * would match inside "gegenpress". Requiring a non-word, non-hyphen character
 * on each side keeps hyphenated compounds intact.
 */
const pattern = new RegExp(
  `(?<![\\w-])(${autoLinkForms.map(({ form }) => escape(form)).join("|")})(?![\\w-])`,
  "gi",
);

const entryByForm = new Map(autoLinkForms.map(({ form, entry }) => [form.toLowerCase(), entry]));

/**
 * Splits prose into plain text and glossary terms.
 *
 * Only the FIRST occurrence of any given entry is linked per call, and each
 * call is scoped to one content block. A lesson that says "overload" six
 * times gets one link, not a page of underlines. `seen` is per-call rather
 * than global on purpose: the same term should link again in the next block,
 * because a reader may well have scrolled past the first one.
 */
export function segmentProse(text: string): ProseSegment[] {
  const segments: ProseSegment[] = [];
  const seen = new Set<string>();
  let lastIndex = 0;

  for (const match of text.matchAll(pattern)) {
    const entry = entryByForm.get(match[0].toLowerCase());
    if (!entry || seen.has(entry.id)) continue;
    seen.add(entry.id);

    if (match.index > lastIndex) {
      segments.push({ kind: "text", text: text.slice(lastIndex, match.index) });
    }
    segments.push({ kind: "term", text: match[0], entry });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) segments.push({ kind: "text", text: text.slice(lastIndex) });
  return segments;
}
