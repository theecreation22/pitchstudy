import type { FormationPlayer, PositionCode } from "@/lib/formations";
import type { LabPlayer } from "./designSchema";
import { countByLine, type EngineNote } from "./engine";

/** Reshapes a (already-mirrored) opponent lineup into the LabPlayer shape so it can be run through the same role-weighted line counting as the user's own design. */
function asLabPlayers(players: FormationPlayer[]): LabPlayer[] {
  return players.map((p) => ({ id: p.id, role: p.code, x: p.x, y: p.y }));
}

type Channel = "left" | "center" | "right";

function countInChannel(players: { x: number }[], channel: Channel): number {
  return players.filter((p) => {
    if (channel === "left") return p.x < 35;
    if (channel === "right") return p.x > 65;
    return p.x >= 35 && p.x <= 65;
  }).length;
}

/** Only the "true" back line — center-backs and out-and-out full-backs. Wing-backs are excluded since advancing high is their normal job (see DEPTH_CHECK_EXEMPT in formations.ts), not a sign of a risky high line. */
const LAST_LINE_CODES: ReadonlySet<PositionCode> = new Set(["CB", "LB", "RB"]);

function lastLineAverageY(players: { role: PositionCode; y: number }[]): number | null {
  const backLine = players.filter((p) => LAST_LINE_CODES.has(p.role));
  if (backLine.length === 0) return null;
  return backLine.reduce((sum, p) => sum + p.y, 0) / backLine.length;
}

/** Below this, the user's own (unmirrored, attacking toward y=0) last line is high enough up the pitch to leave space in behind. */
const HIGH_LINE_THRESHOLD_MINE = 68;
/** Above this, the (mirrored, attacking toward y=100) opponent's last line has pushed high enough to leave space in behind. Symmetric with the threshold above once mirrored (100 - 68 = 32). */
const HIGH_LINE_THRESHOLD_OPPONENT = 32;

/**
 * Deterministic, zone-based comparison between the user's design and a mirrored opponent
 * formation sharing the same pitch — numerical overloads by channel, a central midfield
 * count battle, and space left behind a high defensive line on either side.
 */
export function computeMatchupNotes(myPlayers: LabPlayer[], opponentMirrored: FormationPlayer[]): EngineNote[] {
  const notes: EngineNote[] = [];
  const myOutfield = myPlayers.filter((p) => p.role !== "GK" && p.role !== "SK");
  const oppOutfield = asLabPlayers(opponentMirrored).filter((p) => p.role !== "GK");

  for (const [channel, label] of [["left", "left"], ["right", "right"]] as const) {
    const mine = countInChannel(myOutfield, channel);
    const theirs = countInChannel(oppOutfield, channel);
    if (theirs - mine >= 2) {
      notes.push({ severity: "bad", text: `They have ${theirs} players out ${label} against your ${mine} — a ${theirs}v${mine} overload they can exploit.` });
    } else if (mine - theirs >= 2) {
      notes.push({ severity: "good", text: `You outnumber them ${mine}v${theirs} out ${label} — a promising channel to attack down.` });
    }
  }

  const myMidfield = countByLine(myPlayers).midfield;
  const oppMidfield = countByLine(asLabPlayers(opponentMirrored)).midfield;
  if (oppMidfield - myMidfield >= 1.5) {
    notes.push({ severity: "bad", text: `They outnumber you centrally ${oppMidfield.toFixed(1)} to ${myMidfield.toFixed(1)} — expect to be squeezed for time on the ball.` });
  } else if (myMidfield - oppMidfield >= 1.5) {
    notes.push({ severity: "good", text: `You outnumber them centrally ${myMidfield.toFixed(1)} to ${oppMidfield.toFixed(1)} — a strong platform to control the game.` });
  }

  const myLastLine = lastLineAverageY(myOutfield);
  if (myLastLine !== null && myLastLine < HIGH_LINE_THRESHOLD_MINE) {
    notes.push({ severity: "warn", text: "Your defensive line sits high against this opponent — a lost ball invites a fast break in behind." });
  }
  const oppLastLine = lastLineAverageY(oppOutfield);
  if (oppLastLine !== null && oppLastLine > HIGH_LINE_THRESHOLD_OPPONENT) {
    notes.push({ severity: "good", text: "Their defensive line sits high — direct, pacey play in behind could find joy." });
  }

  if (notes.length === 0) {
    notes.push({ severity: "good", text: "No clear numerical mismatch against this opponent — an evenly matched battle by the numbers." });
  }

  return notes.slice(0, 4);
}

export type ZoneSeverity = "overload" | "hole" | "even";
export type MatchupZone = { channel: Channel; mine: number; theirs: number; severity: ZoneSeverity };

function severityFor(mine: number, theirs: number): ZoneSeverity {
  if (theirs - mine >= 2) return "hole";
  if (mine - theirs >= 2) return "overload";
  return "even";
}

/**
 * The same left/center/right channel counts `computeMatchupNotes` already
 * derives numerical-mismatch sentences from, exposed as structured data
 * instead of prose — lets the UI render this spatially (a tinted mini-pitch)
 * rather than as a bare sentence. Additive: doesn't change
 * `computeMatchupNotes`'s own signature or output.
 */
export function computeMatchupZones(myPlayers: LabPlayer[], opponentMirrored: FormationPlayer[]): MatchupZone[] {
  const myOutfield = myPlayers.filter((p) => p.role !== "GK" && p.role !== "SK");
  const oppOutfield = asLabPlayers(opponentMirrored).filter((p) => p.role !== "GK");

  return (["left", "center", "right"] as const).map((channel) => {
    const mine = countInChannel(myOutfield, channel);
    const theirs = countInChannel(oppOutfield, channel);
    return { channel, mine, theirs, severity: severityFor(mine, theirs) };
  });
}
