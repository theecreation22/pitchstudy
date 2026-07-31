import type { PositionCode } from "../formations";

/** Kept from the original page — still the card spine color and the primary filter. */
export type DrillCategory = "strength" | "speed-agility" | "endurance" | "position-specific";

export const drillCategoryLabels: Record<DrillCategory, string> = {
  strength: "Strength",
  "speed-agility": "Speed & Agility",
  endurance: "Endurance",
  "position-specific": "Position-Specific",
};

/** The "train by movement" alternate lens (§3) — how the body moves, independent of which category a drill is filed under. */
export type MovementPattern =
  | "acceleration"
  | "deceleration"
  | "change-of-direction"
  | "jump-land"
  | "rotation"
  | "sprint-mechanics"
  | "bracing";

export const movementPatternLabels: Record<MovementPattern, string> = {
  acceleration: "Acceleration",
  deceleration: "Deceleration",
  "change-of-direction": "Change of Direction",
  "jump-land": "Jump & Land",
  rotation: "Rotation",
  "sprint-mechanics": "Sprint Mechanics",
  bracing: "Bracing",
};

/** Additive tiers — bodyweight-only content is always usable regardless of what's selected. */
export type Equipment = "bodyweight" | "minimal" | "gym";

export const equipmentLabels: Record<Equipment, string> = {
  bodyweight: "Bodyweight Only",
  minimal: "Minimal Equipment",
  gym: "Gym Access",
};

export type Level = "youth" | "amateur" | "advanced";

export const levelLabels: Record<Level, string> = {
  youth: "Youth",
  amateur: "Amateur",
  advanced: "Advanced",
};

export type PositionGroup = "goalkeepers" | "defenders" | "midfielders" | "attackers";

export const positionGroupLabels: Record<PositionGroup, string> = {
  goalkeepers: "Goalkeepers",
  defenders: "Defenders",
  midfielders: "Midfielders",
  attackers: "Attackers",
};

export type Prescription = {
  sets: number;
  /** Free text so it can be a rep count ("8-10") or a duration ("30s") — matches how real programs write dosage. */
  reps: string;
  restSeconds: number;
  tempo?: string;
  /** Rate of Perceived Effort, 1-10. The current cards show neither rest nor effort — this is the actual prescription gap being fixed. */
  effortRPE: number;
};

/** A lighter-weight variant rather than a second full Drill — authoring one line of "what changes" gives three usable difficulty levels per drill without tripling the data. */
export type DrillVariant = {
  label: string;
  change: string;
  prescription?: Partial<Prescription>;
};

export type Drill = {
  id: string;
  name: string;
  shortDescription: string;
  /** 2-4 numbered steps — the biggest content gap in the original cards, which had none. */
  execution: string[];
  /** Why this matters in a real game moment, written role-aware. */
  footballWhy: string;
  coachingCue: string;
  commonMistake: string;
  prescription: Prescription;
  progression: DrillVariant;
  regression: DrillVariant;
  category: DrillCategory;
  movementPatterns: MovementPattern[];
  positionGroups: PositionGroup[];
  /** Narrower override for drills that only suit specific codes within a group (e.g. CB-only, not all defenders). */
  positions?: PositionCode[];
  /** Explicit playstyle tags — the strongest signal in the Plan Builder's selection ranking. */
  playstyles: string[];
  equipment: Equipment;
  levels: Level[];
  isWarmup?: boolean;
  isCooldown?: boolean;
};

/** The 6-axis "attribute" vocabulary is deliberately separate from DrillCategory — a football-native, FIFA-stats-style radar for playstyles, not a filter or a per-drill tag. */
export type Attribute = "strength" | "power" | "speed" | "agility" | "endurance" | "technical";

export const attributeLabels: Record<Attribute, string> = {
  strength: "Strength",
  power: "Power",
  speed: "Speed",
  agility: "Agility",
  endurance: "Endurance",
  technical: "Technical",
};

export const ATTRIBUTES: Attribute[] = ["strength", "power", "speed", "agility", "endurance", "technical"];

/** Sets/reps/rest/RPE shift for a role, applied on top of a drill's authored baseline — never new content, always within safe general ranges. */
export type PrescriptionModifiers = {
  setsDelta?: number;
  /** Scales the numeric part(s) of `reps` where it's a plain count or range ("8-10"); left untouched for duration/circuit text ("30s", "full circuit"). */
  repsMultiplier?: number;
  restSecondsMultiplier?: number;
  effortRPEDelta?: number;
};

