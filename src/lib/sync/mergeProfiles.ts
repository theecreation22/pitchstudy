import type { QuizBest, ScenarioBest, ProgressState } from "@/lib/progress";
import { SCENARIO_GRADE_RANK } from "@/lib/progress";
import type { PlayerCard } from "@/lib/playerCard";
import type { SavedPlay } from "@/lib/scenario-mode/persistence";
import type { CloudProfile, LocalSnapshot, MergeResult } from "./types";

function union(a: string[], b: string[]): string[] {
  return Array.from(new Set([...a, ...b]));
}

function mergeQuizBestScores(
  a: Record<string, QuizBest>,
  b: Record<string, QuizBest>,
): Record<string, QuizBest> {
  const result: Record<string, QuizBest> = { ...a };
  for (const key of Object.keys(b)) {
    const existing = result[key];
    result[key] = !existing || b[key].score > existing.score ? b[key] : existing;
  }
  return result;
}

/** Same "better result" rule as progress.ts's completeScenario: higher grade wins, ties broken by fewer steps. */
function isBetterScenarioResult(candidate: ScenarioBest, current: ScenarioBest): boolean {
  if (SCENARIO_GRADE_RANK[candidate.grade] !== SCENARIO_GRADE_RANK[current.grade]) {
    return SCENARIO_GRADE_RANK[candidate.grade] > SCENARIO_GRADE_RANK[current.grade];
  }
  return candidate.steps < current.steps;
}

function mergeScenarioBests(
  a: Record<string, ScenarioBest>,
  b: Record<string, ScenarioBest>,
): Record<string, ScenarioBest> {
  const result: Record<string, ScenarioBest> = { ...a };
  for (const key of Object.keys(b)) {
    const existing = result[key];
    result[key] = !existing || isBetterScenarioResult(b[key], existing) ? b[key] : existing;
  }
  return result;
}

function mergeProgress(local: ProgressState, cloud: ProgressState | null): ProgressState {
  if (!cloud) return local;
  return {
    completedLessons: union(local.completedLessons, cloud.completedLessons),
    quizBestScores: mergeQuizBestScores(local.quizBestScores, cloud.quizBestScores),
    xp: Math.max(local.xp, cloud.xp),
    earnedBadges: union(local.earnedBadges, cloud.earnedBadges),
    challengeBestStreak: Math.max(local.challengeBestStreak, cloud.challengeBestStreak),
    scenarioBests: mergeScenarioBests(local.scenarioBests, cloud.scenarioBests),
    completedDrillInstances: union(local.completedDrillInstances, cloud.completedDrillInstances),
    trainingDates: union(local.trainingDates, cloud.trainingDates),
  };
}

/** Most-recent-`updatedAt`-wins — the field is server-trustworthy on the cloud side (Postgres trigger) and local-clock on the device side, so a tie favors local (the device the merge is running on). */
function mergePlayerCard(local: PlayerCard | undefined, cloud: PlayerCard | null): PlayerCard | undefined {
  if (!cloud) return local;
  if (!local) return cloud;
  return new Date(cloud.updatedAt).getTime() > new Date(local.updatedAt).getTime() ? cloud : local;
}

/** Union by id — every SavedPlay already carries a UUID, so this is a plain dedupe rather than a real conflict; local wins ties since ids collide only when the same save round-tripped through both sides. */
function mergePlaybook(local: SavedPlay[], cloud: SavedPlay[]): SavedPlay[] {
  const byId = new Map<string, SavedPlay>();
  for (const play of cloud) byId.set(play.id, play);
  for (const play of local) byId.set(play.id, play);
  return Array.from(byId.values());
}

function hasRealProgress(progress: ProgressState): boolean {
  return (
    progress.xp > 0 ||
    progress.completedLessons.length > 0 ||
    progress.completedDrillInstances.length > 0 ||
    progress.earnedBadges.length > 0
  );
}

/**
 * Combines a device's local snapshot with whatever a signed-in user already
 * has stored in the cloud. Generous by design — every field either takes the
 * union/max of both sides or the most-recently-edited value, so signing in
 * on a second device can only add to a player's progress, never erase it.
 */
export function mergeProfiles(local: LocalSnapshot, cloud: CloudProfile | null): MergeResult {
  if (!cloud) {
    return { playerCard: local.playerCard, progress: local.progress, playbook: local.playbook, hadConflict: false };
  }

  const hadConflict = hasRealProgress(local.progress) && !!cloud.progress && hasRealProgress(cloud.progress);

  return {
    playerCard: mergePlayerCard(local.playerCard, cloud.playerCard),
    progress: mergeProgress(local.progress, cloud.progress),
    playbook: mergePlaybook(local.playbook, cloud.playbook ?? []),
    hadConflict,
  };
}
