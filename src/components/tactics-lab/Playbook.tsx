"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTacticsPlaybook } from "@/lib/tactics-lab/usePlaybook";
import { encodeSharedBoard } from "@/lib/tactics-lab/playbookShare";
import { encodeSharedPlay } from "@/lib/scenario-mode/persistence";
import { PlaybookThumbnail } from "./PlaybookThumbnail";
import { NumberPicker } from "./NumberPicker";
import type { PlaybookEntry } from "@/lib/tactics-lab/playbookSchema";

type SortBy = "number" | "recent" | "name";
type FilterType = "all" | "formation" | "play";

const FILTERS: { value: FilterType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "formation", label: "Formations" },
  { value: "play", label: "Plays" },
];

function shareUrlFor(entry: PlaybookEntry): string {
  const origin = window.location.origin;
  if (entry.type === "play" && entry.origin === "scenario") {
    return `${origin}/tactics-lab?play=${encodeSharedPlay({ scenarioSlug: entry.scenarioSlug, tier: entry.tier, steps: entry.steps })}`;
  }
  if (entry.type === "formation") {
    return `${origin}/tactics-lab?board=${encodeSharedBoard({ kind: "formation", name: entry.name, players: entry.players, instructions: entry.instructions })}`;
  }
  return `${origin}/tactics-lab?board=${encodeSharedBoard({ kind: "play", name: entry.name, players: entry.players, instructions: entry.instructions, steps: entry.steps })}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function entryTag(entry: PlaybookEntry): string | null {
  if (entry.type === "formation") return entry.shapeName;
  if (entry.origin === "scenario") return entry.grade ? `${entry.grade[0].toUpperCase()}${entry.grade.slice(1)}` : null;
  return null;
}

type CardProps = {
  entry: PlaybookEntry;
  rotate: number;
  onLoad: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onShare: () => void;
  shared: boolean;
  renaming: boolean;
  onStartRename: () => void;
  renameValue: string;
  onRenameChange: (value: string) => void;
  onRenameConfirm: () => void;
  renumbering: boolean;
  onStartRenumber: () => void;
  onRenumberConfirm: (number: number) => void;
  onRenumberCancel: () => void;
  takenNumbers: Set<number>;
};

function PlaybookCard({
  entry,
  rotate,
  onLoad,
  onDelete,
  onDuplicate,
  onShare,
  shared,
  renaming,
  onStartRename,
  renameValue,
  onRenameChange,
  onRenameConfirm,
  renumbering,
  onStartRenumber,
  onRenumberConfirm,
  onRenumberCancel,
  takenNumbers,
}: CardProps) {
  const tag = entryTag(entry);
  return (
    <motion.div
      style={{ rotate: `${rotate}deg` }}
      className="flex flex-col gap-3 rounded-lg border border-pitch-touchline/30 bg-pitch-card p-4 shadow-[0_8px_20px_-12px_rgba(0,0,0,0.6)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="font-display text-3xl font-black leading-none text-attack">{entry.number}</span>
          <PlaybookThumbnail entry={entry} />
        </div>
        <span className="rounded-full border border-pitch-touchline/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-pitch-touchline">
          {entry.type}
        </span>
      </div>

      {renaming ? (
        <input
          autoFocus
          value={renameValue}
          maxLength={40}
          onChange={(event) => onRenameChange(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && onRenameConfirm()}
          onBlur={onRenameConfirm}
          className="rounded-md border border-pitch-touchline/40 bg-pitch-slate px-2 py-1 text-sm text-pitch-line focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
        />
      ) : (
        <p className="font-display text-lg font-bold uppercase leading-tight tracking-tight text-pitch-line">{entry.name}</p>
      )}

      <div className="flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-widest text-pitch-touchline">
        {tag && <span className="rounded-full border border-pitch-touchline/40 px-2 py-0.5">{tag}</span>}
        <span>{formatDate(entry.updatedAt)}</span>
      </div>

      {renumbering ? (
        <div className="flex flex-col gap-2">
          <NumberPicker label="New call number" value={entry.number} onChange={onRenumberConfirm} takenNumbers={takenNumbers} />
          <button type="button" onClick={onRenumberCancel} className="self-start font-mono text-[10px] uppercase tracking-widest text-pitch-touchline hover:text-pitch-marker">
            Cancel
          </button>
        </div>
      ) : (
        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1.5 font-mono text-[10px] uppercase tracking-widest">
          <button type="button" onClick={onLoad} className="text-attack hover:text-attack-hi">
            Load
          </button>
          <button type="button" onClick={onStartRename} className="text-pitch-touchline hover:text-pitch-marker">
            Rename
          </button>
          <button type="button" onClick={onStartRenumber} className="text-pitch-touchline hover:text-pitch-marker">
            Renumber
          </button>
          <button type="button" onClick={onDuplicate} className="text-pitch-touchline hover:text-pitch-marker">
            Duplicate
          </button>
          <button type="button" onClick={onShare} className="text-pitch-touchline hover:text-pitch-marker">
            {shared ? "Copied!" : "Share"}
          </button>
          <button type="button" onClick={onDelete} className="text-press hover:text-press">
            Delete
          </button>
        </div>
      )}
    </motion.div>
  );
}

type Props = {
  onLoadEntry: (entry: PlaybookEntry) => void;
};

/** The Playbook gallery (§5) — chalk pages, sorted by call number by default. */
export function Playbook({ onLoadEntry }: Props) {
  const playbook = useTacticsPlaybook();
  const reduceMotion = useReducedMotion();
  const [sortBy, setSortBy] = useState<SortBy>("number");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [renumberingId, setRenumberingId] = useState<string | null>(null);
  const [sharedId, setSharedId] = useState<string | null>(null);
  const [undo, setUndo] = useState<PlaybookEntry | null>(null);
  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const visible = useMemo(() => {
    const filtered = filterType === "all" ? playbook.entries : playbook.entries.filter((entry) => entry.type === filterType);
    return [...filtered].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "recent") return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      return a.number - b.number;
    });
  }, [playbook.entries, filterType, sortBy]);

  function handleDelete(entry: PlaybookEntry) {
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    playbook.remove(entry.id);
    setUndo(entry);
    undoTimerRef.current = setTimeout(() => setUndo(null), 6000);
  }

  function handleUndo() {
    if (!undo) return;
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    playbook.restore(undo);
    setUndo(null);
  }

  function handleShare(entry: PlaybookEntry) {
    navigator.clipboard?.writeText(shareUrlFor(entry)).then(() => {
      setSharedId(entry.id);
      setTimeout(() => setSharedId(null), 2000);
    });
  }

  // Skips the empty state while an undo is still live (§5) — otherwise
  // deleting your very last entry would hide the one thing that could bring
  // it back, right when it matters most.
  if (playbook.entries.length === 0 && !undo) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-pitch-touchline/30 bg-pitch-card p-10 text-center">
        <p className="font-display text-xl font-bold uppercase tracking-tight text-pitch-line">Empty book.</p>
        <p className="max-w-sm text-sm leading-relaxed text-pitch-touchline">
          Design something in the Lab and give it a number.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-full border border-pitch-touchline/30 bg-pitch-card p-1">
          {FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setFilterType(filter.value)}
              aria-pressed={filterType === filter.value}
              className={`rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-widest transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker ${
                filterType === filter.value ? "bg-attack text-night-950" : "text-pitch-touchline hover:text-pitch-line"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-pitch-touchline">
          Sort by
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as SortBy)}
            className="min-h-9 rounded-md border border-pitch-touchline/40 bg-pitch-card px-2 font-mono text-xs uppercase tracking-widest text-pitch-line focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
          >
            <option value="number">Number</option>
            <option value="recent">Recent</option>
            <option value="name">Name</option>
          </select>
        </label>
      </div>

      <AnimatePresence>
        {undo && (
          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-between rounded-md border border-attack/40 bg-attack/10 px-4 py-2 text-sm text-pitch-line"
          >
            <span>
              Deleted &ldquo;{undo.name}&rdquo;.
            </span>
            <button type="button" onClick={handleUndo} className="font-mono text-xs font-semibold uppercase tracking-widest text-attack underline">
              Undo
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((entry, index) => (
          <PlaybookCard
            key={entry.id}
            entry={entry}
            rotate={reduceMotion ? 0 : index % 2 === 0 ? -1 : 1}
            onLoad={() => onLoadEntry(entry)}
            onDelete={() => handleDelete(entry)}
            onDuplicate={() => playbook.duplicate(entry.id)}
            onShare={() => handleShare(entry)}
            shared={sharedId === entry.id}
            renaming={renamingId === entry.id}
            onStartRename={() => {
              setRenamingId(entry.id);
              setRenameValue(entry.name);
            }}
            renameValue={renameValue}
            onRenameChange={setRenameValue}
            onRenameConfirm={() => {
              if (renameValue.trim()) playbook.rename(entry.id, renameValue.trim());
              setRenamingId(null);
            }}
            renumbering={renumberingId === entry.id}
            onStartRenumber={() => setRenumberingId(entry.id)}
            onRenumberConfirm={(number) => {
              const conflict = playbook.findByNumber(entry.type, number);
              if (conflict && conflict.id !== entry.id) playbook.swapNumbers(entry.id, conflict.id);
              else playbook.renumber(entry.id, number);
              setRenumberingId(null);
            }}
            onRenumberCancel={() => setRenumberingId(null)}
            takenNumbers={new Set(playbook.entries.filter((e) => e.type === entry.type && e.id !== entry.id).map((e) => e.number))}
          />
        ))}
      </div>
    </div>
  );
}