export type Playstyle = {
  id: string;
  positionGroup: PositionGroup;
  name: string;
  /** Set only where an exact match already exists in positions.ts — most of these archetypes are new and have no position page to link to, and that's stated rather than implied. */
  relatedPositionCode?: PositionCode;
  tagline: string;
  rationale: string;
  /** One punchy, coach-voiced line for Trial Day's mini-cards (§3) — distinct from `tagline`/`rationale`, which are written to be read, not said out loud by someone who just watched you play. */
  coachLine: string;
  /** 0-100 per axis — hand-authored, not aggregated from tagged drills, so each playstyle's radar reads as a deliberate statement. */
  attributeProfile: Record<Attribute, number>;
  /** 0-1 per category — drives the Plan Builder's session-slot allocation. */
  categoryEmphasis: Record<DrillCategory, number>;
  /** Essential movement patterns for this role — the strongest movement-relevance signal in the generator's ranking. */
  preferredMovementPatterns: MovementPattern[];
  /** Secondary movement relevance — a smaller ranking nudge than the essential list above. Optional so groups not yet migrated to the full profile still compile. */
  optionalMovementPatterns?: MovementPattern[];
  /** 2-3 existing library drills, already tagged to this playstyle, that are near-mandatory for the role — guaranteed a slot in every generated week (level/equipment permitting). Optional during migration. */
  signatureDrillIds?: string[];
  /** How this role's prescriptions shift from a drill's authored baseline. Optional during migration — absence means no shift. */
  prescriptionModifiers?: PrescriptionModifiers;
};

