import type { PositionCode } from "../formations";
import { drills, getDrill } from "./drills";
import {
  ATTRIBUTES,
  getPlaystyle,
  type Attribute,
  type Drill,
  type DrillCategory,
  type Equipment,
  type Level,
  type MovementPattern,
  type Playstyle,
  type PositionGroup,
} from "./schema";

export type GeneratedWeek = {
  weekNumber: number;
  focus: string;
  drillIds: string[];
};

export type GeneratedProgram = {
  /** Slug for a pre-built plan, or a generated slug (`custom-{timestamp}`) for a builder-made one. */
  slug: string;
  positionGroup: PositionGroup;
  /** Absent = the balanced, no-single-archetype "Foundations" plan — not an arbitrary default playstyle. */
  playstyleId?: string;
  level: Level;
  equipment: Equipment;
  title: string;
  tagline: string;
  weeks: GeneratedWeek[];
};

const BALANCED_EMPHASIS: Record<DrillCategory, number> = {
  strength: 0.25,
  "speed-agility": 0.25,
  endurance: 0.25,
  "position-specific": 0.25,
};

const WEEK_FOCUS_BY_GROUP: Record<PositionGroup, string[]> = {
  goalkeepers: ["Foundations & Handling", "Reaction & Diving", "Crosses & Command", "Distribution & Game Speed"],
  defenders: ["Base Strength & Positioning", "Aerial Ability", "Duels & Recovery Pace", "Build-Up Play & Game Speed"],
  midfielders: ["Engine Building", "Passing Range", "Pressing & Recovery", "Box-to-Box Game Speed"],
  attackers: ["Explosiveness", "Finishing", "Hold-Up & 1v1s", "Game Speed & Movement"],
};

const DRILLS_PER_WEEK = 6;

/** How much each category leans on each of the radar's 6 attribute axes — derived once from the categories themselves, not per-drill data. */
const CATEGORY_ATTRIBUTE_WEIGHTS: Record<DrillCategory, Partial<Record<Attribute, number>>> = {
  strength: { strength: 1, power: 0.6 },
  "speed-agility": { speed: 0.8, agility: 0.8, power: 0.3 },
  endurance: { endurance: 1 },
  "position-specific": { technical: 1, agility: 0.3 },
};

/** Same idea for movement tags — the finer-grained signal within a category. */
const MOVEMENT_ATTRIBUTE_WEIGHTS: Record<MovementPattern, Partial<Record<Attribute, number>>> = {
  acceleration: { speed: 0.7, power: 0.4 },
  deceleration: { power: 0.5, agility: 0.3 },
  "change-of-direction": { agility: 0.8, speed: 0.3 },
  "jump-land": { power: 0.8, strength: 0.3 },
  rotation: { technical: 0.4, agility: 0.4 },
  "sprint-mechanics": { speed: 0.9 },
  bracing: { strength: 0.6, power: 0.3 },
};

/**
 * A drill's relevance to a playstyle's 6-axis attribute profile, derived
 * from the drill's *existing* category and movement tags — no new per-drill
 * data. This is what makes selection actually obey the radar rather than
 * just the 4 broad category slot-counts: two drills tied on category and
 * movement-tag overlap can still be told apart by which one leans toward
 * this playstyle's strongest axes.
 */
function attributeScore(drill: Drill, playstyle: Playstyle | undefined): number {
  if (!playstyle) return 0;
  const categoryWeights = CATEGORY_ATTRIBUTE_WEIGHTS[drill.category];
  let score = 0;
  for (const attribute of ATTRIBUTES) {
    const priority = playstyle.attributeProfile[attribute] / 100;
    const categoryWeight = categoryWeights[attribute] ?? 0;
    const movementWeight =
      drill.movementPatterns.reduce((sum, m) => sum + (MOVEMENT_ATTRIBUTE_WEIGHTS[m][attribute] ?? 0), 0) /
      Math.max(1, drill.movementPatterns.length);
    score += priority * (categoryWeight + movementWeight);
  }
  return score;
}

function equipmentAllowed(drillEquipment: Equipment, selected: Equipment): boolean {
  if (drillEquipment === "bodyweight") return true;
  if (drillEquipment === "minimal") return selected === "minimal" || selected === "gym";
  return selected === "gym";
}

/**
 * Deterministic — same inputs always produce the same program, matching the
 * rest of this project's engine/scenario-mode conventions (no randomness to
 * explain or reproduce). Rank order: explicit playstyle tag match, then
 * essential movement-pattern overlap, then attribute-profile relevance
 * (§ attributeScore — the radar-obedience signal), then optional
 * movement-pattern overlap as a final tiebreak.
 */
