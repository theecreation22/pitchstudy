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
  gold: "var(--attack)",
  blue: "var(--defend)",
  kickoff: "var(--attack)",
  attack: "var(--press)",
  control: "var(--defend)",
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
    description: "Marking systems, defensive lines, tackling, and set pieces.",
    lessons: [
      {
        slug: "zonal-vs-man-marking",
        title: "Zonal Marking vs. Man-Marking",
        estimatedMinutes: 4,
        hook: "Every defense has to answer one question before a ball is even kicked: mark the space, or mark the man?",
        blocks: [
          {
            kind: "text",
            id: "two-philosophies",
            heading: "Two Philosophies",
            body: "Zonal marking assigns each defender a patch of the pitch to control, regardless of who runs into it. Man-marking assigns each defender a specific opponent to follow, regardless of where they go. Almost no team uses either in its pure form — most blend the two depending on the situation.",
          },
          {
            kind: "zone",
            id: "zonal-patch",
            heading: "A Zonal Defender's Patch",
            body: "In a zonal system, a defender's job is to control this area and challenge whoever enters it — not to chase a single opponent across the pitch.",
            zones: [{ x: 10, y: 65, width: 35, height: 25 }],
          },
          {
            kind: "toggle",
            id: "zonal-vs-man-coverage",
            heading: "Zonal vs. Man-Marking Coverage",
            body: "Compare how the two systems cover the same moment. Zonal marking keeps the defensive shape intact even if the ball moves; man-marking can pull defenders completely out of position chasing their assigned opponent.",
            optionA: { label: "Zonal shape", zones: [{ x: 5, y: 60, width: 90, height: 30 }] },
            optionB: {
              label: "Man-marking chase",
              zones: [
                { x: 10, y: 70, width: 20, height: 20 },
                { x: 60, y: 25, width: 20, height: 20 },
              ],
            },
          },
        ],
        tryIt:
          "Watch the next match you see and pick one defender — try to tell whether they're tracking a specific opponent or holding a patch of grass regardless of who's on it.",
        inlineCheck: {
          question: "What is the main risk of a purely man-marking defensive system?",
          options: [
            "Defenders can be dragged completely out of position by an opponent's movement",
            "It requires no communication between defenders",
            "It only works against teams with two strikers",
            "It cannot be used at set pieces",
          ],
          correctIndex: 0,
        },
        takeaways: [
          "Zonal marking assigns space; man-marking assigns an opponent.",
          "Zonal systems keep defensive shape intact but can leave gaps between zones.",
          "Most real defenses blend both approaches depending on the moment in the game.",
        ],
      },
      {
        slug: "setting-the-defensive-line",
        title: "Setting the Defensive Line",
        estimatedMinutes: 4,
        hook: "A back line's height decides almost everything about how a team defends — and how much risk it's willing to take.",
        blocks: [
          {
            kind: "toggle",
            id: "high-line-vs-deep-block",
            heading: "High Line vs. Deep Block",
            body: "A high line squeezes the pitch and traps opponents offside, but leaves space in behind for a fast attacker to exploit. A deep block protects that space but concedes territory and invites pressure.",
            optionA: { label: "High line", zones: [{ x: 5, y: 35, width: 90, height: 15 }] },
            optionB: { label: "Deep block", zones: [{ x: 5, y: 78, width: 90, height: 18 }] },
          },
          {
            kind: "zone",
            id: "space-behind-high-line",
            heading: "The Space Behind a High Line",
            body: "This is exactly the space a high defensive line is gambling with — empty until an attacker's run threatens to reach it before a defender can recover.",
            zones: [{ x: 10, y: 15, width: 80, height: 20 }],
          },
          {
            kind: "text",
            id: "offside-trap",
            heading: "The Offside Trap",
            body: "Pushing up together at the right moment can catch an attacker offside before the pass even arrives. It only works if every defender in the line moves as one — a single defender stepping late undoes it for everyone.",
          },
        ],
        tryIt:
          "Next time you watch a match with a high defensive line, look for the moment the back four steps up together — that's the offside trap being set.",
        inlineCheck: {
          question: "What can break an offside trap even if the timing is otherwise perfect?",
          options: [
            "A single defender in the line stepping up late",
            "The goalkeeper coming off their line",
            "A corner kick",
            "The referee's assistant standing on the wrong side",
          ],
          correctIndex: 0,
        },
        takeaways: [
          "A high defensive line compresses the pitch but risks space in behind.",
          "A deep block protects that space at the cost of surrendering territory.",
          "The offside trap only works if the whole back line moves together.",
        ],
      },
      {
        slug: "jockeying-and-tackling",
        title: "Jockeying, Delaying, and the Art of the Tackle",
        estimatedMinutes: 4,
        hook: "The best defenders make their most important decision before they ever touch the ball: when not to tackle.",
        blocks: [
          {
            kind: "zone",
            id: "showing-an-attacker",
            heading: "Where a Defender Shows an Attacker",
            body: "Jockeying means staying on your feet, delaying the attacker, and showing them toward a specific area — usually away from goal and onto their weaker foot — rather than diving into a tackle.",
            zones: [{ x: 30, y: 55, width: 40, height: 30 }],
          },
          {
            kind: "toggle",
            id: "jockey-vs-dive-in",
            heading: "Jockeying vs. Diving In",
            body: "Compare the two approaches to the same one-on-one. Staying on your feet keeps you in the duel even if the first move fails; diving in commits everything to a single moment.",
            optionA: { label: "Jockey and delay", zones: [{ x: 25, y: 50, width: 50, height: 35 }] },
            optionB: { label: "Dive into the tackle", zones: [{ x: 40, y: 60, width: 20, height: 15 }] },
          },
          {
            kind: "text",
            id: "when-to-tackle",
            heading: "When the Tackle Is Actually On",
            body: "A committed tackle only makes sense when the attacker's touch drifts far enough from their feet to win the ball cleanly, or when cover is arriving to deal with the consequences of missing. Outside of those moments, delay is almost always the better option.",
          },
        ],
        tryIt:
          "Watch a one-on-one defensive duel and count how many touches the defender waits through before committing to anything.",
        inlineCheck: {
          question: "Why do good defenders usually delay rather than tackle immediately?",
          options: [
            "Diving in commits everything to one moment and can be beaten completely",
            "Tackling is against the rules until the ball reaches the box",
            "Delaying tires out the attacker faster",
            "Referees prefer defenders who wait",
          ],
          correctIndex: 0,
        },
        takeaways: [
          "Jockeying means staying on your feet and delaying rather than committing early.",
          "A good defender shows the attacker toward their weaker foot or away from goal.",
          "A tackle is worth the risk only when the ball is genuinely winnable or cover has arrived.",
        ],
      },
      {
        slug: "defending-crosses-and-set-pieces",
        title: "Defending Crosses and Set Pieces",
        estimatedMinutes: 4,
        hook: "Set pieces are the one part of the game where defending is almost entirely about preparation, not reaction.",
        blocks: [
          {
            kind: "zone",
            id: "six-yard-box",
            heading: "The Six-Yard Box on a Corner",
            body: "The most dangerous area on any corner — the zone a defense organizes around first, whether they mark zonally, man-to-man, or with a mix of both.",
            zones: [{ x: 24, y: 1, width: 20, height: 14 }],
          },
          {
            kind: "toggle",
            id: "zonal-vs-man-corners",
            heading: "Zonal vs. Man-Marking at Corners",
            body: "The same zonal-versus-man question from open play applies at set pieces too, just under more pressure and with less time to react. Compare the two setups defending the same corner.",
            optionA: {
              label: "Zonal corner defending",
              zones: [
                { x: 10, y: 1, width: 16, height: 16 },
                { x: 26, y: 1, width: 16, height: 16 },
                { x: 42, y: 1, width: 16, height: 16 },
              ],
            },
            optionB: {
              label: "Man-marking at the corner",
              zones: [
                { x: 15, y: 3, width: 8, height: 10 },
                { x: 35, y: 5, width: 8, height: 10 },
                { x: 50, y: 8, width: 8, height: 10 },
              ],
            },
          },
          {
            kind: "text",
            id: "clearing-your-lines",
            heading: "Clearing Your Lines",
            body: "When a cross does arrive, the first priority is height, distance, and width — heading the ball up, away, and wide of the danger area, not just anywhere. A weak, central clearance is often more dangerous than not clearing it at all.",
          },
        ],
        tryIt:
          "Watch a corner kick and see whether the defending team looks zonal, man-marking, or a mix — the near-post runners are usually the easiest to spot.",
        inlineCheck: {
          question: "When clearing a dangerous cross, what should a defender prioritize?",
          options: [
            "Height, distance, and width away from goal",
            "Passing short to a teammate under pressure",
            "Heading it straight back to the goalkeeper",
            "Kicking it out for a corner deliberately",
          ],
          correctIndex: 0,
        },
        takeaways: [
          "Set-piece defending is built on preparation and organization more than reaction.",
          "Teams can defend corners zonally, man-to-man, or with a blend of both.",
          "A rushed, central clearance can be more dangerous than a well-directed one.",
        ],
      },
      {
        slug: "building-a-defense-as-a-unit",
        title: "Building a Defense as a Unit",
        estimatedMinutes: 3,
        hook: "None of this works in isolation — a real defense is a marking system, a defensive line, individual duels, and set-piece organization all moving together.",
        blocks: [
          {
            kind: "formation",
            id: "settled-defensive-shape",
            heading: "A Settled Defensive Shape",
            body: "Every idea from this module shows up at once here: a defensive line held together, zones covered, and individual duels ready to be won if the ball arrives.",
            formationSlug: "4-4-2",
            phase: "out-of-possession",
          },
          {
            kind: "zone",
            id: "goalkeeper-in-the-picture",
            heading: "Where the Goalkeeper Fits into the Picture",
            body: "A modern defense doesn't stop at the back four — a goalkeeper comfortable sweeping up behind a high line extends the defensive unit further up the pitch.",
            zones: [
              { x: 20, y: 70, width: 60, height: 30 },
              { x: 30, y: 50, width: 40, height: 22 },
            ],
          },
          {
            kind: "text",
            id: "recap",
            heading: "Recap",
            body: "Zonal or man-marking, high line or deep block, jockey or tackle, zonal or man at corners — none of these are permanently right or wrong answers. They're decisions a defense makes based on their personnel, their opponent, and the moment in the match.",
          },
        ],
        tryIt:
          "Go back to the Explore pitch and toggle \"Out of possession\" on any formation — you'll now recognize exactly what you're looking at.",
        inlineCheck: {
          question: "What's the main idea tying this whole module together?",
          options: [
            "Defending is a set of situational decisions, not one fixed correct method",
            "Every team should always defend with a high line",
            "Man-marking is always better than zonal marking",
            "Set pieces don't matter as much as open play defending",
          ],
          correctIndex: 0,
        },
        takeaways: [
          "Defensive marking, line height, individual duels, and set pieces all work together, not separately.",
          "None of the choices in this module are universally correct — they depend on personnel and situation.",
          "You've now covered the core language of defending — next is seeing it inside real formations and managers' systems.",
        ],
      },
    ],
    quiz: [
      {
        question: "What is the main risk of a purely man-marking defensive system?",
        options: [
          "Defenders can be dragged out of position chasing their opponent",
          "It cannot be organized before kickoff",
          "It only works with a back three",
          "It requires the goalkeeper to mark an opponent too",
        ],
        correctIndex: 0,
        explanation: "Following an opponent wherever they go can pull a defender completely out of the team's shape.",
      },
      {
        question: "A high defensive line squeezes the pitch but risks what?",
        options: [
          "Space in behind for a fast attacker to run into",
          "Running out of substitutions",
          "Losing possession in the attacking third",
          "The goalkeeper being sent off",
        ],
        correctIndex: 0,
        explanation: "Pushing the back line up compresses the pitch, but leaves the space behind it for a well-timed run.",
      },
      {
        question: "What must happen for an offside trap to work?",
        options: [
          "The whole back line has to move up together",
          "The goalkeeper has to come off their line",
          "The referee has to signal it in advance",
          "It only works in the final ten minutes of a match",
        ],
        correctIndex: 0,
        explanation: "A single defender stepping up late undoes the trap for the entire line.",
      },
      {
        question: "What does \"jockeying\" mean in defending?",
        options: [
          "Staying on your feet and delaying rather than diving into a tackle",
          "Swapping positions with a teammate mid-match",
          "Sprinting past the attacker to double back",
          "Standing directly behind the attacker",
        ],
        correctIndex: 0,
        explanation: "Jockeying keeps a defender in the duel and buys time for cover to arrive, rather than committing everything to one tackle.",
      },
      {
        question: "When is a committed tackle actually worth the risk?",
        options: [
          "When the ball is genuinely winnable or cover has arrived",
          "Whenever the attacker touches the ball",
          "Only inside the penalty area",
          "Only when a teammate calls for it out loud",
        ],
        correctIndex: 0,
        explanation: "Outside of those two situations, delaying and showing the attacker away from danger is usually the safer option.",
      },
      {
        question: "What should a defender prioritize when clearing a dangerous cross?",
        options: [
          "Height, distance, and width away from goal",
          "A short pass to the nearest teammate",
          "Heading it straight down the middle",
          "Waiting for the goalkeeper to catch it instead",
        ],
        correctIndex: 0,
        explanation: "A weak, central clearance can be more dangerous than not clearing the ball at all.",
      },
      {
        question: "Which of these are valid ways to defend a corner kick?",
        options: [
          "Zonal marking, man-marking, or a blend of both",
          "Only zonal marking is allowed by the rules",
          "Only the goalkeeper is allowed to defend a corner",
          "Corners cannot be defended, only cleared afterward",
        ],
        correctIndex: 0,
        explanation: "The same zonal-versus-man question from open play applies at set pieces too.",
      },
      {
        question: "What's the central idea connecting this whole module?",
        options: [
          "Defending is a set of situational decisions depending on personnel and moment",
          "A high line is always the correct choice",
          "Man-marking should always be used at set pieces",
          "Tackling early is always better than delaying",
        ],
        correctIndex: 0,
        explanation: "None of the choices covered in this module are universally right — they depend on the team and the situation.",
      },
    ],
  },
  {
    slug: "midfield",
    order: 3,
    title: "Controlling the Midfield",
    accent: "kickoff",
    description: "Double pivots, box-to-box coverage, pressing triggers, and central overloads.",
    lessons: [
      {
        slug: "the-double-pivot",
        title: "The Double Pivot",
        estimatedMinutes: 4,
        hook: "Two holding midfielders can do something one alone cannot: cover for each other.",
        blocks: [
          {
            kind: "formation",
            id: "4231-pivot",
            heading: "4-2-3-1's Double Pivot",
            body: "Two holding midfielders sit just in front of the back four, splitting defensive responsibility instead of asking one player to cover the entire zone alone.",
            formationSlug: "4-2-3-1",
          },
          {
            kind: "zone",
            id: "shared-territory",
            heading: "Shared Defensive Territory",
            body: "The double pivot's zones overlap deliberately — if one midfielder steps out to press, the other slides across to cover exactly this kind of shared space.",
            zones: [
              { x: 15, y: 48, width: 35, height: 20 },
              { x: 50, y: 48, width: 35, height: 20 },
            ],
          },
          {
            kind: "toggle",
            id: "one-holds-one-steps",
            heading: "One Holds, One Steps",
            body: "Compare a settled double pivot against the moment one midfielder steps forward to press — notice how much depends on the other holding position rather than following.",
            optionA: { label: "Both hold", zones: [{ x: 15, y: 50, width: 70, height: 18 }] },
            optionB: {
              label: "One steps to press",
              zones: [
                { x: 15, y: 50, width: 30, height: 18 },
                { x: 50, y: 30, width: 20, height: 20 },
              ],
            },
          },
        ],
        tryIt:
          "On the pitch explorer, select 4-2-3-1 and click both CDM markers — compare how their role descriptions talk about covering for each other.",
        inlineCheck: {
          question: "What is the main advantage of a double pivot over a single holding midfielder?",
          options: [
            "The two midfielders can cover for each other when one steps out",
            "It requires fewer defenders",
            "It automatically wins more corners",
            "It removes the need for a goalkeeper to distribute",
          ],
          correctIndex: 0,
        },
        takeaways: [
          "A double pivot splits defensive midfield responsibility between two players instead of one.",
          "The pair's zones deliberately overlap so one can cover when the other steps out.",
          "This is the foundation that lets the players ahead of the pivot take more attacking risk.",
        ],
      },
      {
        slug: "box-to-box-the-complete-midfielder",
        title: "Box-to-Box: The Complete Midfielder",
        estimatedMinutes: 4,
        hook: "Some midfielders don't specialize in attack or defense — their entire value is doing both, all match.",
        blocks: [
          {
            kind: "zone",
            id: "box-to-box-corridor",
            heading: "A Box-to-Box Corridor",
            body: "This role's zone spans nearly the full length of the pitch centrally — a corridor few other positions are asked to cover in a single passage of play.",
            zones: [{ x: 15, y: 12, width: 70, height: 76 }],
          },
          {
            kind: "formation",
            id: "b2b-in-433",
            heading: "Box-to-Box in a 4-3-3",
            body: "Inside a midfield three, one central midfielder is often asked to be exactly this — contributing to build-up, covering defensively, and arriving late into the box in attack.",
            formationSlug: "4-3-3",
          },
          {
            kind: "text",
            id: "cost-of-covering-everything",
            heading: "The Cost of Covering Everything",
            body: "Covering this much ground repeatedly across 90 minutes is as much about managing energy as it is about raw running ability. A box-to-box midfielder who sprints everywhere early often has nothing left for the moments that matter late in a match.",
          },
        ],
        tryIt:
          "Visit the Box-to-Box Midfielder position page and compare its zone diagram to a standard CDM or CAM's much smaller zone.",
        inlineCheck: {
          question: "What is the defining trait of a box-to-box midfielder?",
          options: [
            "Covering ground from the defensive box to the attacking box every match",
            "Never leaving the center circle",
            "Only playing in a back three",
            "Exclusively taking free kicks",
          ],
          correctIndex: 0,
        },
        takeaways: [
          "Box-to-box midfielders are defined by total ground covered, not one specialty.",
          "This role trades defensive or attacking specialization for two-way coverage.",
          "Managing energy across 90 minutes is as much a skill as the running itself.",
        ],
      },
      {
        slug: "pressing-triggers",
        title: "Pressing Triggers: When to Spring the Trap",
        estimatedMinutes: 4,
        hook: "A press isn't just running at the ball — it's waiting for the exact moment the opponent gives you a reason to.",
        blocks: [
          {
            kind: "text",
            id: "what-is-a-trigger",
            heading: "What Is a Pressing Trigger?",
            body: "A pressing trigger is a specific cue — a heavy first touch, a pass played backward, a receiver with their back to goal — that tells a team the moment has arrived to press as a unit rather than chase the ball individually.",
          },
          {
            kind: "zone",
            id: "where-traps-are-set",
            heading: "Where Pressing Traps Are Set",
            body: "Wide areas near the touchline are common places to spring a press — the touchline itself acts like an extra defender, cutting off half of the attacker's options before the press even arrives.",
            zones: [{ x: 0, y: 20, width: 35, height: 30 }],
          },
          {
            kind: "toggle",
            id: "passive-vs-triggered",
            heading: "Passive Waiting vs. Triggered Press",
            body: "Compare a team holding its defensive shape against the moment a trigger is read and the whole front line presses together.",
            optionA: { label: "Holding shape", zones: [{ x: 10, y: 40, width: 80, height: 25 }] },
            optionB: { label: "Triggered press", zones: [{ x: 20, y: 10, width: 60, height: 25 }] },
          },
        ],
        tryIt:
          "Watch for the moment a team's front players suddenly all sprint at once — that's usually a trigger being read, not a coincidence.",
        inlineCheck: {
          question: "What is a \"pressing trigger\"?",
          options: [
            "A specific cue that tells a team the moment to press as a unit has arrived",
            "A type of throw-in",
            "A rule that forces a team to press after 10 seconds",
            "A substitution reserved for pressing specialists",
          ],
          correctIndex: 0,
        },
        takeaways: [
          "Effective pressing is triggered by specific cues, not constant individual chasing.",
          "Wide areas near the touchline are common places to spring a press since there's less space to escape into.",
          "Reading the same trigger together is what turns individual effort into a coordinated press.",
        ],
      },
      {
        slug: "overloading-the-middle",
        title: "Overloading the Middle: Winning the Numbers Game",
        estimatedMinutes: 4,
        hook: "Control the center of the pitch with more players than the opponent, and the rest of the game gets easier.",
        blocks: [
          {
            kind: "formation",
            id: "extra-midfielder-433",
            heading: "An Extra Midfielder in a 4-3-3",
            body: "Three central midfielders against an opponent's flat two creates a spare man in the middle of the pitch — an overload that helps control tempo and win the ball back quickly.",
            formationSlug: "4-3-3",
          },
          {
            kind: "zone",
            id: "the-overloaded-zone",
            heading: "The Overloaded Zone",
            body: "This is the kind of area a central overload is fought over — whoever has the extra player here usually dictates the tempo of the whole game.",
            zones: [{ x: 20, y: 35, width: 60, height: 25 }],
          },
          {
            kind: "text",
            id: "third-man-run",
            heading: "The Third-Man Run",
            body: "A well-timed overload isn't just about numbers standing still — it's exploited when a third player arrives late into space nobody accounted for, having gone unmarked while the defense focused on the first two passing options.",
          },
        ],
        tryIt:
          "Compare a 4-3-3 and a 4-4-2 on the pitch explorer — count central midfielders in each to see which side wins a central overload.",
        inlineCheck: {
          question: "What does it mean to \"overload\" central midfield?",
          options: [
            "Positioning more players there than the opponent can mark",
            "Playing every pass through the goalkeeper",
            "Only using wingers to attack",
            "Keeping all 11 players behind the ball",
          ],
          correctIndex: 0,
        },
        takeaways: [
          "An overload means outnumbering the opponent in a specific area, usually the center.",
          "Formations with three central midfielders often win this battle against a flat two.",
          "A well-timed third-man run exploits the overload by arriving unmarked.",
        ],
      },
      {
        slug: "the-midfield-battle",
        title: "The Midfield Battle",
        estimatedMinutes: 3,
        hook: "Whoever wins the midfield battle usually dictates everything else about the match.",
        blocks: [
          {
            kind: "formation",
            id: "4231-in-possession",
            heading: "4-2-3-1, In Possession",
            body: "The double pivot holds its shape while the three attacking midfielders look to exploit the space and numbers created ahead of them.",
            formationSlug: "4-2-3-1",
          },
          {
            kind: "formation",
            id: "4231-out-of-possession",
            heading: "4-2-3-1, Out of Possession",
            body: "The same shape compresses defensively — the double pivot's cover, pressing triggers, and central discipline all activate at once without the ball.",
            formationSlug: "4-2-3-1",
            phase: "out-of-possession",
          },
          {
            kind: "text",
            id: "recap",
            heading: "Recap",
            body: "A double pivot that covers for itself, a box-to-box runner who links both boxes, pressing triggers read as a unit, and a central overload exploited by a well-timed run — these four ideas are what winning the midfield battle actually looks like in practice.",
          },
        ],
        tryIt:
          "Go back to the Explore pitch, pick 4-3-3, and count how the midfield three's roles differ using what you've learned about pivots and box-to-box coverage.",
        inlineCheck: {
          question: "Which idea from this module explains why an extra central midfielder can control a match?",
          options: [
            "Overloading the middle with more players than the opponent can mark",
            "Always playing with a back three",
            "Never crossing the halfway line",
            "Substituting the goalkeeper at halftime",
          ],
          correctIndex: 0,
        },
        takeaways: [
          "A double pivot, a box-to-box runner, pressing triggers, and central overloads all shape the midfield battle together.",
          "Winning central midfield numerically and positionally tends to control the rest of the match.",
          "You've now covered defending and midfield control — next is what happens further forward.",
        ],
      },
    ],
    quiz: [
      {
        question: "What is the main advantage of a double pivot?",
        options: [
          "The two holding midfielders can cover for each other",
          "It requires only one central midfielder total",
          "It guarantees more possession automatically",
          "It removes the need for full-backs",
        ],
        correctIndex: 0,
        explanation: "Splitting defensive midfield responsibility between two players means one can cover when the other steps out.",
      },
      {
        question: "What defines a box-to-box midfielder?",
        options: [
          "Covering ground from the defensive box to the attacking box",
          "Staying permanently inside the center circle",
          "Only playing set pieces",
          "Never tracking back defensively",
        ],
        correctIndex: 0,
        explanation: "The role is defined by total two-way ground covered, not a single specialization.",
      },
      {
        question: "What is a pressing trigger?",
        options: [
          "A specific cue that signals the moment to press as a unit",
          "A card shown by the referee",
          "A fixed time in the match when pressing is required",
          "A formation used only for corners",
        ],
        correctIndex: 0,
        explanation: "Triggers like a heavy touch or a backward pass tell the team when to press together rather than individually.",
      },
      {
        question: "Where are pressing traps commonly set?",
        options: [
          "Wide areas near the touchline, where space is limited",
          "Directly in front of the opposition's goal",
          "Only inside the center circle",
          "Anywhere the ball happens to be",
        ],
        correctIndex: 0,
        explanation: "The touchline itself cuts off options, making wide areas a common place to spring a coordinated press.",
      },
      {
        question: "What does \"overloading\" midfield mean?",
        options: [
          "Positioning more players there than the opponent can mark",
          "Playing with no midfielders at all",
          "Substituting all midfielders at halftime",
          "Only defending set pieces zonally",
        ],
        correctIndex: 0,
        explanation: "An overload creates a numerical advantage in a specific area, usually the center of the pitch.",
      },
      {
        question: "Which formation naturally wins a central overload against a flat two-man midfield?",
        options: [
          "One with three central midfielders, like a 4-3-3",
          "A 4-4-2 with two flat banks of four",
          "Any formation with a back three",
          "A formation with two strikers",
        ],
        correctIndex: 0,
        explanation: "Three central midfielders against an opponent's two creates a spare man in the middle of the pitch.",
      },
      {
        question: "What is a \"third-man run\"?",
        options: [
          "A midfielder arriving late into space as an unmarked passing option",
          "A substitution made in the third minute of stoppage time",
          "The third defender to challenge for a header",
          "A run only strikers are allowed to make",
        ],
        correctIndex: 0,
        explanation: "It exploits an overload by having a third player arrive unmarked while the defense focuses on the first two options.",
      },
      {
        question: "What ties this whole module together?",
        options: [
          "A double pivot, box-to-box coverage, pressing triggers, and overloads all shape the midfield battle",
          "Only central midfielders matter in football",
          "Formations without a double pivot cannot defend",
          "Pressing triggers only apply in the attacking third",
        ],
        correctIndex: 0,
        explanation: "Winning the midfield battle in practice means combining all four ideas from this module, not just one.",
      },
    ],
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
