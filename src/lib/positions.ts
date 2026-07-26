import type { PositionCode } from "./formations";

export type PositionInfo = {
  code: PositionCode;
  name: string;
  summary: string;
};

export const positions: Record<PositionCode, PositionInfo> = {
  GK: {
    code: "GK",
    name: "Goalkeeper",
    summary:
      "The last line of defense and, increasingly, the first line of attack. Commands the box on crosses, organizes the back line, and starts moves with distribution under pressure.",
  },
  LB: {
    code: "LB",
    name: "Left-Back",
    summary:
      "Defends the left channel one-on-one and overlaps into attack down the same side, balancing defensive discipline with the stamina to get up and down the full length of the pitch.",
  },
  RB: {
    code: "RB",
    name: "Right-Back",
    summary:
      "The mirror of the left-back on the right flank — tracks opposing wingers, tucks in centrally when the ball is far away, and supports attacks by overlapping or underlapping.",
  },
  CB: {
    code: "CB",
    name: "Center-Back",
    summary:
      "Wins aerial and ground duels against the opposition's forwards, reads danger before it develops, and is trusted with the ball to start attacks from the back.",
  },
  CDM: {
    code: "CDM",
    name: "Defensive Midfielder",
    summary:
      "Screens the back four, breaks up opposition attacks before they start, and recycles possession simply so more creative teammates further forward can do their work.",
  },
  CM: {
    code: "CM",
    name: "Central Midfielder",
    summary:
      "The engine of the team — covers box to box, links defense to attack, and balances contributing to both phases of play depending on the moment in the game.",
  },
  CAM: {
    code: "CAM",
    name: "Attacking Midfielder",
    summary:
      "Operates in the pocket between the opposition's midfield and defense, looking for the pass or the run that unlocks a settled defensive shape.",
  },
  LM: {
    code: "LM",
    name: "Left Midfielder",
    summary:
      "Patrols the left side of a flat midfield four, tracking back to help the left-back defensively and providing width in possession.",
  },
  RM: {
    code: "RM",
    name: "Right Midfielder",
    summary:
      "The mirror of the left midfielder — holds the right side of a flat midfield four, balancing defensive tracking with attacking width.",
  },
  LW: {
    code: "LW",
    name: "Left Winger",
    summary:
      "Stays high and wide on the left before cutting inside or driving at the full-back, stretching the defense and creating or finishing chances.",
  },
  RW: {
    code: "RW",
    name: "Right Winger",
    summary:
      "The mirror of the left winger on the right flank — stretches play wide, then attacks the box or cuts inside depending on which foot leads their game.",
  },
  ST: {
    code: "ST",
    name: "Striker",
    summary:
      "The team's most direct route to goal — holds up play, makes runs in behind, and is judged above all on the ability to finish chances.",
  },
};

export function getPosition(code: string): PositionInfo | undefined {
  return positions[code as PositionCode];
}