export const playstyles: Playstyle[] = [
  // Goalkeepers
  {
    id: "sweeper-keeper",
    positionGroup: "goalkeepers",
    name: "Sweeper-Keeper",
    relatedPositionCode: "SK",
    tagline: "Plays like an extra defender and starts attacks with the ball at feet.",
    coachLine: "You're an extra defender who happens to wear gloves.",
    rationale:
      "Spends real minutes outside the box, so needs the aerobic base and straight-line speed of a covering defender on top of goalkeeping fundamentals, plus the composure to play under pressure with feet.",
    attributeProfile: { strength: 40, power: 45, speed: 70, agility: 60, endurance: 75, technical: 80 },
    categoryEmphasis: { strength: 0.15, "speed-agility": 0.25, endurance: 0.3, "position-specific": 0.3 },
    preferredMovementPatterns: ["acceleration", "sprint-mechanics", "change-of-direction"],
    optionalMovementPatterns: ["rotation"],
    signatureDrillIds: ["gk-explosive-first-step", "gk-shuttle-sprints", "gk-distribution-accuracy"],
    prescriptionModifiers: { setsDelta: 1, restSecondsMultiplier: 0.9 },
  },
  {
    id: "shot-stopper",
    positionGroup: "goalkeepers",
    name: "Shot-Stopper",
    tagline: "Wins the game in the six-yard box with reflexes and raw power.",
    coachLine: "Six-yard box is yours. Nobody gets past you there.",
    rationale:
      "Rarely strays from the line, so training concentrates almost entirely on explosive power into a dive, reflex speed, and the strength to hold a shape against a hit ball, over the aerobic demands a sweeper-keeper needs.",
    attributeProfile: { strength: 55, power: 85, speed: 45, agility: 90, endurance: 40, technical: 50 },
    categoryEmphasis: { strength: 0.3, "speed-agility": 0.35, endurance: 0.1, "position-specific": 0.25 },
    preferredMovementPatterns: ["jump-land", "change-of-direction", "bracing"],
    optionalMovementPatterns: ["rotation"],
    signatureDrillIds: ["gk-overhead-throw", "gk-reaction-drop", "gk-low-diving-save"],
    prescriptionModifiers: { setsDelta: 1, restSecondsMultiplier: 1.15, effortRPEDelta: 1 },
  },
  // Defenders
  {
    id: "ball-playing-cb",
    positionGroup: "defenders",
    name: "Ball-Playing Center-Back",
    tagline: "Steps into midfield and breaks lines with a pass, not just a clearance.",
    coachLine: "You break lines with a pass, not just a clearance.",
    rationale:
      "Needs to repeat a clean first touch and an accurate long pass while fatigued and under a striker's press, so passing technique under load matters as much as raw physicality here.",
    attributeProfile: { strength: 65, power: 55, speed: 45, agility: 55, endurance: 60, technical: 80 },
    categoryEmphasis: { strength: 0.3, "speed-agility": 0.15, endurance: 0.2, "position-specific": 0.35 },
    preferredMovementPatterns: ["rotation", "deceleration"],
    optionalMovementPatterns: ["change-of-direction"],
    signatureDrillIds: ["def-single-leg-deadlift", "def-first-pass-accuracy"],
    prescriptionModifiers: { repsMultiplier: 1.1, restSecondsMultiplier: 0.95 },
  },
  {
    id: "aggressive-stopper",
    positionGroup: "defenders",
    name: "Aggressive Stopper",
    tagline: "Wins the physical duel first and asks questions later.",
    coachLine: "You win the physical battle first. Questions come later.",
    rationale:
      "Lives in genuine one-on-one contests and in the air, so raw strength and jump power dominate the program over the ball-playing CB's passing-under-fatigue work.",
    attributeProfile: { strength: 90, power: 80, speed: 40, agility: 50, endurance: 45, technical: 40 },
    categoryEmphasis: { strength: 0.45, "speed-agility": 0.2, endurance: 0.15, "position-specific": 0.2 },
    preferredMovementPatterns: ["jump-land", "bracing", "deceleration"],
    optionalMovementPatterns: ["change-of-direction"],
    signatureDrillIds: ["def-box-jump", "def-jump-recover-circuit"],
    prescriptionModifiers: { setsDelta: 1, effortRPEDelta: 1 },
  },
  {
    id: "overlapping-wing-back",
    positionGroup: "defenders",
    name: "Overlapping Wing-Back",
    tagline: "Covers the entire touchline, in both directions, all match.",
    coachLine: "You cover every blade of grass down that flank.",
    rationale:
      "No position runs more total distance at high intensity — the program is built around repeat-sprint endurance and the crossing technique to make all that running count.",
    attributeProfile: { strength: 45, power: 55, speed: 80, agility: 60, endurance: 90, technical: 65 },
    categoryEmphasis: { strength: 0.15, "speed-agility": 0.25, endurance: 0.4, "position-specific": 0.2 },
    preferredMovementPatterns: ["sprint-mechanics", "acceleration"],
    optionalMovementPatterns: ["deceleration"],
    signatureDrillIds: ["def-sprint-recovery", "def-long-recovery-sprint", "def-overlap-cross-timing"],
    prescriptionModifiers: { setsDelta: 1, restSecondsMultiplier: 0.85 },
  },
  {
    id: "inverted-full-back",
    positionGroup: "defenders",
    name: "Inverted Full-Back",
    relatedPositionCode: "IFB",
    tagline: "Tucks into midfield in possession instead of overlapping wide.",
    coachLine: "You tuck inside and run the game from there.",
    rationale:
      "Trades the wing-back's long straight sprints for sharp, short-area change-of-direction and close control in a crowded midfield, so the program looks much more like a midfielder's than a full-back's.",
    attributeProfile: { strength: 50, power: 60, speed: 55, agility: 80, endurance: 60, technical: 75 },
    categoryEmphasis: { strength: 0.2, "speed-agility": 0.3, endurance: 0.2, "position-specific": 0.3 },
    preferredMovementPatterns: ["change-of-direction", "rotation"],
    optionalMovementPatterns: ["deceleration"],
    signatureDrillIds: ["def-quick-feet-press", "def-tight-space-turn"],
    prescriptionModifiers: { repsMultiplier: 1.1, restSecondsMultiplier: 0.9 },
  },
  // Midfielders
  {
    id: "deep-lying-playmaker",
    positionGroup: "midfielders",
    name: "Deep-Lying Playmaker",
    relatedPositionCode: "DLP",
    tagline: "Sets the tempo from deep and rarely loses the ball.",
    coachLine: "You read the game and start attacks from deep.",
    rationale:
      "Covers ground steadily for 90 minutes rather than in explosive bursts, so the program leans heavily aerobic, with rotational core work to support turning under pressure in tight areas.",
    attributeProfile: { strength: 50, power: 40, speed: 45, agility: 60, endurance: 85, technical: 85 },
    categoryEmphasis: { strength: 0.15, "speed-agility": 0.15, endurance: 0.35, "position-specific": 0.35 },
    preferredMovementPatterns: ["rotation", "deceleration"],
    optionalMovementPatterns: ["bracing"],
    signatureDrillIds: ["mid-continuous-box-run", "mid-interval-passing", "mid-switch-of-play"],
    prescriptionModifiers: { setsDelta: 1, effortRPEDelta: -1 },
  },
  {
    id: "box-to-box",
    positionGroup: "midfielders",
    name: "Box-to-Box Midfielder",
    relatedPositionCode: "B2B",
    tagline: "The engine that covers every blade of grass, twice.",
    coachLine: "You cover every blade of grass, twice.",
    rationale:
      "The single most physically demanding midfield role — needs to repeat maximal efforts for the full 90, so repeat-high-intensity conditioning is the clear priority over any other archetype here.",
    attributeProfile: { strength: 65, power: 65, speed: 65, agility: 60, endurance: 90, technical: 60 },
    categoryEmphasis: { strength: 0.25, "speed-agility": 0.2, endurance: 0.4, "position-specific": 0.15 },
    preferredMovementPatterns: ["acceleration", "deceleration", "sprint-mechanics"],
    optionalMovementPatterns: ["jump-land"],
    signatureDrillIds: ["mid-hiit-intervals", "mid-press-recover-shuttle"],
    prescriptionModifiers: { setsDelta: 1, restSecondsMultiplier: 0.85, effortRPEDelta: 1 },
  },
  {
    id: "ball-winning-dm",
    positionGroup: "midfielders",
    name: "Ball-Winning Defensive Midfielder",
    tagline: "Steps in to end the opponent's attack before it starts.",
    coachLine: "You win it. Simple as that.",
    rationale:
      "Success is decided in the split-second deceleration into a tackle or interception, so the program prioritizes duel strength and controlled stopping power over the DLP's aerobic base or the B2B's total distance.",
    attributeProfile: { strength: 75, power: 60, speed: 50, agility: 65, endurance: 65, technical: 55 },
    categoryEmphasis: { strength: 0.35, "speed-agility": 0.25, endurance: 0.2, "position-specific": 0.2 },
    preferredMovementPatterns: ["deceleration", "bracing", "change-of-direction"],
    optionalMovementPatterns: ["acceleration"],
    signatureDrillIds: ["mid-screening-interception", "mid-step-up-knee-drive"],
    prescriptionModifiers: { setsDelta: 1, restSecondsMultiplier: 1.15, effortRPEDelta: 1 },
  },
  {
    id: "advanced-playmaker",
    positionGroup: "midfielders",
    name: "Advanced Playmaker",
    tagline: "Finds the pocket between the lines and picks the final pass.",
    coachLine: "You find the gap and pick the pass nobody else sees.",
    rationale:
      "Operates in tight, fast-closing spaces near goal, so short-area acceleration and a composed finishing touch under fatigue matter more here than the deep-lying playmaker's long-range passing endurance.",
    attributeProfile: { strength: 40, power: 55, speed: 60, agility: 75, endurance: 55, technical: 90 },
    categoryEmphasis: { strength: 0.1, "speed-agility": 0.25, endurance: 0.15, "position-specific": 0.5 },
    preferredMovementPatterns: ["acceleration", "change-of-direction", "rotation"],
    optionalMovementPatterns: ["deceleration"],
    signatureDrillIds: ["mid-turn-accelerate", "mid-first-touch-pressure"],
    prescriptionModifiers: { repsMultiplier: 1.1, restSecondsMultiplier: 0.9 },
  },
  // Attackers
  {
    id: "target-man",
    positionGroup: "attackers",
    name: "Target Man",
    tagline: "Wins the ball in the air and holds it up with his back to goal.",
    coachLine: "You win it in the air and hold it up until help arrives.",
    rationale:
      "Almost every touch happens under physical contact, so the program is built around holding strength and aerial power rather than the poacher's reactive first-step quickness.",
    attributeProfile: { strength: 85, power: 75, speed: 40, agility: 45, endurance: 55, technical: 55 },
    categoryEmphasis: { strength: 0.4, "speed-agility": 0.15, endurance: 0.15, "position-specific": 0.3 },
    preferredMovementPatterns: ["bracing", "jump-land"],
    optionalMovementPatterns: ["change-of-direction"],
    signatureDrillIds: ["att-resistance-band-hold", "att-hold-up-lay-off"],
    prescriptionModifiers: { setsDelta: 1, effortRPEDelta: 1 },
  },
  {
    id: "poacher",
    positionGroup: "attackers",
    name: "Poacher",
    tagline: "Needs half a yard and half a second — nothing more.",
    coachLine: "Half a yard, half a second — that's all you need.",
    rationale:
      "The whole job is decided by a single explosive reaction to a half-chance, so the program is almost entirely reactive first-step power and finishing under minimal touches, with comparatively little aerobic work.",
    attributeProfile: { strength: 50, power: 85, speed: 80, agility: 70, endurance: 35, technical: 75 },
    categoryEmphasis: { strength: 0.2, "speed-agility": 0.35, endurance: 0.1, "position-specific": 0.35 },
    preferredMovementPatterns: ["acceleration", "jump-land", "change-of-direction"],
    optionalMovementPatterns: ["sprint-mechanics"],
    signatureDrillIds: ["att-jump-squat", "att-reactive-finishing-cue", "att-fatigue-finishing"],
    prescriptionModifiers: { restSecondsMultiplier: 1.2, effortRPEDelta: 1 },
  },
  {
    id: "false-9",
    positionGroup: "attackers",
    name: "False 9",
    relatedPositionCode: "F9",
    tagline: "Drops deep to link play, then has to get back into the box.",
    coachLine: "You drop deep, then you're gone before they notice.",
    rationale:
      "Covers far more ground than a fixed striker, dropping to receive and then re-accelerating in behind, so the program blends genuine aerobic endurance with the turning agility to escape a marker in a crowd.",
    attributeProfile: { strength: 45, power: 55, speed: 60, agility: 75, endurance: 70, technical: 85 },
    categoryEmphasis: { strength: 0.15, "speed-agility": 0.25, endurance: 0.25, "position-specific": 0.35 },
    preferredMovementPatterns: ["rotation", "change-of-direction", "deceleration"],
    optionalMovementPatterns: ["acceleration"],
    signatureDrillIds: ["att-drop-turn-link", "att-hold-up-lay-off"],
    prescriptionModifiers: { setsDelta: 1, restSecondsMultiplier: 0.9 },
  },
  {
    id: "inside-forward",
    positionGroup: "attackers",
    name: "Inside Forward / Winger",
    tagline: "Beats a full-back on the outside, then cuts inside to shoot.",
    coachLine: "You beat your man, then you shoot.",
    rationale:
      "Repeats the same explosive 1v1 move dozens of times a match — top-end speed and change-of-direction dominate the program, on top of the repeat-sprint capacity to do it again five minutes later.",
    attributeProfile: { strength: 40, power: 70, speed: 90, agility: 85, endurance: 60, technical: 70 },
    categoryEmphasis: { strength: 0.15, "speed-agility": 0.4, endurance: 0.2, "position-specific": 0.25 },
    preferredMovementPatterns: ["acceleration", "change-of-direction", "sprint-mechanics"],
    optionalMovementPatterns: ["jump-land"],
    signatureDrillIds: ["att-change-of-direction-finishing", "att-1v1-take-on"],
    prescriptionModifiers: { setsDelta: 1, restSecondsMultiplier: 0.85 },
  },
  {
    id: "pressing-forward",
    positionGroup: "attackers",
    name: "Pressing Forward",
    tagline: "The first defender, sprinting to cut off the goalkeeper's pass.",
    coachLine: "You're the first defender the moment we lose it.",
    rationale:
      "Sprints repeatedly to press with little recovery, so repeat-high-intensity aerobic conditioning is the clear priority — this is the attacking archetype trained closest to a box-to-box midfielder.",
    attributeProfile: { strength: 55, power: 65, speed: 75, agility: 60, endurance: 85, technical: 55 },
    categoryEmphasis: { strength: 0.15, "speed-agility": 0.25, endurance: 0.4, "position-specific": 0.2 },
    preferredMovementPatterns: ["acceleration", "deceleration", "sprint-mechanics"],
    optionalMovementPatterns: ["change-of-direction"],
    signatureDrillIds: ["att-full-body-power-circuit", "att-repeated-pressing-sprint"],
    prescriptionModifiers: { restSecondsMultiplier: 0.8, effortRPEDelta: 1 },
  },
];

