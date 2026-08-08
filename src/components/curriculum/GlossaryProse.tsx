"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { segmentProse } from "@/lib/glossaryMatch";
import type { GlossaryEntry } from "@/lib/glossary";

function GlossaryTerm({ text, entry }: { text: string; entry: GlossaryEntry }) {
  const [isOpen, setIsOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const panelId = useId();

  // Dismisses on outside click and on Escape. Both are registered only while
  // open, so a lesson with thirty terms isn't holding thirty idle listeners.
  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) setIsOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <span ref={wrapperRef} className="relative inline-block">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={isOpen ? panelId : undefined}
        onClick={() => setIsOpen((open) => !open)}
        className={`cursor-help rounded-sm underline decoration-dotted underline-offset-4 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker ${
          isOpen ? "text-attack decoration-attack" : "decoration-attack/50 hover:text-pitch-line hover:decoration-attack"
        }`}
      >
        {text}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.span
            id={panelId}
            role="tooltip"
            // A fixed bar rather than a popover anchored to the term.
            //
            // Anchoring was tried and cannot be made safe with CSS alone: a
            // term near either edge pushed the panel off-screen and clipped
            // the definition (verified at 390px). Keeping it anchored would
            // need JS measurement, and Framer Motion's inline transform also
            // overrides Tailwind's -translate-x-1/2, so the centring was
            // unreliable regardless.
            //
            // Centred with `inset-x` + `mx-auto` rather than a transform, so
            // nothing competes with the animated one. Sitting at the bottom
            // also means it never covers the sentence being read.
            // Deliberately not `.tactics-panel`: that sets a 95% background,
            // which is fine over the page ground but lets live text bleed
            // through a bar floating above content. It also declares
            // background-color outside Tailwind's layer, so a bg-* utility
            // cannot override it — hence a plain opaque surface here.
            className="fixed inset-x-4 bottom-4 z-40 mx-auto block max-w-md rounded-lg border border-pitch-touchline/30 bg-pitch-card p-4 text-left shadow-[0_8px_32px_rgba(0,0,0,0.55)]"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="block font-mono text-[10px] uppercase tracking-widest text-attack">{entry.term}</span>
            <span className="mt-1.5 block text-sm leading-relaxed text-pitch-line">{entry.definition}</span>
            <span className="mt-2 block font-mono text-[10px] uppercase tracking-widest text-pitch-touchline">
              Tap anywhere to close
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

/**
 * Renders lesson prose with tactical vocabulary made tappable in place.
 *
 * Drop-in for a bare `{block.body}`: no content file is edited and no term is
 * hand-tagged, so adding an entry to the glossary lights it up everywhere
 * retroactively. A reader stuck on "low block" mid-sentence gets the
 * definition without leaving the sentence.
 */
export function GlossaryProse({ children }: { children: string }) {
  return (
    <>
      {segmentProse(children).map((segment, index) =>
        segment.kind === "term" ? (
          <GlossaryTerm key={index} text={segment.text} entry={segment.entry} />
        ) : (
          <span key={index}>{segment.text}</span>
        ),
      )}
    </>
  );
}
