import { motion, useReducedMotion } from "framer-motion";
import type { ScenarioResult } from "@/lib/scenario-mode/evaluation";

const OUTCOME_LABEL: Record<ScenarioResult["outcome"], string> = {
  GOAL: "GOAL",
  CHANCE_CREATED: "CHANCE CREATED",
  PLAY_BROKEN_UP: "PLAY BROKEN UP",
  TOO_SLOW: "TOO SLOW",
};

const OUTCOME_STYLE: Record<ScenarioResult["outcome"], string> = {
  GOAL: "border-attack bg-attack/10 text-attack",
  CHANCE_CREATED: "border-attack/60 bg-attack/5 text-attack",
  PLAY_BROKEN_UP: "border-press bg-press/10 text-press",
  TOO_SLOW: "border-press/60 bg-press/5 text-press",
};

const GRADE_LABEL: Record<string, string> = { gold: "Gold", silver: "Silver", bronze: "Bronze" };

export function ScenarioOutcomePanel({ result }: { result: ScenarioResult }) {
  const reduceMotion = useReducedMotion();
  const succeeded = result.outcome === "GOAL" || result.outcome === "CHANCE_CREATED";

  return (
    <motion.div
      initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
      animate={{ opacity: 1, y: 0, scale: succeeded && !reduceMotion ? [1, 1.03, 1] : 1 }}
      transition={{ duration: reduceMotion ? 0 : 0.4 }}
      className={`flex flex-col gap-2 rounded-lg border-2 p-4 ${OUTCOME_STYLE[result.outcome]}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-display text-2xl font-black uppercase tracking-tight">{OUTCOME_LABEL[result.outcome]}</p>
        {result.grade && (
          <span className="font-mono text-xs uppercase tracking-widest">{GRADE_LABEL[result.grade]} grade</span>
        )}
      </div>
      <p className="text-sm leading-relaxed text-pitch-line/90">{result.reason}</p>
    </motion.div>
  );
}
