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
    description: "Width and depth, overlaps and underlaps, the False 9, and movement in the box.",
    lessons: [
      {
        slug: "width-and-depth",
        title: "Width and Depth: Stretching the Defense",
        estimatedMinutes: 4,
        hook: "The more of the pitch a defense has to cover, the more gaps appear somewhere in it.",
        blocks: [
          {
            kind: "formation",
            id: "433-width",
            heading: "4-3-3's Width",
            body: "Wide forwards holding the touchline force the opposition's back line to stretch across the full width of the pitch, or leave the flank open entirely.",
            formationSlug: "4-3-3",
          },
          {
            kind: "zone",
            id: "space-width-creates",
            heading: "Where Width Creates Space",
            body: "Pulling defenders toward the touchline opens exactly this kind of central space — the pocket a false 9 or an attacking midfielder is looking to exploit.",
            zones: [{ x: 30, y: 15, width: 40, height: 25 }],
          },
          {
            kind: "toggle",
            id: "narrow-vs-wide",
            heading: "Narrow vs. Wide Attack",
            body: "Compare an attack that stays compact and central against one that stretches to both touchlines. Neither is automatically better — it depends on where the defense is weakest.",
            optionA: { label: "Narrow attack", zones: [{ x: 30, y: 5, width: 40, height: 30 }] },
            optionB: {
              label: "Wide attack",
              zones: [
                { x: 0, y: 8, width: 25, height: 27 },
                { x: 75, y: 8, width: 25, height: 27 },
              ],
            },
          },
        ],
        tryIt:
          "On the pitch explorer, compare 4-3-3 and 4-4-2 Diamond — the Diamond trades width for central numbers, so look at how much touchline space is left uncovered.",
        inlineCheck: {
          question: "What is the main benefit of holding width in attack?",
          options: [
            "It forces the defense to cover the full pitch, opening central space",
            "It guarantees more corners",
            "It means the goalkeeper never has to pass long",
            "It prevents the opponent from ever pressing",
          ],
          correctIndex: 0,
        },
        takeaways: [
          "Width forces a defense to stretch across the full pitch or concede space on the flank.",
          "Stretching the defense wide is often what creates the central pocket an attacker exploits.",
          "Staying narrow trades that stretch for extra numbers in the middle instead.",
        ],
      },
      {
        slug: "overlaps-and-underlaps",
        title: "Combination Play: Overlaps and Underlaps",
        estimatedMinutes: 4,
        hook: "Two attackers combining on the same flank can beat a defender that neither could beat alone.",
        blocks: [
          {
            kind: "zone",
            id: "overlap-lane",
            heading: "The Overlap Lane",
            body: "An overlapping run goes around the outside of a teammate who already has the ball wide, threatening to get in behind the full-back on the touchline itself.",
            zones: [{ x: 0, y: 20, width: 22, height: 40 }],
          },
          {
            kind: "toggle",
            id: "overlap-vs-underlap",
            heading: "Overlap vs. Underlap",
            body: "An overlap runs outside; an underlap runs inside. Compare the two paths past the same defender — each threatens a completely different part of the pitch.",
            optionA: { label: "Overlap (outside)", zones: [{ x: 0, y: 15, width: 20, height: 45 }] },
            optionB: { label: "Underlap (inside)", zones: [{ x: 20, y: 15, width: 20, height: 45 }] },
          },
          {
            kind: "text",
            id: "why-underlap-works",
            heading: "Why the Underlap Works",
            body: "A full-back who has been trained all match to expect the overlapping run outside can be caught completely flat-footed by the same teammate suddenly cutting inside instead. The threat of the outside run is often what makes the inside run so effective.",
          },
        ],
        tryIt:
          "Watch a winger and full-back on the same flank — see if you can predict whether the supporting run goes outside (overlap) or inside (underlap) before it happens.",
        inlineCheck: {
          question: "What makes an underlapping run effective even though it goes against the expected pattern?",
          options: [
            "Defenders are often set up to expect the outside overlap instead",
            "It is illegal to defend against",
            "It only works from a corner kick",
            "It requires the goalkeeper to join the attack",
          ],
          correctIndex: 0,
        },
        takeaways: [
          "An overlap runs outside a teammate; an underlap runs inside.",
          "Defenders are often organized around expecting the overlap, which is exactly what makes the underlap dangerous.",
          "Combination play on one flank can beat a defender neither attacker could beat alone.",
        ],
      },
      {
        slug: "the-false-9",
        title: "The False 9: Creating Space by Leaving It",
        estimatedMinutes: 4,
        hook: "Sometimes the best way for a striker to create a chance is to not be where a striker is supposed to be.",
        blocks: [
          {
            kind: "zone",
            id: "false-9-two-positions",
            heading: "Two Positions, One Player",
            body: "A false 9 starts on the front line like a conventional striker, but regularly drops into the deeper pocket instead — occupying both of these zones across a single match.",
            zones: [
              { x: 20, y: 0, width: 60, height: 12 },
              { x: 25, y: 15, width: 50, height: 20 },
            ],
          },
          {
            kind: "text",
            id: "space-left-behind",
            heading: "The Space Left Behind",
            body: "When the false 9 drops deep, the center-back marking them has a choice: follow into midfield and abandon the defensive line, or stay put and let the false 9 receive the ball freely. Either choice creates an opportunity somewhere else on the pitch.",
          },
          {
            kind: "text",
            id: "who-runs-into-it",
            heading: "Who Runs Into It",
            body: "The empty space up front doesn't stay empty for long — a winger cutting inside or an attacking midfielder arriving late is usually the one running into exactly the space the false 9 just vacated.",
          },
        ],
        tryIt:
          "Visit the False 9 position page and read how the role's zone diagram differs from a conventional striker's.",
        inlineCheck: {
          question: "What dilemma does a false 9 create for an opposing center-back?",
          options: [
            "Follow them into midfield and abandon the defensive line, or stay and let them receive freely",
            "Whether to take a yellow card immediately",
            "Which corner to defend first",
            "Whether to swap positions with the goalkeeper",
          ],
          correctIndex: 0,
        },
        takeaways: [
          "A false 9 alternates between the front line and a deeper pocket rather than staying fixed.",
          "Dropping deep forces a defensive decision that has no clean answer for the center-back.",
          "The space the false 9 leaves behind is meant to be exploited by a teammate's run, not wasted.",
        ],
      },
      {
        slug: "movement-in-the-box",
        title: "Movement in the Box: Near Post, Far Post, Cutback",
        estimatedMinutes: 4,
        hook: "A cross is only as good as the run meeting it — and there are only so many places to make that run.",
        blocks: [
          {
            kind: "toggle",
            id: "near-vs-far-post",
            heading: "Near Post vs. Far Post",
            body: "A near-post run attacks the space closest to the crosser, often getting there first for a flicked finish. A far-post run arrives late on the opposite side, meeting a cross that's traveled across the whole box.",
            optionA: { label: "Near-post run", zones: [{ x: 55, y: 2, width: 20, height: 14 }] },
            optionB: { label: "Far-post run", zones: [{ x: 10, y: 2, width: 20, height: 14 }] },
          },
          {
            kind: "zone",
            id: "cutback-zone",
            heading: "The Cutback Zone",
            body: "Rather than crossing early, a player reaching the byline can pull the ball back into this zone — square across the edge of the six-yard box, right into the path of an arriving midfielder.",
            zones: [{ x: 20, y: 12, width: 60, height: 10 }],
          },
          {
            kind: "text",
            id: "why-cutbacks-work",
            heading: "Why Cutbacks Work",
            body: "Defenders facing their own goal find a cutback far harder to deal with than a cross — they have to turn to track a runner arriving from behind them, often too late to intervene before the shot.",
          },
        ],
        tryIt:
          "Watch the next few crosses in a match and classify each run as near post, far post, or a cutback into the edge of the box.",
        inlineCheck: {
          question: "Why is a cutback often harder for defenders to deal with than a cross?",
          options: [
            "Defenders have to turn to track a runner arriving from behind them",
            "Cutbacks are not allowed to be defended inside the box",
            "The goalkeeper cannot save a cutback",
            "Cutbacks always result in a penalty",
          ],
          correctIndex: 0,
        },
        takeaways: [
          "Near-post and far-post runs attack different spaces and arrive at different times.",
          "A cutback into the edge of the box is often more dangerous than a cross into it.",
          "Attacking movement in the box only works if it's timed to a specific delivery, not run randomly.",
        ],
      },
      {
        slug: "putting-attacks-together",
        title: "Putting Attacks Together",
        estimatedMinutes: 3,
        hook: "Width, combination play, false 9 movement, and box runs aren't separate tools — a good attack uses all of them in the same passage of play.",
        blocks: [
          {
            kind: "formation",
            id: "433-in-possession-recap",
            heading: "4-3-3 in Full Flow",
            body: "Wide forwards holding width, an overlapping or underlapping full-back, and a central presence ready to arrive late — all of this module's ideas are visible in a single settled attacking shape.",
            formationSlug: "4-3-3",
          },
          {
            kind: "text",
            id: "recap",
            heading: "Recap",
            body: "Width stretches the defense and opens central space. Overlaps and underlaps combine two attackers against one defender. A false 9 trades a fixed position for the space it creates elsewhere. Box movement only pays off when it's timed to the delivery arriving.",
          },
        ],
        tryIt:
          "Go back to the Explore pitch, pick any formation, and identify which players are most likely to provide width and which are most likely to make late runs into the box.",
        inlineCheck: {
          question: "What's the central idea connecting this whole module?",
          options: [
            "Attacking principles work together in the same passage of play, not in isolation",
            "Only wingers can create width",
            "A false 9 should never return to the front line",
            "Cutbacks are illegal outside the six-yard box",
          ],
          correctIndex: 0,
        },
        takeaways: [
          "Width, combination play, false 9 movement, and box runs reinforce each other rather than working alone.",
          "A single attacking move often uses two or three of these ideas at once.",
          "You've now covered defending, midfield control, and attacking — the pieces are ready to combine into full systems.",
        ],
      },
    ],
    quiz: [
      {
        question: "What is the main benefit of holding width in attack?",
        options: [
          "It forces the defense to cover the full pitch, opening central space",
          "It guarantees more corners",
          "It prevents the opponent from ever scoring",
          "It means the goalkeeper never has to pass long",
        ],
        correctIndex: 0,
        explanation: "Stretching the defense across the width of the pitch is often what opens the central pocket an attacker exploits.",
      },
      {
        question: "What is the difference between an overlap and an underlap?",
        options: [
          "An overlap runs outside a teammate; an underlap runs inside",
          "An overlap is only legal in the final third",
          "An underlap can only be made by a goalkeeper",
          "There is no difference — they're the same run",
        ],
        correctIndex: 0,
        explanation: "The two runs threaten completely different spaces around the same defender.",
      },
      {
        question: "Why is an underlapping run often effective?",
        options: [
          "Defenders are frequently set up to expect the outside overlap instead",
          "It is faster than running in a straight line",
          "It cannot be tracked by any defender",
          "It only happens after a foul",
        ],
        correctIndex: 0,
        explanation: "The expectation of an overlap is often exactly what makes the inside run so effective.",
      },
      {
        question: "What dilemma does a false 9 create for a marking center-back?",
        options: [
          "Follow into midfield and abandon the line, or stay and allow free receipt",
          "Whether to switch shirts at halftime",
          "Which throw-in to defend first",
          "Whether to mark the goalkeeper instead",
        ],
        correctIndex: 0,
        explanation: "Neither option is clean, which is exactly why the movement is effective.",
      },
      {
        question: "What is a cutback?",
        options: [
          "A pass pulled back from the byline into the edge of the box",
          "A tackle made from behind",
          "A striker's run toward the near post",
          "A goalkeeper's distribution under pressure",
        ],
        correctIndex: 0,
        explanation: "It's played square into space rather than crossed early into the box.",
      },
      {
        question: "Why can a cutback be harder to defend than a cross?",
        options: [
          "Defenders have to turn to track a runner arriving from behind them",
          "It is not allowed to be blocked",
          "It always beats the goalkeeper",
          "It can only be played from a corner",
        ],
        correctIndex: 0,
        explanation: "Turning to face a runner coming from behind is a much harder defensive job than heading a cross away.",
      },
      {
        question: "What's the difference between a near-post and a far-post run?",
        options: [
          "They attack different spaces and arrive at different times relative to the cross",
          "A far-post run is only for goalkeepers",
          "A near-post run is illegal in open play",
          "They are identical runs with different names",
        ],
        correctIndex: 0,
        explanation: "A near-post run often arrives first for a flicked finish; a far-post run arrives late on the opposite side.",
      },
      {
        question: "What ties this whole module together?",
        options: [
          "Width, combination play, false 9 movement, and box runs work together in the same attack",
          "Only one attacking idea should be used per match",
          "False 9s should never return to the front line",
          "Width is only useful in a back three",
        ],
        correctIndex: 0,
        explanation: "A single attacking move often draws on two or three of this module's ideas at once, not just one.",
      },
    ],
  },
  {
    slug: "systems",
    order: 5,
    title: "Formations & Systems",
    accent: "control",
    description: "Back four vs. back three, the 4-4-2 diamond, wing-backs, and choosing a system for your players.",
    lessons: [
      {
        slug: "back-four-vs-back-three",
        title: "Back Four vs. Back Three: The Fundamental Choice",
        estimatedMinutes: 4,
        hook: "Before a single player is chosen, every formation starts with one decision: four defenders across the back, or three?",
        blocks: [
          {
            kind: "formation",
            id: "a-back-four",
            heading: "A Back Four",
            body: "Four defenders share the width of the pitch between them, with full-backs providing both defensive coverage on the flanks and attacking width going forward.",
            formationSlug: "4-4-2",
          },
          {
            kind: "formation",
            id: "a-back-three",
            heading: "A Back Three",
            body: "Three center-backs cover the middle of the pitch, freeing wing-backs to provide the width alone — one player doing a job two normally share.",
            formationSlug: "3-5-2",
          },
          {
            kind: "text",
            id: "the-trade-off",
            heading: "The Trade-Off",
            body: "A back four gives natural width without asking any one player to cover the full touchline alone. A back three trades that for an extra central defender, at the cost of demanding exceptional stamina from the wing-backs who now provide width by themselves.",
          },
        ],
        tryIt:
          "On the pitch explorer, switch between 4-4-2 and 3-5-2 and count how many players occupy the width of the pitch in each shape.",
        inlineCheck: {
          question: "What does a back three gain compared to a back four?",
          options: [
            "An extra central defender, at the cost of relying on wing-backs for width",
            "An automatic extra goal per match",
            "The ability to play without a goalkeeper",
            "A guaranteed win against back-four teams",
          ],
          correctIndex: 0,
        },
        takeaways: [
          "A back four splits defensive and attacking width duty between two full-backs.",
          "A back three adds central defensive numbers but asks wing-backs to cover the width alone.",
          "Neither choice is universally correct — it depends on the players and the opponent.",
        ],
      },
      {
        slug: "diamond-vs-flat-four",
        title: "The Diamond and the Flat Four: Two Ways to Set Up a 4-4-2",
        estimatedMinutes: 4,
        hook: "4-4-2 isn't one formation — it's at least two, depending on how the midfield four is shaped.",
        blocks: [
          {
            kind: "formation",
            id: "flat-442",
            heading: "Flat 4-4-2",
            body: "A straight line of four across midfield gives even coverage of the width, with wide midfielders responsible for both defensive tracking and attacking width.",
            formationSlug: "4-4-2",
          },
          {
            kind: "formation",
            id: "diamond-442",
            heading: "4-4-2 Diamond",
            body: "The same eleven players, reshaped into a diamond — extra central midfield control at the cost of natural width, which now has to come from the full-backs alone.",
            formationSlug: "4-4-2-diamond",
          },
          {
            kind: "text",
            id: "which-to-choose",
            heading: "Which to Choose",
            body: "A flat four suits a team with strong, two-way wide midfielders and full-backs who don't need to provide much attacking width themselves. A diamond suits a team stacked with central midfield talent and full-backs athletic enough to supply width alone.",
          },
        ],
        tryIt:
          "Compare the 4-4-2 and 4-4-2 Diamond cards on the pitch explorer — read each one's strengths and weaknesses side by side using compare mode.",
        inlineCheck: {
          question: "What does the 4-4-2 Diamond trade away compared to the flat 4-4-2?",
          options: [
            "Natural width, in exchange for extra central midfield control",
            "One of the two strikers",
            "The goalkeeper's distribution options",
            "The ability to press at all",
          ],
          correctIndex: 0,
        },
        takeaways: [
          "The same 4-4-2 label can describe two very differently shaped midfields.",
          "A flat four spreads coverage evenly; a diamond concentrates control centrally.",
          "The right choice depends on whether your strength is central numbers or natural width.",
        ],
      },
      {
        slug: "wing-backs-and-width",
        title: "Wing-Backs: The Extra Width of a Back Three",
        estimatedMinutes: 4,
        hook: "In a back three, one player on each side has to do the job two players normally share.",
        blocks: [
          {
            kind: "formation",
            id: "343-wing-backs",
            heading: "Wing-Backs in a 3-4-3",
            body: "With three center-backs holding the middle, the wing-backs become the team's only source of width — pushing on like wingers in possession, then dropping into a back five without the ball.",
            formationSlug: "3-4-3",
          },
          {
            kind: "zone",
            id: "wing-back-full-corridor",
            heading: "A Wing-Back's Full Corridor",
            body: "This zone spans almost the entire length of one touchline — the ground a wing-back is expected to cover alone, in both directions, for the full match.",
            zones: [{ x: 0, y: 8, width: 25, height: 84 }],
          },
          {
            kind: "text",
            id: "the-stamina-demand",
            heading: "The Stamina Demand",
            body: "This is the same idea behind the Inverted Full-Back and Inverted Wing-Back hybrid roles covered earlier in the Academy — full width duty concentrated in one player instead of shared, which is exactly why wing-back systems live or die on fitness.",
          },
        ],
        tryIt:
          "Visit the Left Wing-Back position page and compare its zone diagram to a standard left-back's much smaller zone.",
        inlineCheck: {
          question: "Why do wing-back systems demand exceptional stamina?",
          options: [
            "One player provides the width that two players normally share",
            "Wing-backs are not allowed to be substituted",
            "The formation requires extra sprinting drills by rule",
            "Wing-backs play a longer match than everyone else",
          ],
          correctIndex: 0,
        },
        takeaways: [
          "Wing-backs are the sole source of width in a back-three system.",
          "Their zone covers nearly the full length of one touchline, in both directions.",
          "This demand is exactly why fitness is often the deciding factor in whether a wing-back system works.",
        ],
      },
      {
        slug: "choosing-a-formation-for-your-players",
        title: "Choosing a Formation for Your Players, Not the Other Way Around",
        estimatedMinutes: 4,
        hook: "The best formation on paper is worthless if it doesn't suit the players actually on the pitch.",
        blocks: [
          {
            kind: "text",
            id: "personnel-first",
            heading: "Personnel First",
            body: "A formation is a starting template, not a guarantee. A 4-3-3 built around technical wide forwards fails without players who can beat a defender one-on-one; a back three fails without wing-backs who have the stamina to cover the width alone all match.",
          },
          {
            kind: "formation",
            id: "example-fit",
            heading: "A Formation That Fits Its Personnel",
            body: "This shape works specifically because it's built around players suited to its specific demands — a lone striker comfortable holding the ball alone, and attacking midfielders who thrive finding pockets of space, not because the formation itself is inherently superior.",
            formationSlug: "4-2-3-1",
          },
          {
            kind: "text",
            id: "reading-your-squad",
            heading: "Reading Your Squad",
            body: "Before picking a system, a coach has to ask honest questions: do we have a genuine goalscorer who can play alone up front? Full-backs athletic enough to be wing-backs? A double pivot capable of shielding a back four on its own? The answers point to the formation, not the other way around.",
          },
        ],
        tryIt:
          "Pick any formation on the pitch explorer and read its \"Best suited to\" note in the coach's notes panel — that's exactly this idea in practice.",
        inlineCheck: {
          question: "What should determine which formation a team plays?",
          options: [
            "The players available and what suits their specific strengths",
            "Whichever formation is most popular that season",
            "The formation used by the biggest club in the league",
            "Whichever formation has the most players on the field",
          ],
          correctIndex: 0,
        },
        takeaways: [
          "A formation is only as good as the players asked to play inside it.",
          "The same system can succeed at one club and fail at another purely based on personnel.",
          "Reading your own squad honestly should come before picking a system, not after.",
        ],
      },
      {
        slug: "formations-are-tools",
        title: "Formations Are Tools, Not Identities",
        estimatedMinutes: 3,
        hook: "A formation number is a starting shape — everything this Academy has covered is what actually happens inside it.",
        blocks: [
          {
            kind: "formation",
            id: "recap-formation",
            heading: "One Shape, Every Idea",
            body: "Pitch thirds, marking systems, a double pivot, width and combination play — every idea from this Academy is visible somewhere inside a single settled formation like this one.",
            formationSlug: "4-3-3",
          },
          {
            kind: "text",
            id: "recap",
            heading: "Recap",
            body: "A back four or a back three, a flat four or a diamond, full-backs or wing-backs — these are all just starting templates. What separates a good team from a great one is everything layered on top: marking systems, pressing triggers, combination play, and personnel suited to the system chosen.",
          },
        ],
        tryIt:
          "Open compare mode on the Explore pitch and put any two formations side by side — you should now be able to explain the trade-off between them in your own words.",
        inlineCheck: {
          question: "What is the main lesson of this module?",
          options: [
            "A formation is a tool that only works with the right personnel and ideas inside it",
            "Back three formations are always superior to back four",
            "Every team should use a 4-4-2 diamond",
            "Formations never need to change during a match",
          ],
          correctIndex: 0,
        },
        takeaways: [
          "Formations are starting templates, not fixed identities.",
          "The same formation number can be set up in genuinely different ways.",
          "You've now covered every major building block of tactics — the last step is seeing how real managers apply them.",
        ],
      },
    ],
    quiz: [
      {
        question: "What does a back three gain compared to a back four?",
        options: [
          "An extra central defender, relying on wing-backs for width instead",
          "An extra striker",
          "The right to ignore offside calls",
          "A guaranteed clean sheet",
        ],
        correctIndex: 0,
        explanation: "The trade-off is central numbers in exchange for width duty falling entirely on the wing-backs.",
      },
      {
        question: "What does the 4-4-2 Diamond trade away compared to a flat 4-4-2?",
        options: [
          "Natural width, in exchange for central midfield control",
          "One of the center-backs",
          "The goalkeeper",
          "The ability to score from open play",
        ],
        correctIndex: 0,
        explanation: "The diamond concentrates midfield centrally, leaving width to come from the full-backs alone.",
      },
      {
        question: "Why do wing-back systems demand exceptional stamina?",
        options: [
          "One player provides the width two players normally share",
          "Wing-backs play extra minutes compared to teammates",
          "It is a rule specific to back-three formations",
          "Wing-backs are not allowed to be substituted",
        ],
        correctIndex: 0,
        explanation: "Covering an entire touchline alone, in both directions, is a huge physical demand.",
      },
      {
        question: "What should determine which formation a team plays?",
        options: [
          "The players available and what suits their specific strengths",
          "Whichever system is trending that season",
          "The formation with the most attacking players",
          "Whatever the opposition manager chooses first",
        ],
        correctIndex: 0,
        explanation: "A formation only works as well as the personnel asked to play inside it.",
      },
      {
        question: "Which formation pairing is typically associated with a back three?",
        options: ["3-4-3 and 3-5-2", "4-4-2 and 4-3-3", "4-2-3-1 and 4-1-4-1", "4-4-2 Diamond only"],
        correctIndex: 0,
        explanation: "Both use three central defenders with wing-backs supplying the width.",
      },
      {
        question: "What is the same 4-4-2 label capable of describing?",
        options: [
          "Two genuinely different midfield shapes — flat or diamond",
          "Only one possible system with no variation",
          "A formation exclusive to teams with two goalkeepers",
          "A system that cannot be compared to any other",
        ],
        correctIndex: 0,
        explanation: "The same numbers can hide very different midfield shapes underneath.",
      },
      {
        question: "What is the main lesson of choosing a formation for your players?",
        options: [
          "Personnel should determine the system, not the other way around",
          "Every squad should play the same formation regardless of personnel",
          "Formations are chosen randomly by most coaches",
          "Only strikers matter when choosing a formation",
        ],
        correctIndex: 0,
        explanation: "The same system can succeed or fail purely based on whether the squad suits its demands.",
      },
      {
        question: "What is the central idea of this whole module?",
        options: [
          "A formation is a tool that only works with the right ideas and personnel inside it",
          "There is one objectively best formation in football",
          "Back four formations are outdated",
          "Formations should never be compared to each other",
        ],
        correctIndex: 0,
        explanation: "Everything covered elsewhere in the Academy is what actually determines whether a formation succeeds.",
      },
    ],
  },
  {
    slug: "managers-minds",
    order: 6,
    title: "The Managers' Minds",
    accent: "gold",
    description: "How real managers apply pressing, possession, pragmatism, and back-three systems.",
    lessons: [
      {
        slug: "pressing-philosophies",
        title: "Pressing Philosophies: From Sacchi to Klopp",
        estimatedMinutes: 4,
        hook: "Pressing didn't start with any one manager — tracing its lineage shows how one idea evolved across decades.",
        blocks: [
          {
            kind: "formation",
            id: "sacchi-442",
            heading: "Sacchi's Pressing 4-4-2",
            body: "At AC Milan in the late 1980s, Arrigo Sacchi built his team around a compact, zonal defensive block that pressed high up the pitch as a single coordinated unit — a genuine break from the man-marking sweeper systems common at the time.",
            formationSlug: "4-4-2",
          },
          {
            kind: "formation",
            id: "klopp-433",
            heading: "Klopp's Gegenpressing 4-3-3",
            body: "Decades later, Jürgen Klopp's teams press with the specific goal of winning the ball back within seconds of losing it, turning the moment of losing possession into the fastest route to a scoring chance.",
            formationSlug: "4-3-3",
          },
          {
            kind: "text",
            id: "the-shared-thread",
            heading: "The Shared Thread",
            body: "Different eras, different formations, but the same underlying idea: pressing works when the whole team reads the same trigger and moves together, exactly as covered in the Controlling the Midfield module.",
          },
        ],
        tryIt: "Visit the Arrigo Sacchi and Jürgen Klopp manager pages and compare their \"Why it worked\" sections side by side.",
        inlineCheck: {
          question: "What connects Sacchi's and Klopp's approaches despite being decades apart?",
          options: [
            "Both rely on the whole team pressing together as a coordinated unit",
            "Both exclusively used a back three",
            "Both refused to ever sit deep",
            "Both invented the offside rule",
          ],
          correctIndex: 0,
        },
        takeaways: [
          "Sacchi's zonal, coordinated press was a significant break from the man-marking systems of his era.",
          "Klopp's gegenpressing applies a similar coordinated idea with the specific goal of an immediate transition to attack.",
          "Pressing systems evolve, but coordinated team movement remains the core requirement.",
        ],
      },
      {
        slug: "possession-as-a-weapon",
        title: "Possession as a Weapon: The Guardiola Blueprint",
        estimatedMinutes: 4,
        hook: "For some managers, having the ball isn't just a means to attack — it's the primary defensive strategy too.",
        blocks: [
          {
            kind: "formation",
            id: "guardiola-433",
            heading: "Guardiola's Positional 4-3-3",
            body: "Pep Guardiola's teams use exact positional discipline so a teammate is always reachable by a pass, patiently building attacks from the goalkeeper rather than bypassing midfield with long balls.",
            formationSlug: "4-3-3",
          },
          {
            kind: "text",
            id: "cant-concede-without-the-ball",
            heading: "You Can't Concede Without the Ball",
            body: "If the team keeps possession, the opponent never gets the chance to attack at all — a simple idea that shapes almost every decision in a Guardiola team's build-up play.",
          },
          {
            kind: "text",
            id: "the-inverted-fullback-connection",
            heading: "The Inverted Full-Back Connection",
            body: "This possession-first approach is closely associated with the Inverted Full-Back hybrid role covered earlier in the Academy — full-backs tucking into central midfield to add an extra passing option and help control the game through sheer numbers in possession.",
          },
        ],
        tryIt: "Visit the Inverted Full-Back position page, then the Pep Guardiola manager page, and see how directly the two connect.",
        inlineCheck: {
          question: "What is the core defensive logic behind a possession-first approach?",
          options: [
            "If your team has the ball, the opponent cannot attack at all",
            "Possession-based teams never need a goalkeeper",
            "Keeping the ball guarantees a win regardless of chances created",
            "Possession football requires no defensive organization",
          ],
          correctIndex: 0,
        },
        takeaways: [
          "Positional discipline keeps a teammate reachable by a pass at almost all times.",
          "Retaining the ball is itself a defensive strategy, not just an attacking one.",
          "The inverted full-back role is a direct tool for adding central passing numbers in this approach.",
        ],
      },
      {
        slug: "pragmatism-and-game-management",
        title: "Pragmatism and Game Management: The Mourinho Approach",
        estimatedMinutes: 4,
        hook: "Not every successful manager builds their identity around an attacking philosophy — some build it around control.",
        blocks: [
          {
            kind: "formation",
            id: "mourinho-4231",
            heading: "Mourinho's Compact 4-2-3-1",
            body: "José Mourinho's double pivot keeps the team defensively solid before committing players forward, prioritizing organization over any fixed attacking style.",
            formationSlug: "4-2-3-1",
          },
          {
            kind: "text",
            id: "reading-the-opponent",
            heading: "Reading the Opponent, Not a Fixed Script",
            body: "Rather than imposing the same approach on every match, this philosophy adjusts specifically to the threat the opposition poses — sometimes inviting pressure to counter into space, sometimes controlling the ball, depending on what wins that particular match.",
          },
          {
            kind: "text",
            id: "results-first",
            heading: "Results First",
            body: "This is the double pivot idea from Controlling the Midfield applied with a specific priority: defensive security first, attacking risk only once that security is established.",
          },
        ],
        tryIt: "Visit the José Mourinho manager page and compare his \"Philosophy\" note to Guardiola's — notice how differently each defines what winning football looks like.",
        inlineCheck: {
          question: "What defines a pragmatic, results-first approach to management?",
          options: [
            "Adjusting the tactical approach match-by-match based on the opponent's threat",
            "Playing the exact same way regardless of the opponent",
            "Refusing to ever use a double pivot",
            "Only signing attacking players",
          ],
          correctIndex: 0,
        },
        takeaways: [
          "A double pivot provides the defensive foundation this approach is built on.",
          "Pragmatic management adjusts match-by-match rather than following one fixed attacking script.",
          "Defensive organization coming first doesn't mean attacking risk never happens — it happens once security is established.",
        ],
      },
      {
        slug: "back-to-three-conte",
        title: "Back to Three: Conte's System",
        estimatedMinutes: 4,
        hook: "While most of the league settled on a back four, one system kept finding managers willing to revive it.",
        blocks: [
          {
            kind: "formation",
            id: "conte-343",
            heading: "Conte's 3-4-3",
            body: "Antonio Conte builds teams around a back three that provides defensive security while wing-backs supply the width, freeing the front three to focus purely on attacking play.",
            formationSlug: "3-4-3",
          },
          {
            kind: "zone",
            id: "wing-back-dual-role",
            heading: "A Wing-Back's Dual Role",
            body: "This is the exact wing-back demand covered in Formations & Systems — functioning as an auxiliary winger in possession and an auxiliary full-back out of it, all in the same 90 minutes.",
            zones: [{ x: 0, y: 8, width: 25, height: 84 }],
          },
          {
            kind: "text",
            id: "reviving-a-system",
            heading: "Reviving a System",
            body: "Conte's use of a back three is widely credited with helping revive the system's popularity in leagues where a flat back four had become the assumed default, proving the choice between back three and back four is still very much alive.",
          },
        ],
        tryIt: "Visit the Antonio Conte manager page, then compare the 3-4-3 and 4-3-3 formation cards on the pitch explorer.",
        inlineCheck: {
          question: "What does a back three free the front three to focus on, in Conte's system?",
          options: [
            "Attacking play, since the back three and wing-backs provide defensive and width coverage",
            "Taking every corner kick",
            "Playing exclusively as auxiliary goalkeepers",
            "Avoiding the penalty area entirely",
          ],
          correctIndex: 0,
        },
        takeaways: [
          "A back three provides central defensive security while wing-backs supply width alone.",
          "Wing-backs in this system function as auxiliary wingers in possession and auxiliary full-backs without it.",
          "Conte's success with this system helped revive the back three where a back four had become the default.",
        ],
      },
      {
        slug: "reading-a-managers-tactical-identity",
        title: "Reading a Manager's Tactical Identity",
        estimatedMinutes: 3,
        hook: "You now have the vocabulary to look at any manager's team and explain, in specific terms, what they're actually trying to do.",
        blocks: [
          {
            kind: "text",
            id: "everything-connects",
            heading: "Everything Connects",
            body: "Pitch thirds, marking systems, a double pivot, width and combination play, back four versus back three — every idea from this Academy shows up somewhere in how a real manager sets up their team. A manager's tactical identity is just these choices, made consistently.",
          },
          {
            kind: "formation",
            id: "one-more-example",
            heading: "One More Example",
            body: "Marcelo Bielsa's teams commit to man-oriented pressing across the entire pitch — a different answer to the zonal-versus-man question from Defending, applied with total intensity rather than a partial blend.",
            formationSlug: "4-1-4-1",
          },
        ],
        tryIt:
          "Visit the Managers section and pick a profile not covered directly in this module — see how many ideas from the Academy you can now recognize in their tactical philosophy.",
        inlineCheck: {
          question: "What does this module ultimately ask you to do?",
          options: [
            "Recognize the Academy's tactical ideas inside real managers' systems",
            "Memorize every manager's date of birth",
            "Pick a single correct formation for all situations",
            "Ignore everything covered in earlier modules",
          ],
          correctIndex: 0,
        },
        takeaways: [
          "A manager's tactical identity is built from the same building blocks covered across this whole Academy.",
          "Different managers answer the same tactical questions — pressing, possession, marking, formation shape — in different ways.",
          "You've now completed the full Academy — the Managers section is ready to be read with a tactician's eye.",
        ],
      },
    ],
    quiz: [
      {
        question: "What connects Sacchi's and Klopp's pressing approaches despite being decades apart?",
        options: [
          "Both rely on the whole team pressing together as a coordinated unit",
          "Both only ever used a back three",
          "Neither manager ever won a trophy",
          "Both refused to sign attacking players",
        ],
        correctIndex: 0,
        explanation: "Coordinated team pressing is the shared thread linking both eras.",
      },
      {
        question: "What is the core defensive logic behind Guardiola's possession-first approach?",
        options: [
          "If your team has the ball, the opponent cannot attack at all",
          "Possession football requires no defensive organization",
          "Keeping the ball guarantees a result regardless of chances created",
          "Guardiola's teams never press",
        ],
        correctIndex: 0,
        explanation: "Retaining possession functions as a defensive strategy in this approach, not just an attacking one.",
      },
      {
        question: "Which hybrid role is closely associated with Guardiola's possession approach?",
        options: ["Inverted Full-Back", "Sweeper-Keeper", "False 9", "Box-to-Box Midfielder"],
        correctIndex: 0,
        explanation: "Full-backs tucking into midfield add an extra central passing option in possession.",
      },
      {
        question: "What defines Mourinho's pragmatic, results-first approach?",
        options: [
          "Adjusting the tactical approach match-by-match based on the opponent's threat",
          "Playing the exact same way regardless of the opponent",
          "Refusing to ever field a double pivot",
          "Committing every player forward at all times",
        ],
        correctIndex: 0,
        explanation: "The approach prioritizes reading each specific opponent over following one fixed script.",
      },
      {
        question: "What does a back three free the front three to focus on in Conte's system?",
        options: [
          "Attacking play, since the back three and wing-backs cover defense and width",
          "Exclusively defending set pieces",
          "Playing as auxiliary goalkeepers",
          "Taking every throw-in",
        ],
        correctIndex: 0,
        explanation: "The back three and wing-backs handle defensive and width duties, freeing the front three going forward.",
      },
      {
        question: "What is Marcelo Bielsa's defensive approach best described as?",
        options: [
          "Man-oriented pressing across the entire pitch",
          "A passive, deep-sitting back five",
          "Zonal marking exclusively at set pieces",
          "Refusing to press under any circumstances",
        ],
        correctIndex: 0,
        explanation: "Bielsa commits to following opponents man-for-man across the whole pitch rather than defending purely by zone.",
      },
      {
        question: "What is a manager's tactical identity, in the terms this Academy uses?",
        options: [
          "A consistent set of choices across pressing, possession, marking, and formation shape",
          "A single formation number that never changes",
          "The number of trophies a manager has won",
          "A fixed list of players a manager prefers to sign",
        ],
        correctIndex: 0,
        explanation: "Identity comes from how consistently a manager answers the same tactical questions covered throughout the Academy.",
      },
      {
        question: "What does completing this module let you do?",
        options: [
          "Recognize this Academy's tactical ideas inside real managers' systems",
          "Predict every match result in advance",
          "Guarantee a manager's job security",
          "Skip reading any manager profile on the site",
        ],
        correctIndex: 0,
        explanation: "The module's purpose is connecting the Academy's vocabulary directly to the Managers section's real profiles.",
      },
    ],
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
