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
  /** Bumped on every edit — becomes part of the generated program's slug, so an edited card starts a genuinely fresh block rather than silently inheriting the old one's completed-drill keys. */
  version: number;
  createdAt: string;
};

export type PlayerCardInput = {
  nickname?: string;
  positionCode: PositionCode;
  playstyleId?: string;
  level: Level;
  equipment: Equipment;
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
        positionGroup: POSITION_TO_GROUP[input.positionCode],
        version: (card?.version ?? 0) + 1,
        createdAt: card?.createdAt ?? new Date().toISOString(),
      };
      setRaw(JSON.stringify(next));
    },
    [card, setRaw],
  );

  const clear = useCallback(() => setRaw(""), [setRaw]);

  return { card, program, save, clear };
}