export function getPlaystyle(id: string): Playstyle | undefined {
  return playstyles.find((p) => p.id === id);
}

export function getPlaystylesForGroup(group: PositionGroup): Playstyle[] {
  return playstyles.filter((p) => p.positionGroup === group);
}

/** Picks which variant of a drill to foreground given a training level — youth defaults to the easier regression, advanced to the harder progression, amateur to the authored base. */
export function pickVariantForLevel(
  drill: Drill,
  level: Level,
): { label: string; prescription: Prescription; change?: string } {
  if (level === "youth") {
    return {
      label: drill.regression.label,
      change: drill.regression.change,
      prescription: { ...drill.prescription, ...drill.regression.prescription },
    };
  }
  if (level === "advanced") {
    return {
      label: drill.progression.label,
      change: drill.progression.change,
      prescription: { ...drill.prescription, ...drill.progression.prescription },
    };
  }
  return { label: "Standard", prescription: drill.prescription };
}

/** Scales the numeric part(s) of a `reps` string — a plain count ("10") or a range ("8-10") — and leaves anything else (durations, distances, "full circuit") untouched, since those aren't a rep volume to scale. */
function scaleReps(reps: string, multiplier: number): string {
  const range = reps.match(/^(\d+)-(\d+)$/);
  if (range) {
    const lo = Math.max(1, Math.round(Number(range[1]) * multiplier));
    const hi = Math.max(lo, Math.round(Number(range[2]) * multiplier));
    return `${lo}-${hi}`;
  }
  const plain = reps.match(/^(\d+)$/);
  if (plain) {
    return String(Math.max(1, Math.round(Number(plain[1]) * multiplier)));
  }
  return reps;
}

