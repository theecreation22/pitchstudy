"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  equipmentLabels,
  generateProgram,
  getAllDrillIds,
  levelLabels,
  positionGroupLabels,
  type Equipment,
  type Level,
  type PositionGroup,
} from "@/lib/workouts";
import { useMyProgram } from "@/lib/workouts/myProgram";
import { PlaystylePicker } from "./PlaystylePicker";

const POSITION_GROUPS: PositionGroup[] = ["goalkeepers", "defenders", "midfielders", "attackers"];
const LEVELS: Level[] = ["youth", "amateur", "advanced"];
const EQUIPMENT_TIERS: Equipment[] = ["bodyweight", "minimal", "gym"];
const STEP_LABELS = ["Position", "Playstyle", "Level & Equipment", "Preview"];

function PillButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`inline-flex min-h-11 items-center rounded-full border px-4 font-mono text-xs uppercase tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker ${
        selected
          ? "border-attack bg-attack/10 text-attack"
          : "border-pitch-touchline/60 text-pitch-touchline hover:border-pitch-touchline hover:text-pitch-line"
      }`}
    >
      {label}
    </button>
  );
}

/** A 4-step wizard that composes the same deterministic `generateProgram` the pre-built plans use, then saves just the inputs as "My Program" (§ myProgram.ts). */
export function PlanBuilderWizard() {
  const router = useRouter();
  const { save } = useMyProgram();
  const [step, setStep] = useState(0);
  const [positionGroup, setPositionGroup] = useState<PositionGroup | undefined>(undefined);
  const [playstyleId, setPlaystyleId] = useState<string | undefined>(undefined);
  const [level, setLevel] = useState<Level>("amateur");
  const [equipment, setEquipment] = useState<Equipment>("minimal");

  const canAdvance = [positionGroup !== undefined, true, true, false][step];
  const preview = positionGroup ? generateProgram({ positionGroup, playstyleId, level, equipment }) : undefined;

  function handleSave() {
    if (!positionGroup) return;
    save({ positionGroup, playstyleId, level, equipment });
    router.push("/workouts/my-program");
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-pitch-touchline">
        {STEP_LABELS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <span className={i === step ? "text-attack" : i < step ? "text-pitch-line" : ""}>{`${i + 1}. ${label}`}</span>
            {i < STEP_LABELS.length - 1 && <span className="text-pitch-touchline/40">/</span>}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="flex flex-col gap-5"
        >
          {step === 0 && (
            <div className="flex flex-col gap-3">
              <p className="font-mono text-xs uppercase tracking-widest text-pitch-marker">Which role are you training?</p>
              <div className="flex flex-wrap gap-2">
                {POSITION_GROUPS.map((group) => (
                  <PillButton
                    key={group}
                    label={positionGroupLabels[group]}
                    selected={positionGroup === group}
                    onClick={() => {
                      setPositionGroup(group);
                      setPlaystyleId(undefined);
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {step === 1 && positionGroup && (
            <PlaystylePicker positionGroup={positionGroup} selectedId={playstyleId} onSelect={setPlaystyleId} />
          )}

          {step === 2 && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <p className="font-mono text-xs uppercase tracking-widest text-pitch-marker">Training level</p>
                <div className="flex flex-wrap gap-2">
                  {LEVELS.map((l) => (
                    <PillButton key={l} label={levelLabels[l]} selected={level === l} onClick={() => setLevel(l)} />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <p className="font-mono text-xs uppercase tracking-widest text-pitch-marker">Equipment</p>
                <div className="flex flex-wrap gap-2">
                  {EQUIPMENT_TIERS.map((eq) => (
                    <PillButton key={eq} label={equipmentLabels[eq]} selected={equipment === eq} onClick={() => setEquipment(eq)} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && preview && (
            <div className="flex flex-col gap-4 rounded-lg border border-attack/30 bg-attack/10 p-6">
              <p className="font-mono text-xs uppercase tracking-widest text-attack">Your program</p>
              <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-pitch-line">{preview.title}</h3>
              <p className="text-sm leading-relaxed text-pitch-line/90">{preview.tagline}</p>
              <p className="font-mono text-xs text-pitch-touchline">
                {preview.weeks.length} weeks · {getAllDrillIds(preview).length} drills · {levelLabels[level]} · {equipmentLabels[equipment]}
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="font-mono text-xs uppercase tracking-widest text-pitch-touchline hover:text-pitch-line disabled:opacity-30 disabled:hover:text-pitch-touchline"
        >
          ← Back
        </button>
        {step < STEP_LABELS.length - 1 ? (
          <button
            type="button"
            disabled={!canAdvance}
            onClick={() => setStep((s) => s + 1)}
            className="inline-flex min-h-11 items-center rounded-full bg-attack px-6 font-mono text-xs font-semibold uppercase tracking-widest text-night-950 transition-opacity disabled:opacity-40"
          >
            Continue →
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex min-h-11 items-center rounded-full bg-attack px-6 font-mono text-xs font-semibold uppercase tracking-widest text-night-950"
          >
            Save My Program
          </button>
        )}
      </div>
    </div>
  );
}
