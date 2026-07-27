import type { Zone } from "./positions";
import type { Phase } from "./formations";

export type ModuleAccent = "gold" | "blue" | "kickoff" | "attack" | "control";

export const moduleAccentGradient: Record<ModuleAccent, string> = {
  gold: "var(--grad-attack)",
  blue: "var(--grad-control)",
  kickoff: "var(--grad-kickoff)",
  attack: "var(--grad-attack)",
  control: "var(--grad-control)",
};

export const moduleAccentColor: Record<ModuleAccent, string> = {
  gold: "var(--gold-flood)",
  blue: "var(--blue-volt)",
  kickoff: "var(--gold-flood)",
  attack: "var(--red-flare)",
  control: "var(--blue-volt)",
};

export type ZoneBlock = {
  kind: "zone";
  id: string;
  heading: string;
  body: string;
  zones: Zone[];
};

export type ToggleBlock = {
  kind: "toggle";
  id: string;
  heading: string;
  body: string;
  optionA: { label: string; zones: Zone[] };
  optionB: { label: string; zones: Zone[] };
};

export type TextBlock = {
  kind: "text";
  id: string;
  heading: string;
  body: string;
};

export type FormationBlock = {
  kind: "formation";
  id: string;
  heading: string;
  body: string;
  formationSlug: string;
  phase?: Phase;
};

export type ConceptBlock = ZoneBlock | ToggleBlock | TextBlock | FormationBlock;

export type InlineCheck = {
  question: string;
  options: string[];
  correctIndex: number;
};

export type Lesson = {
  slug: string;
  title: string;
  estimatedMinutes: number;
  hook: string;
  blocks: ConceptBlock[];
  tryIt: string;
  inlineCheck: InlineCheck;
  takeaways: string[];
};

export type ModuleQuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type Module = {
  slug: string;
  order: number;
  title: string;
  accent: ModuleAccent;
  description: string;
  lessons: Lesson[];
  quiz: ModuleQuizQuestion[];
};

