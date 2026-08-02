import { describe, expect, it } from "vitest";
import { mergeProfiles } from "./mergeProfiles";
import type { ProgressState } from "@/lib/progress";
import type { PlayerCard } from "@/lib/playerCard";
import type { CloudProfile, LocalSnapshot } from "./types";

function progress(overrides: Partial<ProgressState> = {}): ProgressState {
  return {
    completedLessons: [],
    quizBestScores: {},
    xp: 0,
    earnedBadges: [],
    challengeBestStreak: 0,
    scenarioBests: {},
    completedDrillInstances: [],
    trainingDates: [],
    ...overrides,
  };
}

function card(overrides: Partial<PlayerCard> = {}): PlayerCard {
  return {
    positionCode: "CM",
    positionGroup: "midfielders",
    level: "amateur",
    equipment: "minimal",
    version: 1,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

function cloudProfile(overrides: Partial<CloudProfile> = {}): CloudProfile {
  return {
    id: "user-1",
    email: "player@example.com",
    username: null,
    squadNumber: null,
    playerCard: null,
    progress: null,
    playbook: null,
    tacticsPlaybook: null,
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

function localSnapshot(overrides: Partial<LocalSnapshot> = {}): LocalSnapshot {
  return {
    playerCard: undefined,
    progress: progress(),
    playbook: [],
    tacticsPlaybook: [],
    ...overrides,
  };
}

describe("mergeProfiles", () => {
  it("passes the local snapshot through untouched when there is no cloud profile yet", () => {
    const local = localSnapshot({ playerCard: card(), progress: progress({ xp: 40 }) });
    const result = mergeProfiles(local, null);
    expect(result).toEqual({
      playerCard: local.playerCard,
      progress: local.progress,
      playbook: [],
      tacticsPlaybook: [],
      hadConflict: false,
    });
  });

  it("unions completedLessons, earnedBadges, completedDrillInstances, and trainingDates", () => {
    const local = localSnapshot({
      progress: progress({
        completedLessons: ["a/1", "a/2"],
        earnedBadges: ["first-whistle"],
        completedDrillInstances: ["plan:1:sprint"],
        trainingDates: ["2026-01-01"],
      }),
    });
    const cloud = cloudProfile({
      progress: progress({
        completedLessons: ["a/2", "a/3"],
        earnedBadges: ["clean-sheet"],
        completedDrillInstances: ["plan:1:sprint", "plan:2:agility"],
        trainingDates: ["2026-01-02"],
      }),
    });

    const result = mergeProfiles(local, cloud);

    expect(result.progress.completedLessons.sort()).toEqual(["a/1", "a/2", "a/3"]);
    expect(result.progress.earnedBadges.sort()).toEqual(["clean-sheet", "first-whistle"]);
    expect(result.progress.completedDrillInstances.sort()).toEqual(["plan:1:sprint", "plan:2:agility"]);
    expect(result.progress.trainingDates.sort()).toEqual(["2026-01-01", "2026-01-02"]);
  });

  it("takes the max of xp and challengeBestStreak", () => {
    const local = localSnapshot({ progress: progress({ xp: 120, challengeBestStreak: 4 }) });
    const cloud = cloudProfile({ progress: progress({ xp: 80, challengeBestStreak: 9 }) });

    const result = mergeProfiles(local, cloud);

    expect(result.progress.xp).toBe(120);
    expect(result.progress.challengeBestStreak).toBe(9);
  });

  it("keeps the higher quiz score per module", () => {
    const local = localSnapshot({ progress: progress({ quizBestScores: { attacking: { score: 6, total: 10 } } }) });
    const cloud = cloudProfile({
      progress: progress({
        quizBestScores: { attacking: { score: 9, total: 10 }, defending: { score: 7, total: 10 } },
      }),
    });

    const result = mergeProfiles(local, cloud);

    expect(result.progress.quizBestScores).toEqual({
      attacking: { score: 9, total: 10 },
      defending: { score: 7, total: 10 },
    });
  });

  it("keeps the better scenario result: higher grade wins regardless of steps", () => {
    const local = localSnapshot({ progress: progress({ scenarioBests: { "set-piece:easy": { grade: "silver", steps: 2 } } }) });
    const cloud = cloudProfile({ progress: progress({ scenarioBests: { "set-piece:easy": { grade: "gold", steps: 6 } } }) });

    const result = mergeProfiles(local, cloud);

    expect(result.progress.scenarioBests["set-piece:easy"]).toEqual({ grade: "gold", steps: 6 });
  });

  it("breaks a same-grade scenario tie by fewer steps", () => {
    const local = localSnapshot({ progress: progress({ scenarioBests: { "counter-attack:hard": { grade: "gold", steps: 5 } } }) });
    const cloud = cloudProfile({ progress: progress({ scenarioBests: { "counter-attack:hard": { grade: "gold", steps: 3 } } }) });

    const result = mergeProfiles(local, cloud);

    expect(result.progress.scenarioBests["counter-attack:hard"]).toEqual({ grade: "gold", steps: 3 });
  });

  it("picks the player card with the most recent updatedAt", () => {
    const local = localSnapshot({ playerCard: card({ nickname: "Old", updatedAt: "2026-01-01T00:00:00.000Z" }) });
    const cloud = cloudProfile({ playerCard: card({ nickname: "New", updatedAt: "2026-02-01T00:00:00.000Z" }) });

    const result = mergeProfiles(local, cloud);

    expect(result.playerCard?.nickname).toBe("New");
  });

  it("prefers the local player card on an exact updatedAt tie", () => {
    const same = "2026-01-01T00:00:00.000Z";
    const local = localSnapshot({ playerCard: card({ nickname: "Local", updatedAt: same }) });
    const cloud = cloudProfile({ playerCard: card({ nickname: "Cloud", updatedAt: same }) });

    const result = mergeProfiles(local, cloud);

    expect(result.playerCard?.nickname).toBe("Local");
  });

  it("falls back to whichever side has a player card when the other has none", () => {
    const localOnly = mergeProfiles(localSnapshot({ playerCard: card({ nickname: "Solo" }) }), cloudProfile({ playerCard: null }));
    expect(localOnly.playerCard?.nickname).toBe("Solo");

    const cloudOnly = mergeProfiles(localSnapshot({ playerCard: undefined }), cloudProfile({ playerCard: card({ nickname: "CloudSolo" }) }));
    expect(cloudOnly.playerCard?.nickname).toBe("CloudSolo");
  });

  it("dedupes the playbook by id, preferring the local copy of a shared id", () => {
    const shared = { id: "play-1", scenarioSlug: "set-piece", tier: "gold" as const, name: "Local version", steps: [], grade: "gold" as const, createdAt: 1 };
    const local = localSnapshot({ playbook: [shared] });
    const cloud = cloudProfile({
      playbook: [
        { ...shared, name: "Cloud version" },
        { id: "play-2", scenarioSlug: "counter-attack", tier: "silver" as const, name: "Cloud only", steps: [], grade: "silver" as const, createdAt: 2 },
      ],
    });

    const result = mergeProfiles(local, cloud);

    expect(result.playbook).toHaveLength(2);
    expect(result.playbook.find((p) => p.id === "play-1")?.name).toBe("Local version");
    expect(result.playbook.find((p) => p.id === "play-2")?.name).toBe("Cloud only");
  });

  it("dedupes the general Tactics Lab Playbook by id too, same rule as the scenario playbook", () => {
    const shared = {
      id: "entry-1",
      schemaVersion: 1 as const,
      type: "formation" as const,
      number: 7,
      name: "Local Formation",
      players: [],
      instructions: { mentality: "balanced" as const, tempo: 50, width: 50, press: "balanced" as const, line: "medium" as const },
      shapeName: "4-4-2",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    };
    const local = localSnapshot({ tacticsPlaybook: [shared] });
    const cloud = cloudProfile({
      tacticsPlaybook: [
        { ...shared, name: "Cloud Formation" },
        { ...shared, id: "entry-2", number: 8, name: "Cloud Only" },
      ],
    });

    const result = mergeProfiles(local, cloud);

    expect(result.tacticsPlaybook).toHaveLength(2);
    expect(result.tacticsPlaybook.find((e) => e.id === "entry-1")?.name).toBe("Local Formation");
    expect(result.tacticsPlaybook.find((e) => e.id === "entry-2")?.name).toBe("Cloud Only");
  });

  it("flags hadConflict only when both sides already had real progress", () => {
    const noConflict = mergeProfiles(
      localSnapshot({ progress: progress({ xp: 50 }) }),
      cloudProfile({ progress: progress({ xp: 0 }) }),
    );
    expect(noConflict.hadConflict).toBe(false);

    const conflict = mergeProfiles(
      localSnapshot({ progress: progress({ xp: 50 }) }),
      cloudProfile({ progress: progress({ xp: 30 }) }),
    );
    expect(conflict.hadConflict).toBe(true);

    const freshAccount = mergeProfiles(localSnapshot({ progress: progress({ xp: 50 }) }), cloudProfile({ progress: null }));
    expect(freshAccount.hadConflict).toBe(false);
  });
});