/** Applies a playstyle's `prescriptionModifiers` on top of the level-adjusted variant a drill would otherwise show — the mechanism that makes a Box-to-Box's plan train the same drill at a genuinely different dosage than a Deep-Lying Playmaker's. Bounds are sensible general ranges, not a per-person clamp. */
export function resolvePrescription(
  drill: Drill,
  level: Level,
  modifiers?: PrescriptionModifiers,
): { label: string; prescription: Prescription; change?: string } {
  const variant = pickVariantForLevel(drill, level);
  if (!modifiers || drill.isWarmup || drill.isCooldown) return variant;

  const base = variant.prescription;
  const prescription: Prescription = {
    ...base,
    sets: Math.min(6, Math.max(1, base.sets + (modifiers.setsDelta ?? 0))),
    reps: modifiers.repsMultiplier ? scaleReps(base.reps, modifiers.repsMultiplier) : base.reps,
    restSeconds: Math.max(0, Math.round((base.restSeconds * (modifiers.restSecondsMultiplier ?? 1)) / 5) * 5),
    effortRPE: Math.min(10, Math.max(1, base.effortRPE + (modifiers.effortRPEDelta ?? 0))),
  };
  return { ...variant, prescription };
}

const ATTRIBUTE_PHRASES: Record<Attribute, string> = {
  strength: "raw strength",
  power: "explosive power",
  speed: "top-end speed",
  agility: "change-of-direction agility",
  endurance: "repeat-effort endurance",
  technical: "technical control",
};

