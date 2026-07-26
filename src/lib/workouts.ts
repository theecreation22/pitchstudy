import type { PositionCode } from "./formations";

export type DrillCategory = "strength" | "speed-agility" | "endurance" | "position-specific";

export const drillCategoryLabels: Record<DrillCategory, string> = {
  strength: "Strength",
  "speed-agility": "Speed & Agility",
  endurance: "Endurance",
  "position-specific": "Position-Specific",
};

export type Drill = {
  id: string;
  name: string;
  category: DrillCategory;
  description: string;
  dosage: string;
};

export type WorkoutWeek = {
  weekNumber: number;
  focus: string;
  drills: Drill[];
};

export type WorkoutPlan = {
  slug: string;
  group: string;
  title: string;
  tagline: string;
  positionCodes: PositionCode[];
  weeks: WorkoutWeek[];
};

export const workoutPlans: WorkoutPlan[] = [
  {
    slug: "goalkeepers",
    group: "Goalkeepers",
    title: "Goalkeeper Foundations",
    tagline: "Reflexes, footwork, and shot-stopping fundamentals for a season-ready goalkeeper.",
    positionCodes: ["GK", "SK"],
    weeks: [
      {
        weekNumber: 1,
        focus: "Foundations & Handling",
        drills: [
          {
            id: "gk-w1-strength",
            name: "Plank-to-catch stability holds",
            category: "strength",
            description: "Hold a plank while catching and releasing a ball to build core stability under load.",
            dosage: "3 x 30s",
          },
          {
            id: "gk-w1-agility",
            name: "Ladder footwork — lateral shuffle",
            category: "speed-agility",
            description: "Quick lateral steps through an agility ladder to sharpen footwork before setting for a save.",
            dosage: "4 x 20s",
          },
          {
            id: "gk-w1-endurance",
            name: "Interval shuttle sprints",
            category: "endurance",
            description: "Short recovery sprints between the goalposts to build match-speed endurance.",
            dosage: "8 x 15m",
          },
          {
            id: "gk-w1-position",
            name: "Two-handed catching against a wall",
            category: "position-specific",
            description: "Repeated basic handling reps to groove clean catching technique.",
            dosage: "3 x 15 reps",
          },
        ],
      },
      {
        weekNumber: 2,
        focus: "Reaction & Diving",
        drills: [
          {
            id: "gk-w2-strength",
            name: "Single-leg glute bridges",
            category: "strength",
            description: "Build hip strength for a more powerful push-off into a dive.",
            dosage: "3 x 12 each leg",
          },
          {
            id: "gk-w2-agility",
            name: "Reaction ball drops",
            category: "speed-agility",
            description: "A partner drops an unpredictably bouncing ball for you to react to and catch.",
            dosage: "3 x 10",
          },
          {
            id: "gk-w2-endurance",
            name: "Repeated dive-and-recover circuit",
            category: "endurance",
            description: "Low dive, get back to your feet, reset, repeat — building recovery speed after going to ground.",
            dosage: "4 x 8",
          },
          {
            id: "gk-w2-position",
            name: "Low diving save repetitions",
            category: "position-specific",
            description: "Technique-focused low dives onto a soft surface, alternating sides.",
            dosage: "3 x 10 each side",
          },
        ],
      },
      {
        weekNumber: 3,
        focus: "Crosses & Command",
        drills: [
          {
            id: "gk-w3-strength",
            name: "Overhead med-ball throws",
            category: "strength",
            description: "Explosive upper-body power to help punch away crosses under pressure.",
            dosage: "3 x 10",
          },
          {
            id: "gk-w3-agility",
            name: "Cone box footwork",
            category: "speed-agility",
            description: "Quick multidirectional steps around a small cone box to stay light on your feet.",
            dosage: "4 x 20s",
          },
          {
            id: "gk-w3-endurance",
            name: "High-rep catching under fatigue",
            category: "endurance",
            description: "Catching repetitions performed right after a short sprint to simulate late-game fatigue.",
            dosage: "3 x 12",
          },
          {
            id: "gk-w3-position",
            name: "Cross claiming practice",
            category: "position-specific",
            description: "Practice claiming served crosses at the highest possible point.",
            dosage: "3 x 10",
          },
        ],
      },
      {
        weekNumber: 4,
        focus: "Distribution & Game Speed",
        drills: [
          {
            id: "gk-w4-strength",
            name: "Rotational core throws",
            category: "strength",
            description: "Build core power to support long, accurate throws.",
            dosage: "3 x 10 each side",
          },
          {
            id: "gk-w4-agility",
            name: "Explosive first-step drills",
            category: "speed-agility",
            description: "Short, sharp bursts off your line to close down space quickly.",
            dosage: "4 x 10",
          },
          {
            id: "gk-w4-endurance",
            name: "Full-session simulation",
            category: "endurance",
            description: "A condensed scrimmage-style session combining shot-stopping and distribution.",
            dosage: "20 minutes",
          },
          {
            id: "gk-w4-position",
            name: "Long and short distribution accuracy",
            category: "position-specific",
            description: "Alternate short throws and long goal-kicks at targets to build range and accuracy.",
            dosage: "3 x 8 each",
          },
        ],
      },
    ],
  },
  {
    slug: "defenders",
    group: "Defenders",
    title: "Defender Foundations",
    tagline: "Duels, aerial ability, and recovery pace for full-backs, wing-backs, and center-backs.",
    positionCodes: ["CB", "LB", "RB", "LWB", "RWB", "IFB"],
    weeks: [
      {
        weekNumber: 1,
        focus: "Base Strength & Positioning",
        drills: [
          {
            id: "def-w1-strength",
            name: "Goblet squats",
            category: "strength",
            description: "Build lower-body strength to win physical duels against attackers.",
            dosage: "3 x 10",
          },
          {
            id: "def-w1-agility",
            name: "Backpedal-to-sprint transitions",
            category: "speed-agility",
            description: "Practice the defensive footwork of backing off before exploding into a recovery sprint.",
            dosage: "4 x 15m",
          },
          {
            id: "def-w1-endurance",
            name: "Repeated sprint recovery runs",
            category: "endurance",
            description: "Short sprints with brief recovery to mirror the stop-start demands of a match.",
            dosage: "6 x 30m",
          },
          {
            id: "def-w1-position",
            name: "Jockeying and channel drills",
            category: "position-specific",
            description: "Practice showing an attacker away from goal and into a low-danger area.",
            dosage: "3 x 10 reps",
          },
        ],
      },
      {
        weekNumber: 2,
        focus: "Aerial Ability",
        drills: [
          {
            id: "def-w2-strength",
            name: "Box jumps",
            category: "strength",
            description: "Explosive leg power to win more headers in both boxes.",
            dosage: "3 x 8",
          },
          {
            id: "def-w2-agility",
            name: "Reactive header footwork",
            category: "speed-agility",
            description: "Quick positioning steps to get set just before a cross or long ball is served.",
            dosage: "4 x 8",
          },
          {
            id: "def-w2-endurance",
            name: "Repeated jump-and-recover circuit",
            category: "endurance",
            description: "Jump, land, reset your position, and repeat to build repeat-effort aerial ability.",
            dosage: "4 x 10",
          },
          {
            id: "def-w2-position",
            name: "Timed heading practice",
            category: "position-specific",
            description: "Practice both attacking and defensive headers from served crosses.",
            dosage: "3 x 10",
          },
        ],
      },
      {
        weekNumber: 3,
        focus: "Duels & Recovery Pace",
        drills: [
          {
            id: "def-w3-strength",
            name: "Single-leg deadlifts",
            category: "strength",
            description: "Build hamstring strength and balance for stability while tackling.",
            dosage: "3 x 8 each leg",
          },
          {
            id: "def-w3-agility",
            name: "1v1 mirror drills",
            category: "speed-agility",
            description: "Shadow a partner's lateral movement to sharpen your reactions in one-on-ones.",
            dosage: "4 x 20s",
          },
          {
            id: "def-w3-endurance",
            name: "Long recovery sprints",
            category: "endurance",
            description: "Sprint back from an advanced position to simulate a defensive recovery run.",
            dosage: "6 x 40m",
          },
          {
            id: "def-w3-position",
            name: "Timed tackling practice",
            category: "position-specific",
            description: "Controlled tackling technique repetitions from varying angles.",
            dosage: "3 x 8",
          },
        ],
      },
      {
        weekNumber: 4,
        focus: "Build-Up Play & Game Speed",
        drills: [
          {
            id: "def-w4-strength",
            name: "Loaded carries",
            category: "strength",
            description: "Farmer's-carry-style holds for overall strength, grip, and posture.",
            dosage: "3 x 30m",
          },
          {
            id: "def-w4-agility",
            name: "Quick-feet pressing drills",
            category: "speed-agility",
            description: "Close down a moving target with sharp, controlled footwork.",
            dosage: "4 x 10",
          },
          {
            id: "def-w4-endurance",
            name: "Full-session simulation",
            category: "endurance",
            description: "A condensed small-sided game focused on defensive positioning and communication.",
            dosage: "20 minutes",
          },
          {
            id: "def-w4-position",
            name: "First-pass accuracy drills",
            category: "position-specific",
            description: "Play the first pass out of defense under light pressure to build composure on the ball.",
            dosage: "3 x 10",
          },
        ],
      },
    ],
  },
  {
    slug: "midfielders",
    group: "Midfielders",
    title: "Midfielder Foundations",
    tagline: "Engine, range, and pressing triggers for holding, box-to-box, and attacking midfielders.",
    positionCodes: ["CDM", "CM", "CAM", "LM", "RM", "B2B", "DLP"],
    weeks: [
      {
        weekNumber: 1,
        focus: "Engine Building",
        drills: [
          {
            id: "mid-w1-strength",
            name: "Bulgarian split squats",
            category: "strength",
            description: "Unilateral leg strength to support repeated acceleration and deceleration.",
            dosage: "3 x 10 each leg",
          },
          {
            id: "mid-w1-agility",
            name: "Shuttle direction changes",
            category: "speed-agility",
            description: "Quick multidirectional running to prepare for constant changes of direction in midfield.",
            dosage: "4 x 20m",
          },
          {
            id: "mid-w1-endurance",
            name: "Continuous box runs",
            category: "endurance",
            description: "Sustained running around a marked box to build the box-to-box engine.",
            dosage: "15 minutes",
          },
          {
            id: "mid-w1-position",
            name: "First-touch under pressure",
            category: "position-specific",
            description: "Receive and release the ball quickly with a defender closing you down.",
            dosage: "3 x 12",
          },
        ],
      },
      {
        weekNumber: 2,
        focus: "Passing Range",
        drills: [
          {
            id: "mid-w2-strength",
            name: "Med-ball rotational throws",
            category: "strength",
            description: "Build core power to support a longer, more accurate passing range.",
            dosage: "3 x 10 each side",
          },
          {
            id: "mid-w2-agility",
            name: "Turn-and-accelerate drills",
            category: "speed-agility",
            description: "Practice turning away from pressure and accelerating into open space.",
            dosage: "4 x 10",
          },
          {
            id: "mid-w2-endurance",
            name: "Interval passing circuit",
            category: "endurance",
            description: "Passing combinations kept at pace with only short recovery between sets.",
            dosage: "6 x 2 minutes",
          },
          {
            id: "mid-w2-position",
            name: "Switch-of-play accuracy",
            category: "position-specific",
            description: "Practice long diagonal passes to a target to switch the point of attack.",
            dosage: "3 x 10",
          },
        ],
      },
      {
        weekNumber: 3,
        focus: "Pressing & Recovery",
        drills: [
          {
            id: "mid-w3-strength",
            name: "Step-up knee drives",
            category: "strength",
            description: "Explosive power to help close down opponents quickly.",
            dosage: "3 x 10 each leg",
          },
          {
            id: "mid-w3-agility",
            name: "Press-and-recover shuttles",
            category: "speed-agility",
            description: "Sprint to press, then recover back into defensive shape.",
            dosage: "4 x 15m",
          },
          {
            id: "mid-w3-endurance",
            name: "Repeated high-intensity intervals",
            category: "endurance",
            description: "Short, intense running bursts that mirror the demands of a pressing system.",
            dosage: "8 x 20m",
          },
          {
            id: "mid-w3-position",
            name: "Screening and interception drills",
            category: "position-specific",
            description: "Read the game and practice cutting out passing lanes before they open.",
            dosage: "3 x 10",
          },
        ],
      },
      {
        weekNumber: 4,
        focus: "Box-to-Box Game Speed",
        drills: [
          {
            id: "mid-w4-strength",
            name: "Full-body circuit",
            category: "strength",
            description: "A combined lower- and upper-body strength circuit for overall conditioning.",
            dosage: "3 rounds",
          },
          {
            id: "mid-w4-agility",
            name: "Reactive small-sided rondos",
            category: "speed-agility",
            description: "Quick-thinking possession games in tight spaces to sharpen decision-making at speed.",
            dosage: "4 x 5 minutes",
          },
          {
            id: "mid-w4-endurance",
            name: "Full-session simulation",
            category: "endurance",
            description: "A condensed small-sided game emphasizing box-to-box coverage.",
            dosage: "20 minutes",
          },
          {
            id: "mid-w4-position",
            name: "Late-arrival finishing drills",
            category: "position-specific",
            description: "Practice arriving late into the box to finish crosses or cutbacks.",
            dosage: "3 x 8",
          },
        ],
      },
    ],
  },
  {
    slug: "attackers",
    group: "Attackers",
    title: "Attacker Foundations",
    tagline: "Explosiveness, finishing, and movement for wingers and strikers.",
    positionCodes: ["LW", "RW", "ST", "F9"],
    weeks: [
      {
        weekNumber: 1,
        focus: "Explosiveness",
        drills: [
          {
            id: "att-w1-strength",
            name: "Jump squats",
            category: "strength",
            description: "Explosive lower-body power to sharpen your first step into space.",
            dosage: "3 x 8",
          },
          {
            id: "att-w1-agility",
            name: "Sprint starts from a standstill",
            category: "speed-agility",
            description: "Practice explosive first steps to beat a defender to the space in behind.",
            dosage: "6 x 15m",
          },
          {
            id: "att-w1-endurance",
            name: "Repeated sprint sets",
            category: "endurance",
            description: "Short maximal sprints with recovery to build repeat-sprint ability.",
            dosage: "8 x 20m",
          },
          {
            id: "att-w1-position",
            name: "Movement in the box circuit",
            category: "position-specific",
            description: "Vary near-post, far-post, and short runs, finishing each with a shot.",
            dosage: "3 x 8 each",
          },
        ],
      },
      {
        weekNumber: 2,
        focus: "Finishing",
        drills: [
          {
            id: "att-w2-strength",
            name: "Single-leg hops",
            category: "strength",
            description: "Reactive leg strength and balance to shoot cleanly off either foot.",
            dosage: "3 x 10 each leg",
          },
          {
            id: "att-w2-agility",
            name: "Change-of-direction finishing",
            category: "speed-agility",
            description: "Sharp cuts to create separation before a shot on goal.",
            dosage: "4 x 8",
          },
          {
            id: "att-w2-endurance",
            name: "High-rep finishing under fatigue",
            category: "endurance",
            description: "Finishing repetitions performed right after a short sprint to simulate late-game fatigue.",
            dosage: "3 x 10",
          },
          {
            id: "att-w2-position",
            name: "First-time finishing practice",
            category: "position-specific",
            description: "Strike a served ball first-time from a variety of angles.",
            dosage: "3 x 10",
          },
        ],
      },
      {
        weekNumber: 3,
        focus: "Hold-Up & 1v1s",
        drills: [
          {
            id: "att-w3-strength",
            name: "Resistance-band holds",
            category: "strength",
            description: "Build the upper-body and core strength needed to hold off a defender.",
            dosage: "3 x 30s",
          },
          {
            id: "att-w3-agility",
            name: "1v1 take-on drills",
            category: "speed-agility",
            description: "Practice beating a defender in a confined space using change of pace and direction.",
            dosage: "4 x 6",
          },
          {
            id: "att-w3-endurance",
            name: "Repeated pressing sprints",
            category: "endurance",
            description: "Sprint to close down a defender, then recover, mirroring the demands of a front-foot press.",
            dosage: "6 x 15m",
          },
          {
            id: "att-w3-position",
            name: "Hold-up-and-lay-off practice",
            category: "position-specific",
            description: "Receive with your back to goal and lay the ball off cleanly under pressure.",
            dosage: "3 x 10",
          },
        ],
      },
      {
        weekNumber: 4,
        focus: "Game Speed & Movement",
        drills: [
          {
            id: "att-w4-strength",
            name: "Full-body power circuit",
            category: "strength",
            description: "Combined explosive strength movements to arrive at match day ready.",
            dosage: "3 rounds",
          },
          {
            id: "att-w4-agility",
            name: "Reactive finishing off a cue",
            category: "speed-agility",
            description: "React to a random visual or verbal cue before finishing a chance.",
            dosage: "4 x 8",
          },
          {
            id: "att-w4-endurance",
            name: "Full-session simulation",
            category: "endurance",
            description: "A condensed small-sided game emphasizing movement and finishing.",
            dosage: "20 minutes",
          },
          {
            id: "att-w4-position",
            name: "Combination play and finish",
            category: "position-specific",
            description: "Combine with a teammate before finishing off the resulting chance.",
            dosage: "3 x 10",
          },
        ],
      },
    ],
  },
];

export function getWorkoutPlan(slug: string): WorkoutPlan | undefined {
  return workoutPlans.find((plan) => plan.slug === slug);
}

export function getWorkoutPlanForPosition(code: PositionCode): WorkoutPlan | undefined {
  return workoutPlans.find((plan) => plan.positionCodes.includes(code));
}

export function getAllDrills(plan: WorkoutPlan): Drill[] {
  return plan.weeks.flatMap((week) => week.drills);
}
