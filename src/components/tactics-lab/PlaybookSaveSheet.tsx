"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { NumberPicker } from "./NumberPicker";
import type { PlaybookEntry } from "@/lib/tactics-lab/playbookSchema";
import { lowestFreeNumber } from "@/lib/tactics-lab/usePlaybook";

export type SaveSheetResult = {
  id: string;
  name: string;
  number: number;
  asNew: boolean;
  /** Set when the chosen number belongs to a different entry — the caller resolves it (a true swap when updating an existing entry, a displacement to the next free slot when saving brand new). */
  conflictingEntryId?: string;
};

type Props = {
  entryType: "formation" | "play";
  entries: PlaybookEntry[];
  /** The entry the current board was loaded from, if any and if it matches `entryType` — governs whether "Save" (update in place) is offered alongside "Save as new page." */
  activeEntry: { id: string; name: string; number: number } | null;
  /** Pre-fills the name field when there's no `activeEntry` but the board still has an obvious name to start from (e.g. duplicating a shared design). */
  initialName?: string;
  onCancel: () => void;
  onConfirm: (result: SaveSheetResult) => void;
};

/** The save sheet (§3): name it, pick its call number, and — if this board came from an existing page — choose whether to update that page or start a new one. Coach-voiced, not a file dialog. */
export function PlaybookSaveSheet({ entryType, entries, activeEntry, initialName, onCancel, onConfirm }: Props) {
  const reduceMotion = useReducedMotion();
  const [asNew, setAsNew] = useState(!activeEntry);
  const [name, setName] = useState(activeEntry?.name ?? initialName ?? "");
  const [number, setNumber] = useState(activeEntry?.number ?? lowestFreeNumber(entries, entryType));
  const [confirmingSwap, setConfirmingSwap] = useState<{ id: string; name: string } | null>(null);

  const activeId = asNew ? null : (activeEntry?.id ?? null);
  const conflicting = entries.find((entry) => entry.type === entryType && entry.number === number && entry.id !== activeId);

  function handleModeChange(nextAsNew: boolean) {
    setAsNew(nextAsNew);
    setConfirmingSwap(null);
    if (nextAsNew) setNumber(lowestFreeNumber(entries, entryType, activeEntry?.id));
    else if (activeEntry) setNumber(activeEntry.number);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    if (conflicting && !confirmingSwap) {
      setConfirmingSwap({ id: conflicting.id, name: conflicting.name });
      return;
    }
    onConfirm({
      id: activeId ?? crypto.randomUUID(),
      name: name.trim(),
      number,
      asNew: asNew || !activeEntry,
      conflictingEntryId: conflicting?.id,
    });
  }

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`Save to Playbook — ${entryType === "formation" ? "Formation" : "Play"}`}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
      transition={{ duration: reduceMotion ? 0 : 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-night-950/70 p-4"
      onClick={onCancel}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(event) => event.stopPropagation()}
        className="flex w-full max-w-md flex-col gap-5 rounded-lg border border-pitch-touchline/30 bg-pitch-card p-6"
      >
        <div className="flex flex-col gap-1">
          <p className="font-mono text-xs uppercase tracking-widest text-attack">
            Save to Playbook · {entryType === "formation" ? "Formation" : "Play"}
          </p>
          <h2 className="font-display text-xl font-black uppercase leading-none tracking-tight text-pitch-line">
            Add a page.
          </h2>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-xs uppercase tracking-widest text-pitch-touchline">Name</span>
          <input
            autoFocus
            required
            maxLength={40}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Name it something you'll shout from the touchline"
            className="rounded-md border border-pitch-touchline/40 bg-pitch-slate px-4 py-2 text-sm text-pitch-line placeholder:text-pitch-touchline/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
          />
        </label>

        <NumberPicker
          label="Call number"
          value={number}
          onChange={(next) => {
            setNumber(next);
            setConfirmingSwap(null);
          }}
          takenNumbers={new Set(entries.filter((entry) => entry.type === entryType && entry.id !== activeId).map((entry) => entry.number))}
        />

        {confirmingSwap && (
          <p className="rounded-md border border-attack/40 bg-attack/10 px-3 py-2 text-sm text-pitch-line">
            No. {number} is &ldquo;{confirmingSwap.name}&rdquo; — swap numbers?
          </p>
        )}

        {activeEntry && (
          <div className="flex items-center gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input type="radio" checked={!asNew} onChange={() => handleModeChange(false)} className="accent-attack" />
              <span className="text-pitch-line">Update No. {activeEntry.number}</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" checked={asNew} onChange={() => handleModeChange(true)} className="accent-attack" />
              <span className="text-pitch-line">Save as new page</span>
            </label>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex min-h-11 items-center rounded-full px-5 font-mono text-xs uppercase tracking-widest text-pitch-touchline hover:text-pitch-marker focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex min-h-11 items-center rounded-full bg-attack px-6 font-mono text-xs font-semibold uppercase tracking-widest text-night-950 telemetry-panel-lift transition-transform hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
          >
            {confirmingSwap ? "Confirm swap & save" : "Save"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