const CATEGORY_WORK_PHRASES: Record<DrillCategory, string> = {
  strength: "strength and loaded work",
  "speed-agility": "speed and agility work",
  endurance: "interval and conditioning work",
  "position-specific": "role-specific technical work",
};

/**
 * Generated from the profile, not hand-written per plan (§A5): finds the
 * playstyle's top attribute axis and the category it emphasizes most above
 * this position group's own average, and states both plainly. Re-deriving
 * this from data each time keeps it honest if a profile's numbers change.
 */
export function buildWhyItDiffersNote(playstyle: Playstyle): string {
  const topAttribute = ATTRIBUTES.reduce((best, attr) =>
    playstyle.attributeProfile[attr] > playstyle.attributeProfile[best] ? attr : best,
  ATTRIBUTES[0]);

  const groupPeers = getPlaystylesForGroup(playstyle.positionGroup);
  const categories = Object.keys(playstyle.categoryEmphasis) as DrillCategory[];
  const groupAverage = categories.reduce(
    (acc, c) => {
      acc[c] = groupPeers.reduce((sum, p) => sum + p.categoryEmphasis[c], 0) / groupPeers.length;
      return acc;
    },
    {} as Record<DrillCategory, number>,
  );
  const leadingCategory = categories.reduce((best, c) =>
    playstyle.categoryEmphasis[c] - groupAverage[c] > playstyle.categoryEmphasis[best] - groupAverage[best] ? c : best,
  categories[0]);

  const essential = playstyle.preferredMovementPatterns[0];
  const essentialPhrase = essential ? ` and ${movementPatternLabels[essential].toLowerCase()}` : "";
  // Position group labels are plural ("Midfielders") — singularize for "other __ roles" (all 4 are regular plurals).
  const groupLabelSingular = positionGroupLabels[playstyle.positionGroup].toLowerCase().replace(/s$/, "");

  return `Built around ${ATTRIBUTE_PHRASES[topAttribute]}${essentialPhrase} — expect more ${CATEGORY_WORK_PHRASES[leadingCategory]} than other ${groupLabelSingular} roles.`;
}
