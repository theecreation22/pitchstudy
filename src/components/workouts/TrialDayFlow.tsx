"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  equipmentLabels,
  getPlaystylesForGroup,
  levelLabels,
  POSITION_TO_GROUP,
  type Attribute,
  type Equipment,
  type Level,
} from "@/lib/workouts";
import { getPosition } from "@/lib/positions";
import type { PositionCode } from "@/lib/formations";
import { usePlayerCard, type PlayerCardInput } from "@/lib/playerCard";
import { TrialDayPitchPicker } from "./TrialDayPitchPicker";
import { AttributeRadar } from "./AttributeRadar";
import { PlayerCardView } from "./PlayerCardView";

const LEVELS: Level[] = ["youth", "amateur", "advanced"];
const EQUIPMENT_TIERS: Equipment[] = ["bodyweight", "minimal", "gym"];
const BALANCED_PROFILE: Record<Attribute, number> = { strength: 55, power: 55, speed: 55, agility: 55, endurance: 55, technical: 55 };

type Step = "position" | "playstyle" | "kit" | "reveal";

function StepShell({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
      transition={{ duration: reduceMotion ? 0 : 0.25, ease: "easeOut" }}
      className="flex flex-col items-center gap-6 text-center"
    >
      <div className="flex flex-col gap-1">
        <p className="font-mono text-xs uppercase tracking-widest text-attack">{eyebrow}</p>
        <h2 className="font-display text-3xl font-black uppercase leading-none tracking-tight text-pitch-line sm:text-4xl">
          {title}
        </h2>
      </div>
      {children}
    </motion.div>
  );
}