export const modules: Module[] = [
  {
    slug: "foundations",
    order: 1,
    title: "Foundations of the Pitch",
    accent: "gold",
    description: "Pitch thirds, formation numbers, the goalkeeper's two jobs, and why center-backs work in pairs.",
    lessons: [
      {
        slug: "reading-the-pitch-in-thirds",
        title: "Reading the Pitch in Thirds",
        estimatedMinutes: 4,
        hook: "Every pitch splits into three thirds — and where the ball is tells you what a team should be doing.",
        blocks: [
          {
            kind: "zone",
            id: "defensive-third",
            heading: "The Defensive Third",
            body: "The third closest to your own goal. The priority here is simple: don't concede. Passes stay short and safe, and a mistake is far more costly than anywhere else on the pitch.",
            zones: [{ x: 0, y: 67, width: 100, height: 33 }],
          },
          {
            kind: "zone",
            id: "middle-third",
            heading: "The Middle Third",
            body: "The engine room. Most of a match is played here, and it's where a team's passing patterns decide whether they can actually reach the final third with the ball under control.",
            zones: [{ x: 0, y: 33, width: 100, height: 34 }],
          },
          {
            kind: "zone",
            id: "attacking-third",
            heading: "The Attacking Third",
            body: "Closest to the opponent's goal. Risk becomes worth taking here — a lost ball is far less dangerous than a lost ball in your own third, so players commit to final passes and shots.",
            zones: [{ x: 0, y: 0, width: 100, height: 33 }],
          },
          {
            kind: "toggle",
            id: "compact-vs-stretched",
            heading: "Compact vs. Stretched",
            body: "A team's overall shape isn't fixed — it stretches or compresses depending on where the ball is and whether they have it. Compare a deep, compact low block against a high, aggressive press.",
            optionA: { label: "Low block", zones: [{ x: 10, y: 60, width: 80, height: 35 }] },
            optionB: { label: "High press", zones: [{ x: 10, y: 0, width: 80, height: 40 }] },
          },
        ],
        tryIt:
          "Look at the zone diagrams above and imagine your team just won the ball back in the defensive third. Which third should the first pass usually aim to reach safely first?",
        inlineCheck: {
          question: "Which third is most associated with directly creating chances to score?",
          options: ["Defensive third", "Middle third", "Attacking third", "All three equally"],
          correctIndex: 2,
        },
        takeaways: [
          "The pitch splits into defensive, middle, and attacking thirds for tactical purposes.",
          "Teams build up calmly in their own third and take more risk in the attacking third.",
          "A team's overall shape compresses or stretches depending on which third the ball is in.",
        ],
      },
      {
        slug: "what-a-formation-number-means",
        title: "What a Formation Number Means",
        estimatedMinutes: 5,
        hook: "4-3-3. 4-4-2. 3-5-2. Three numbers that tell you almost everything about how a team is set up.",
        blocks: [
          {
            kind: "text",
            id: "reading-left-to-right",
            heading: "Reading Left to Right",
            body: "Formation numbers read from defense to attack: defenders first, then midfielders, then forwards. The goalkeeper is never included — every formation already assumes one. \"4-3-3\" means four defenders, three midfielders, three forwards, plus a goalkeeper.",
          },
          {
            kind: "formation",
            id: "4-4-2-shape",
            heading: "4-4-2 — Two Equal Lines",
            body: "Two flat banks of four in defense and midfield, with two strikers up top. Even coverage across the width of the pitch, but a flat midfield line can be outnumbered by a three-man midfield.",
            formationSlug: "4-4-2",
          },
          {
            kind: "formation",
            id: "4-3-3-shape",
            heading: "4-3-3 — An Extra Midfielder",
            body: "Trading a striker for a third midfielder buys control of the middle of the pitch, with two wide forwards providing width higher up instead of a flat midfield line.",
            formationSlug: "4-3-3",
          },
          {
            kind: "formation",
            id: "4-3-3-oop",
            heading: "The Same 4-3-3, Out of Possession",
            body: "Watch what happens to the exact same team without the ball: the front three drop deeper to screen passing lanes, and the whole shape narrows to protect the middle of the pitch.",
            formationSlug: "4-3-3",
            phase: "out-of-possession",
          },
        ],
        tryIt:
          "Open the pitch explorer in a separate tab and switch between 4-4-2 and 4-3-3 — count how many players occupy the middle third in each shape.",
        inlineCheck: {
          question: "Which number in \"4-3-3\" refers to the goalkeeper?",
          options: ["The first number", "The second number", "The third number", "None of them — the goalkeeper isn't counted"],
          correctIndex: 3,
        },
        takeaways: [
          "Formation numbers read from defense to attack and never include the goalkeeper.",
          "The same formation looks noticeably different in and out of possession.",
          "More players in one line means more control there, at the cost of numbers elsewhere.",
        ],
      },
      {
        slug: "the-goalkeepers-two-jobs",
        title: "The Goalkeeper's Two Jobs",
        estimatedMinutes: 4,
        hook: "A modern goalkeeper is judged on shot-stopping and on how well they start attacks with the ball at their feet.",
        blocks: [
          {
            kind: "zone",
            id: "commanding-the-box",
            heading: "Commanding the Box",
            body: "The traditional goalkeeper zone: close to the goal line, ready to handle shots and claim crosses. Safe, reliable, and still the foundation of the position.",
            zones: [{ x: 20, y: 80, width: 60, height: 20 }],
          },
          {
            kind: "zone",
            id: "sweeper-keeper-zone",
            heading: "The Sweeper-Keeper's Extra Zone",
            body: "Some goalkeepers add a second zone further out, ready to sweep up through-balls behind a high defensive line before an attacker can reach them.",
            zones: [
              { x: 20, y: 80, width: 60, height: 20 },
              { x: 25, y: 55, width: 50, height: 25 },
            ],
          },
          {
            kind: "toggle",
            id: "line-hugger-vs-sweeper",
            heading: "Line-Hugger vs. Sweeper-Keeper",
            body: "Compare the two starting positions directly. Neither is objectively correct — the right choice depends on how high the team's own back line plays.",
            optionA: { label: "Traditional", zones: [{ x: 20, y: 85, width: 60, height: 15 }] },
            optionB: { label: "Sweeper-keeper", zones: [{ x: 20, y: 55, width: 60, height: 45 }] },
          },
        ],
        tryIt:
          "Visit the Goalkeeper position page and read how distribution choices change based on how the opposition presses.",
        inlineCheck: {
          question: "What is the main risk of a goalkeeper playing as a sweeper-keeper?",
          options: [
            "Being caught too far off the line by a through-ball",
            "Never touching the ball",
            "Being unable to take goal kicks",
            "Conceding more corners",
          ],
          correctIndex: 0,
        },
        takeaways: [
          "Goalkeepers are now judged on distribution as much as shot-stopping.",
          "A sweeper-keeper trades some shot-stopping safety for extra defensive coverage behind a high line.",
          "The right starting position depends on how high the team's own defensive line plays.",
        ],
      },
      {
        slug: "why-center-backs-come-in-pairs",
        title: "Why Center-Backs Come in Pairs",
        estimatedMinutes: 4,
        hook: "Center-backs almost never defend alone — the partnership matters as much as either individual.",
        blocks: [
          {
            kind: "formation",
            id: "cb-pairing",
            heading: "Two Center-Backs, One Line",
            body: "Look at the two CB markers in this shape — they hold the line together, not as two separate individuals defending their own patch of grass.",
            formationSlug: "4-4-2",
          },
          {
            kind: "zone",
            id: "covering-each-other",
            heading: "Covering Each Other",
            body: "Each center-back's zone overlaps with their partner's. That overlap is deliberate — it's what allows one to step out without leaving a gap unattended.",
            zones: [
              { x: 10, y: 65, width: 35, height: 28 },
              { x: 55, y: 65, width: 35, height: 28 },
            ],
          },
          {
            kind: "toggle",
            id: "stepping-out-vs-holding",
            heading: "Stepping Out vs. Holding the Line",
            body: "Compare a settled back line against the moment one center-back steps out to press an attacker — notice how much space opens up if the partner doesn't shift across to cover it.",
            optionA: { label: "Holding the line", zones: [{ x: 10, y: 70, width: 80, height: 15 }] },
            optionB: {
              label: "One steps out",
              zones: [
                { x: 10, y: 70, width: 35, height: 15 },
                { x: 45, y: 42, width: 22, height: 35 },
              ],
            },
          },
        ],
        tryIt:
          "On the pitch explorer, click both CB markers in the 4-4-2 formation and compare their \"How to play it\" sections side by side.",
        inlineCheck: {
          question: "If one center-back steps out to press an attacker, what should the other center-back do?",
          options: [
            "Also step out to double up",
            "Shift across to cover the space left behind",
            "Push forward into midfield",
            "Swap positions with the full-back",
          ],
          correctIndex: 1,
        },
        takeaways: [
          "Center-backs defend as a pair, not as two individuals.",
          "When one steps out to press, the other must cover the space left behind.",
          "Communication between the pair matters as much as either player's individual defending.",
        ],
      },
      {
        slug: "putting-it-together",
        title: "Putting the Thirds and the Shape Together",
        estimatedMinutes: 3,
        hook: "Now put it together: a formation isn't fixed — it's a shape that moves with the ball across the thirds of the pitch.",
        blocks: [
          {
            kind: "formation",
            id: "in-possession-recap",
            heading: "In Possession, Building Out",
            body: "Width, distance between lines, and players in advanced positions — this is a team looking to create in the attacking third.",
            formationSlug: "4-3-3",
          },
          {
            kind: "formation",
            id: "out-of-possession-recap",
            heading: "Out of Possession, Compact",
            body: "Same eleven players, same formation label — but narrower and deeper, protecting the middle third and defensive third instead.",
            formationSlug: "4-3-3",
            phase: "out-of-possession",
          },
          {
            kind: "zone",
            id: "where-goals-come-from",
            heading: "Where Most Chances Are Actually Created",
            body: "The heart of the attacking third and the edges of the box — the zone every attacking shape is ultimately trying to reach with numbers and time on the ball.",
            zones: [{ x: 15, y: 8, width: 70, height: 25 }],
          },
        ],
        tryIt:
          "Go to the pitch explorer, pick any formation, and toggle \"In possession\" / \"Out of possession\" to watch the whole team's shape change in real time.",
        inlineCheck: {
          question: "What generally happens to a team's width when they lose the ball?",
          options: [
            "It increases to cover more ground",
            "It stays exactly the same",
            "It decreases as players tuck in centrally",
            "Only the goalkeeper's position changes",
          ],
          correctIndex: 2,
        },
        takeaways: [
          "A formation describes a starting shape, not a fixed set of positions.",
          "Teams get narrower and deeper out of possession, wider and higher in possession.",
          "You've now covered pitch thirds, formation numbers, the goalkeeper's dual role, and center-back partnerships — the foundation for everything else in the academy.",
        ],
      },
    ],
    quiz: [
      {
        question: "How many main thirds does a football pitch split into for tactical purposes?",
        options: ["Two", "Three", "Four", "Five"],
        correctIndex: 1,
        explanation: "Defensive, middle, and attacking thirds — each with a different priority for the team in possession.",
      },
      {
        question: "Which position is omitted entirely from formation numbers like 4-3-3?",
        options: ["Striker", "Goalkeeper", "Winger", "Center-back"],
        correctIndex: 1,
        explanation: "Every formation already assumes a goalkeeper, so it's never one of the counted numbers.",
      },
      {
        question: "A goalkeeper who plays far off their line to cover through-balls is known as what?",
        options: ["Sweeper-keeper", "Libero", "Regista", "Target man"],
        correctIndex: 0,
        explanation: "The sweeper-keeper role trades some line-hugging safety for coverage behind a high back line.",
      },
      {
        question: "What's the main defensive risk of a sweeper-keeper style?",
        options: [
          "Being caught off the line by a through-ball",
          "Conceding too many corners",
          "Poor distribution",
          "Weak handling",
        ],
        correctIndex: 0,
        explanation: "Playing higher up the pitch means more space in behind if a through-ball is timed well.",
      },
      {
        question: "When one center-back steps out of the line to press, what should their partner do?",
        options: ["Step out too", "Cover the vacated space", "Push into midfield", "Swap with the goalkeeper"],
        correctIndex: 1,
        explanation: "Shifting across to cover the gap is what keeps the pairing solid rather than exposed.",
      },
      {
        question: "What typically happens to a team's shape when they lose possession?",
        options: ["Gets wider and higher", "Gets narrower and deeper", "Stays exactly the same", "Only the striker moves"],
        correctIndex: 1,
        explanation: "Compressing the shape protects the most dangerous central areas when the ball is lost.",
      },
      {
        question: "Which third of the pitch is most associated with directly creating scoring chances?",
        options: ["Defensive third", "Middle third", "Attacking third", "None of them"],
        correctIndex: 2,
        explanation: "It's where risk becomes worth taking — final passes and shots happen here.",
      },
      {
        question: "Which best describes what a formation represents?",
        options: [
          "A fixed set of positions players never leave",
          "A starting shape that shifts with the phase of play",
          "Only relevant during set pieces",
          "A rule enforced by the referee",
        ],
        correctIndex: 1,
        explanation: "A formation is a starting reference point — the actual shape moves constantly with the ball.",
      },
    ],
  },
  {
    slug: "defending",
    order: 2,
    title: "The Art of Defending",
    accent: "blue",
    description: "Defensive lines, marking systems, and the modern sweeper-keeper — coming soon.",
    lessons: [],
    quiz: [],
  },
  {
    slug: "midfield",
    order: 3,
    title: "Controlling the Midfield",
    accent: "kickoff",
    description: "Pivots, 8s and 10s, and pressing triggers — coming soon.",
    lessons: [],
    quiz: [],
  },
  {
    slug: "attacking",
    order: 4,
    title: "Attacking Principles",
    accent: "attack",
    description: "Width, overloads, and the False 9 — coming soon.",
    lessons: [],
    quiz: [],
  },
  {
    slug: "systems",
    order: 5,
    title: "Formations & Systems",
    accent: "control",
    description: "Deep dives into all 8 formations — when and why each one gets used — coming soon.",
    lessons: [],
    quiz: [],
  },
  {
    slug: "managers-minds",
    order: 6,
    title: "The Managers' Minds",
    accent: "gold",
    description: "How the site's profiled managers apply everything above — coming soon.",
    lessons: [],
    quiz: [],
  },
];

export function getModule(slug: string): Module | undefined {
  return modules.find((module) => module.slug === slug);
}

export function getLesson(moduleSlug: string, lessonSlug: string): Lesson | undefined {
  return getModule(moduleSlug)?.lessons.find((lesson) => lesson.slug === lessonSlug);
}

export function totalLessonCount(): number {
  return modules.reduce((sum, module) => sum + module.lessons.length, 0);
}

export function totalModuleCount(): number {
  return modules.filter((module) => module.lessons.length > 0).length;
}