function rankedCandidates(
  positionGroup: PositionGroup,
  category: DrillCategory,
  level: Level,
  equipment: Equipment,
  playstyle: Playstyle | undefined,
) {
  const pool = drills.filter(
    (d) =>
      !d.isWarmup &&
      !d.isCooldown &&
      d.category === category &&
      d.positionGroups.includes(positionGroup) &&
      d.levels.includes(level) &&
      equipmentAllowed(d.equipment, equipment),
  );

  return pool
    .map((d) => {
      const explicitMatch = playstyle ? d.playstyles.includes(playstyle.id) : false;
      const essentialOverlap = playstyle
        ? d.movementPatterns.filter((m) => playstyle.preferredMovementPatterns.includes(m)).length
        : 0;
      const optionalOverlap = playstyle
        ? d.movementPatterns.filter((m) => (playstyle.optionalMovementPatterns ?? []).includes(m)).length
        : 0;
      return { drill: d, explicitMatch, essentialOverlap, optionalOverlap, attribute: attributeScore(d, playstyle) };
    })
    .sort((a, b) => {
      if (a.explicitMatch !== b.explicitMatch) return a.explicitMatch ? -1 : 1;
      if (a.essentialOverlap !== b.essentialOverlap) return b.essentialOverlap - a.essentialOverlap;
      if (a.attribute !== b.attribute) return b.attribute - a.attribute;
      if (a.optionalOverlap !== b.optionalOverlap) return b.optionalOverlap - a.optionalOverlap;
      return 0;
    })
    .map((c) => c.drill);
}

function pickWarmupCooldown(level: Level, equipment: Equipment, isWarmup: boolean): string[] {
  return drills
    .filter(
      (d) =>
        (isWarmup ? d.isWarmup : d.isCooldown) && d.levels.includes(level) && equipmentAllowed(d.equipment, equipment),
    )
    .map((d) => d.id);
}

export type GenerateProgramInput = {
  positionGroup: PositionGroup;
  playstyleId?: string;
  level: Level;
  equipment: Equipment;
  slug?: string;
  title?: string;
  tagline?: string;
};

export function generateProgram(input: GenerateProgramInput): GeneratedProgram {
  const playstyle = input.playstyleId ? getPlaystyle(input.playstyleId) : undefined;
  const emphasis = playstyle?.categoryEmphasis ?? BALANCED_EMPHASIS;
  const categories: DrillCategory[] = ["strength", "speed-agility", "endurance", "position-specific"];

  // Largest-remainder apportionment (not independent per-category rounding)
  // — with 4 categories tied at equal emphasis, rounding each in isolation
  // (1.5 -> 2 four times = 8) overshoots the 6-slot budget by 2, and handing
  // that whole -2 correction to a single category can zero it out entirely,
  // which is what silently dropped strength from the balanced GK plan. This
  // floors every category first, then hands the leftover slots one at a time
  // to whichever has the largest fractional remainder, so no category is
  // ever shorted by more than a single slot.
  const rawCounts = categories.map((c) => emphasis[c] * DRILLS_PER_WEEK);
  const counts = rawCounts.map(Math.floor);
  let remaining = DRILLS_PER_WEEK - counts.reduce((a, b) => a + b, 0);
  const remainders = rawCounts.map((v, i) => ({ i, frac: v - counts[i] })).sort((a, b) => b.frac - a.frac);
  for (const { i } of remainders) {
    if (remaining <= 0) break;
    counts[i] += 1;
    remaining -= 1;
  }

  const focusLines = WEEK_FOCUS_BY_GROUP[input.positionGroup];

  // Ranking (playstyle/movement relevance) is identical every week by
  // definition, so without rotation a small pool — some position groups have
  // as few as 3 drills in a category — would pick the exact same top-N drills
  // for all 4 weeks. Each week starts its slice further into the ranked list
  // (wrapping around), so a real four-week program actually varies while
  // still favoring the most relevant drills first whenever the pool is large.
  const weeks: GeneratedWeek[] = [1, 2, 3, 4].map((weekNumber) => {
    const drillIds: string[] = [];
    // Per-category slots left after signature drills claim theirs below —
    // starts as a copy of `counts` and only ever decreases.
    const remainingNeed = [...counts];

    // Guarantee the role's signature drills first (§A4 step 2), provided
    // they pass this plan's level/equipment and fit their category's
    // budget — never invented, always one of the drills already tagged to
    // this playstyle in the library.
    for (const signatureId of playstyle?.signatureDrillIds ?? []) {
      const drill = getDrill(signatureId);
      if (!drill || drill.isWarmup || drill.isCooldown || drillIds.includes(drill.id)) continue;
      if (!drill.levels.includes(input.level) || !equipmentAllowed(drill.equipment, input.equipment)) continue;
      const categoryIndex = categories.indexOf(drill.category);
      if (categoryIndex === -1 || remainingNeed[categoryIndex] <= 0) continue;
      drillIds.push(drill.id);
      remainingNeed[categoryIndex] -= 1;
    }

    categories.forEach((category, i) => {
      const need = remainingNeed[i];
      if (need <= 0) return;
      const ranked = rankedCandidates(input.positionGroup, category, input.level, input.equipment, playstyle);
      if (ranked.length === 0) return;
      const offset = ((weekNumber - 1) * need) % ranked.length;
      const rotated = [...ranked.slice(offset), ...ranked.slice(0, offset)];
      for (const candidate of rotated) {
        if (drillIds.includes(candidate.id)) continue; // no immediate repeat within the same week
        drillIds.push(candidate.id);
        if (drillIds.filter((id) => getDrill(id)?.category === category).length >= counts[i]) break;
      }
    });

    return { weekNumber, focus: focusLines[weekNumber - 1], drillIds };
  });

  const groupLabel = input.positionGroup[0].toUpperCase() + input.positionGroup.slice(1);
  return {
    slug: input.slug ?? input.positionGroup,
    positionGroup: input.positionGroup,
    playstyleId: input.playstyleId,
    level: input.level,
    equipment: input.equipment,
    title: input.title ?? `${playstyle ? playstyle.name : groupLabel} Foundations`,
    tagline: input.tagline ?? playstyle?.tagline ?? "A four-week foundations plan built from the drill library.",
    weeks,
  };
}