/** Replaces the old numbered-step wizard (§3) — the same four questions, asked one screen at a time in a coach's voice, ending in an assembled Player Card rather than a settings summary. */
export function TrialDayFlow({ onComplete }: { onComplete: () => void }) {
  const { card: existingCard, save } = usePlayerCard();
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState<Step>("position");
  const [positionCode, setPositionCode] = useState<PositionCode | undefined>(existingCard?.positionCode);
  const [playstyleId, setPlaystyleId] = useState<string | undefined>(existingCard?.playstyleId);
  const [level, setLevel] = useState<Level>(existingCard?.level ?? "amateur");
  const [equipment, setEquipment] = useState<Equipment>(existingCard?.equipment ?? "minimal");
  const [nickname, setNickname] = useState(existingCard?.nickname ?? "");
  const [savedCard, setSavedCard] = useState<PlayerCardInput | undefined>(undefined);

  const positionGroup = positionCode ? POSITION_TO_GROUP[positionCode] : undefined;
  const playstyles = positionGroup ? getPlaystylesForGroup(positionGroup) : [];
  const position = positionCode ? getPosition(positionCode) : undefined;

  function handlePositionSelect(code: PositionCode) {
    setPositionCode(code);
    setPlaystyleId(undefined);
    window.setTimeout(() => setStep("playstyle"), 550);
  }

  function handleRevealEnter() {
    if (!positionCode) return;
    const input: PlayerCardInput = { nickname: nickname || undefined, positionCode, playstyleId, level, equipment };
    save(input);
    setSavedCard(input);
    setStep("reveal");
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-8 px-4 py-16">
      <AnimatePresence mode="wait">
        {step === "position" && (
          <StepShell key="position" eyebrow="Trial Day · 1 of 3" title="Where do you play?">
            <p className="max-w-sm text-sm leading-relaxed text-pitch-touchline">Tap your spot on the pitch.</p>
            <TrialDayPitchPicker value={positionCode} onSelect={handlePositionSelect} />
          </StepShell>
        )}

        {step === "playstyle" && position && (
          <StepShell
            key="playstyle"
            eyebrow="Trial Day · 2 of 3"
            title={`What kind of ${position.name.toLowerCase()} are you?`}
          >
            <div className="grid w-full gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setPlaystyleId(undefined)}
                aria-pressed={!playstyleId}
                className={`flex flex-col gap-2 rounded-lg border p-4 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker ${
                  !playstyleId ? "border-attack bg-attack/10" : "border-pitch-touchline/30 bg-pitch-card hover:border-pitch-touchline"
                }`}
              >
                <span className="font-display text-lg font-bold uppercase tracking-tight text-pitch-line">Balanced</span>
                <span className="text-sm leading-relaxed text-pitch-touchline">
                  An even week across the board. Pick your game below and we&apos;ll tilt it instead.
                </span>
              </button>
              {playstyles.map((style) => {
                const isSelected = playstyleId === style.id;
                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setPlaystyleId(style.id)}
                    aria-pressed={isSelected}
                    className={`flex flex-col gap-2 rounded-lg border p-4 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker ${
                      isSelected ? "border-attack bg-attack/10" : "border-pitch-touchline/30 bg-pitch-card hover:border-pitch-touchline"
                    }`}
                  >
                    <span className="font-display text-lg font-bold uppercase tracking-tight text-pitch-line">{style.name}</span>
                    <span className="text-sm leading-relaxed text-pitch-touchline">{style.coachLine}</span>
                  </button>
                );
              })}
            </div>

            <div className="w-full max-w-[160px]">
              <AttributeRadar
                profile={playstyles.find((s) => s.id === playstyleId)?.attributeProfile ?? BALANCED_PROFILE}
                color={playstyleId ? "var(--attack)" : "var(--touchline-muted)"}
              />
            </div>

            <button
              type="button"
              onClick={() => setStep("kit")}
              className="inline-flex min-h-11 items-center rounded-full bg-attack px-8 font-mono text-xs font-semibold uppercase tracking-widest text-night-950"
            >
              Continue
            </button>
          </StepShell>
        )}

        {step === "kit" && (
          <StepShell key="kit" eyebrow="Trial Day · 3 of 3" title="Level and kit?">
            <p className="max-w-sm text-sm leading-relaxed text-pitch-touchline">What have you got to work with?</p>

            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap justify-center gap-2">
                {LEVELS.map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLevel(l)}
                    aria-pressed={level === l}
                    className={`inline-flex min-h-11 items-center rounded-full border px-5 font-mono text-xs uppercase tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker ${
                      level === l ? "border-attack bg-attack/10 text-attack" : "border-pitch-touchline/60 text-pitch-touchline hover:border-pitch-touchline"
                    }`}
                  >
                    {levelLabels[l]}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {EQUIPMENT_TIERS.map((eq) => (
                  <button
                    key={eq}
                    type="button"
                    onClick={() => setEquipment(eq)}
                    aria-pressed={equipment === eq}
                    className={`inline-flex min-h-11 items-center rounded-full border px-5 font-mono text-xs uppercase tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker ${
                      equipment === eq ? "border-attack bg-attack/10 text-attack" : "border-pitch-touchline/60 text-pitch-touchline hover:border-pitch-touchline"
                    }`}
                  >
                    {equipmentLabels[eq]}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={nickname}
                onChange={(event) => setNickname(event.target.value)}
                placeholder="What should we call you? (optional)"
                maxLength={24}
                className="rounded-full border border-pitch-touchline/40 bg-pitch-card px-5 py-2.5 text-center text-sm text-pitch-line placeholder:text-pitch-touchline/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
              />
            </div>

            <button
              type="button"
              onClick={handleRevealEnter}
              className="inline-flex min-h-11 items-center rounded-full bg-attack px-8 font-mono text-xs font-semibold uppercase tracking-widest text-night-950"
            >
              Set Up My Card
            </button>
          </StepShell>
        )}

        {step === "reveal" && savedCard && (
          <motion.div
            key="reveal"
            initial={reduceMotion ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.3 }}
            className="flex w-full flex-col items-center gap-6 text-center"
          >
            <p className="font-mono text-xs uppercase tracking-widest text-attack">Here&apos;s your card.</p>
            <div className="w-full max-w-xl">
              <PlayerCardView
                card={{
                  ...savedCard,
                  positionGroup: positionGroup!,
                  version: 1,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                }}
              />
            </div>
            <button
              type="button"
              onClick={onComplete}
              className="inline-flex min-h-11 items-center rounded-full bg-attack px-8 font-mono text-sm font-semibold uppercase tracking-widest text-night-950"
            >
              Start My Block →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
