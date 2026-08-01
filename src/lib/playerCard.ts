"use client";

import { useCallback, useMemo } from "react";
import { useLocalStorageValue } from "./useLocalStorageValue";
import type { PositionCode } from "./formations";
import {
  generateProgram,
  POSITION_TO_GROUP,
  type Equipment,
  type GeneratedProgram,
  type Level,
  type PositionGroup,
} from "./workouts";

export const PLAYER_CARD_STORAGE_KEY = "pitchstudy:player-card";
const STORAGE_KEY = PLAYER_CARD_STORAGE_KEY;

export type PlayerCard = {
  nickname?: string;
  positionCode: PositionCode;
  positionGroup: PositionGroup;
  /** undefined = Balanced */
  playstyleId?: string;
  level: Level;
  equipment: Equipment;
  /** 1-99, set during club registration (§2) — purely cosmetic, stamped on the card. Absent for guests. */
  squadNumber?: number;
  /** Bumped on every edit — becomes part of the generated program's slug, so an edited card starts a genuinely fresh block rather than silently inheriting the old one's completed-drill keys. */
  version: number;
  createdAt: string;
  /** Server-trustworthy on the synced copy (Postgres trigger sets it); local-clock here. Cross-device merge uses whichever card has the later `updatedAt` — see src/lib/sync/mergeProfiles.ts. */
  updatedAt: string;
};

export type PlayerCardInput = {
  nickname?: string;
  positionCode: PositionCode;
  playstyleId?: string;
  level: Level;
  equipment: Equipment;
  squadNumber?: number;
};

function parseCard(raw: string | null): PlayerCard | undefined {
  if (!raw) return undefined;
  try {
    return JSON.parse(raw) as PlayerCard;
  } catch {
    return undefined;
  }
}

export function blockSlug(card: PlayerCard): string {
  return `my-program-v${card.version}`;
}

export function usePlayerCard(): {
  card: PlayerCard | undefined;
  program: GeneratedProgram | undefined;
  save: (input: PlayerCardInput) => void;
  setSquadNumber: (squadNumber: number) => void;
  /** Replaces the card wholesale (used by sync's merge step) without touching `version`/the block slug — the merged card's own `version` is whatever the merge decided, not a fresh increment. */
  replace: (card: PlayerCard) => void;
  clear: () => void;
} {
  const [raw, setRaw] = useLocalStorageValue(STORAGE_KEY);
  const card = useMemo(() => parseCard(raw), [raw]);

  const program = useMemo(() => {
    if (!card) return undefined;
    return generateProgram({
      positionGroup: card.positionGroup,
      playstyleId: card.playstyleId,
      level: card.level,
      equipment: card.equipment,
      slug: blockSlug(card),
      title: card.nickname ? `${card.nickname}'s Block` : "Your Training Block",
    });
  }, [card]);

  const save = useCallback(
    (input: PlayerCardInput) => {
      const next: PlayerCard = {
        ...input,
        // A regular card edit (position/playstyle/level/kit) doesn't pass a
        // squadNumber at all — falling back to the existing one keeps it
        // from being silently wiped by every unrelated edit.
        squadNumber: input.squadNumber ?? card?.squadNumber,
        positionGroup: POSITION_TO_GROUP[input.positionCode],
        version: (card?.version ?? 0) + 1,
        createdAt: card?.createdAt ?? new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setRaw(JSON.stringify(next));
    },
    [card, setRaw],
  );

  // Deliberately doesn't call `save` / bump `version` — a squad number is
  // cosmetic and shouldn't rotate the block slug and orphan in-progress
  // training the way a position/playstyle change legitimately should.
  const setSquadNumber = useCallback(
    (squadNumber: number) => {
      if (!card) return;
      setRaw(JSON.stringify({ ...card, squadNumber, updatedAt: new Date().toISOString() }));
    },
    [card, setRaw],
  );

  const replace = useCallback((nextCard: PlayerCard) => setRaw(JSON.stringify(nextCard)), [setRaw]);

  const clear = useCallback(() => setRaw(""), [setRaw]);

  return { card, program, save, setSquadNumber, replace, clear };
}