/** One-tap starting points (§5) — the balanced "Foundations" plan per group, generated the same way a custom program would be, just with no single archetype favored. */
export const workoutPlans: GeneratedProgram[] = [
  generateProgram({
    slug: "goalkeepers",
    positionGroup: "goalkeepers",
    level: "amateur",
    equipment: "minimal",
    title: "Goalkeeper Foundations",
    tagline: "Reflexes, footwork, and shot-stopping fundamentals for a season-ready goalkeeper.",
  }),
  generateProgram({
    slug: "defenders",
    positionGroup: "defenders",
    level: "amateur",
    equipment: "minimal",
    title: "Defender Foundations",
    tagline: "Duels, aerial ability, and recovery pace for full-backs, wing-backs, and center-backs.",
  }),
  generateProgram({
    slug: "midfielders",
    positionGroup: "midfielders",
    level: "amateur",
    equipment: "minimal",
    title: "Midfielder Foundations",
    tagline: "Engine, range, and pressing triggers for holding, box-to-box, and attacking midfielders.",
  }),
  generateProgram({
    slug: "attackers",
    positionGroup: "attackers",
    level: "amateur",
    equipment: "minimal",
    title: "Attacker Foundations",
    tagline: "Explosiveness, finishing, and movement for wingers and strikers.",
  }),
];

const POSITION_TO_GROUP: Record<PositionCode, PositionGroup> = {
  GK: "goalkeepers",
  SK: "goalkeepers",
  LB: "defenders",
  RB: "defenders",
  CB: "defenders",
  LWB: "defenders",
  RWB: "defenders",
  IFB: "defenders",
  CDM: "midfielders",
  CM: "midfielders",
  CAM: "midfielders",
  LM: "midfielders",
  RM: "midfielders",
  B2B: "midfielders",
  DLP: "midfielders",
  LW: "attackers",
  RW: "attackers",
  ST: "attackers",
  F9: "attackers",
  IW: "attackers",
};

export function getWorkoutPlan(slug: string): GeneratedProgram | undefined {
  return workoutPlans.find((plan) => plan.slug === slug);
}

export function getWorkoutPlanForPosition(code: PositionCode): GeneratedProgram | undefined {
  const group = POSITION_TO_GROUP[code];
  return group ? getWorkoutPlan(group) : undefined;
}

export function getWarmupDrillIds(level: Level, equipment: Equipment): string[] {
  return pickWarmupCooldown(level, equipment, true);
}

export function getCooldownDrillIds(level: Level, equipment: Equipment): string[] {
  return pickWarmupCooldown(level, equipment, false);
}

export function getAllDrillIds(program: GeneratedProgram): string[] {
  return program.weeks.flatMap((week) => week.drillIds);
}

/** XP a single drill instance awards on completion — shared by the manual checklist and Session Mode so they ride the same reward, not two different numbers. */
export const DRILL_XP = 15;

/** The same drill can legitimately appear in more than one week, and the same drill id can appear across different plans — so this keys by (plan, week, drill) rather than by drill id alone. */
export function instanceKey(slug: string, weekNumber: number, drillId: string): string {
  return `${slug}:${weekNumber}:${drillId}`;
}
