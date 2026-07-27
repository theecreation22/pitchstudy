/** A single position within a mini-pitch mechanic diagram, in the same 0–100 formation coordinate space as FormationPlayer. */
export type MechanicPoint = { x: number; y: number };

/**
 * One named, spatially-illustrated tactical idea — rendered as a small
 * animated pitch diagram where `moving` players slide between two points
 * while the rest of `formationSlug`'s lineup sits static as backdrop.
 * `playerId` must match a FormationPlayer.id within that formation (e.g.
 * "lb", "cb1") so a formation with duplicate codes (two CBs) stays
 * unambiguous about which specific dot animates.
 */
export type SignatureMechanic = {
  id: string;
  name: string;
  description: string;
  formationSlug: string;
  moving: { playerId: string; from: MechanicPoint; to: MechanicPoint }[];
};

/** One factual, documented connection in a manager's tactical lineage (played under, assisted, or directly succeeded). The same note is shown on both ends of the connection, so it's written to read naturally either way. */
export type LineageLink = { slug: string; note: string };

/** Points at the single Academy lesson that most directly teaches this manager's signature idea. Resolved against curriculum.ts at render time rather than storing a title/module number here, so it can't drift if a lesson is renamed or reordered. */
export type AcademyLink = { moduleSlug: string; lessonSlug: string };

/** A single self-contained quiz question answerable purely from this manager's own profile — a reading-comprehension check, not a trivia fact requiring outside knowledge. */
export type ChallengeQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type Manager = {
  slug: string;
  name: string;
  years: string;
  notableTeams: string[];
  signatureFormationSlug: string;
  tagline: string;
  philosophy: string;
  /** Spatial, diagrammable tactical ideas — rendered as animated mini-pitch mechanics instead of plain text. */
  signatureMechanics?: SignatureMechanic[];
  /** Non-spatial supporting points (fitness, mentality, squad management) that don't reduce to a pitch diagram. */
  whyItWorked: string[];
  /** Factual, pattern-level tactical trade-offs of the system itself — not personal criticism of the manager. */
  vulnerabilities: string[];
  legacy: string;
  /** Managers who directly shaped this one's approach — kept to genuinely documented connections (played under, assisted, or succeeded), not every stylistic echo. Deliberately sparse; not every manager has one. */
  influencedBy?: LineageLink[];
  /** The Academy lesson most closely related to this manager's signature idea. */
  academyLink: AcademyLink;
  /** One quiz question testing content already on this manager's own page. */
  challengeQuestion: ChallengeQuestion;
};

export const managers: Manager[] = [
  {
    slug: "arrigo-sacchi",
    name: "Arrigo Sacchi",
    years: "Club management 1987–1996",
    notableTeams: ["AC Milan", "Italy national team"],
    signatureFormationSlug: "4-4-2",
    tagline: "Proved a pressing, zonal team could beat individual brilliance.",
    philosophy:
      "Built his teams around a compact, zonal defensive block that moved as a single unit, pressing high up the pitch to win the ball back within seconds rather than retreating to defend a lead.",
    signatureMechanics: [
      {
        id: "shifting-as-a-unit",
        name: "Shifting as a Unit",
        description:
          "When the ball goes to one flank, the whole team shifts across together: the near-side full-back presses up while the far-side full-back tucks narrower, so the block's compactness never breaks.",
        formationSlug: "4-4-2",
        moving: [
          { playerId: "lb", from: { x: 15, y: 75 }, to: { x: 10, y: 55 } },
          { playerId: "rb", from: { x: 85, y: 75 }, to: { x: 65, y: 70 } },
        ],
      },
      {
        id: "coordinated-pressing-trigger",
        name: "The Coordinated Pressing Trigger",
        description:
          "Rather than one player chasing the ball alone, a specific trigger sends multiple nearby teammates converging on the same spot at once, cutting off every easy pass in the immediate area.",
        formationSlug: "4-4-2",
        moving: [
          { playerId: "st1", from: { x: 38, y: 18 }, to: { x: 50, y: 32 } },
          { playerId: "cm1", from: { x: 38, y: 50 }, to: { x: 46, y: 38 } },
        ],
      },
    ],
    influencedBy: [
      {
        slug: "helenio-herrera",
        note: "Built his pressing, zonal defense explicitly as a reaction against the deep, disciplined catenaccio system Herrera had refined a generation earlier.",
      },
    ],
    whyItWorked: [
      "Treated organization and rehearsed patterns of play as more valuable than individual improvisation",
    ],
    vulnerabilities: [
      "A high pressing line leaves space in behind for opponents who can play an early, direct ball over the top before the press engages",
      "Zonal discipline can be pulled apart by a team willing to overload a single zone with more runners than the shape is set up to cover",
    ],
    legacy:
      "Widely credited with popularizing zonal-marking, high-pressing football in Italy at a time when man-marking sweeper systems were the norm, influencing a generation of European coaches who came after him.",
    academyLink: { moduleSlug: "managers-minds", lessonSlug: "pressing-philosophies" },
    challengeQuestion: {
      question: "What did Sacchi prioritize over individual improvisation?",
      options: [
        "Rehearsed patterns of play and organization",
        "Long-ball direct football",
        "Man-marking every opponent",
        "Rotating the squad every match",
      ],
      correctIndex: 0,
      explanation:
        "Sacchi valued organization and rehearsed patterns of play over individual improvisation, treating the collective structure as more valuable than any one player's creativity.",
    },
  },
  {
    slug: "pep-guardiola",
    name: "Pep Guardiola",
    years: "Club management 2008–present",
    notableTeams: ["Barcelona", "Bayern Munich", "Manchester City"],
    signatureFormationSlug: "4-3-3",
    tagline: "Turned possession itself into the primary attacking weapon.",
    philosophy:
      "Builds teams around dominating possession and manipulating space, using precise positioning to consistently create passing lanes and outnumber the opposition around the ball.",
    signatureMechanics: [
      {
        id: "fullback-overload",
        name: "The Inverted Full-Back Overload",
        description:
          "A full-back steps inside into central midfield in possession rather than overlapping down the line, turning a back four into an extra central body that outnumbers the opponent's midfield.",
        formationSlug: "4-3-3",
        moving: [{ playerId: "lb", from: { x: 15, y: 75 }, to: { x: 35, y: 55 } }],
      },
      {
        id: "building-out-from-the-back",
        name: "Building Out From the Back",
        description:
          "The center-backs split wide and the goalkeeper steps into the line between them, forming an auxiliary back three that gives every short pass a safe outlet instead of clearing the ball long under pressure.",
        formationSlug: "4-3-3",
        moving: [
          { playerId: "gk", from: { x: 50, y: 95 }, to: { x: 50, y: 85 } },
          { playerId: "cb1", from: { x: 35, y: 78 }, to: { x: 25, y: 80 } },
          { playerId: "cb2", from: { x: 65, y: 78 }, to: { x: 75, y: 80 } },
        ],
      },
    ],
    influencedBy: [
      {
        slug: "johan-cruyff",
        note: "Played under Cruyff in Barcelona's \"Dream Team\" of the early 1990s and has repeatedly credited Cruyff's positional principles as the foundation of his own coaching philosophy.",
      },
      {
        slug: "marcelo-bielsa",
        note: "Sought out Bielsa for an extended conversation about tactics before taking his first senior job, an exchange he has publicly credited as influential.",
      },
    ],
    whyItWorked: [
      "Emphasizes exact positional discipline so teammates are always reachable by a pass, even under pressure",
    ],
    vulnerabilities: [
      "Committing a full-back inside to build possession leaves less cover behind him, which fast, direct counter-attacks are built to exploit",
      "Against a team willing to sit deep and concede the ball entirely, patient possession alone doesn't guarantee enough clear chances to break the game open",
    ],
    legacy:
      "His teams' approach to possession and positional play became one of the most widely studied and imitated tactical templates in modern football.",
    academyLink: { moduleSlug: "managers-minds", lessonSlug: "possession-as-a-weapon" },
    challengeQuestion: {
      question: "In Guardiola's build-up, what does the goalkeeper do when the center-backs split wide?",
      options: [
        "Stays deep in the six-yard box",
        "Steps into the line between them",
        "Joins the front three",
        "Passes long every time",
      ],
      correctIndex: 1,
      explanation:
        "The goalkeeper stepping into the back line forms an auxiliary back three, giving every short pass a safe outlet instead of clearing long under pressure.",
    },
  },
  {
    slug: "jurgen-klopp",
    name: "Jürgen Klopp",
    years: "Club management 2001–2024",
    notableTeams: ["Borussia Dortmund", "Liverpool"],
    signatureFormationSlug: "4-3-3",
    tagline: "Made losing the ball the trigger for the fastest attack.",
    philosophy:
      "Known for an intense, coordinated press that aims to win the ball back within seconds of losing it, turning defensive transitions into the fastest route to a scoring chance.",
    signatureMechanics: [
      {
        id: "angled-pressing-triggers",
        name: "Angled Pressing Triggers",
        description:
          "The front line presses along coordinated angles that cut off a pass back or across, rather than chasing the ball straight on, herding the opponent into a predictable, more easily won pass.",
        formationSlug: "4-3-3",
        moving: [
          { playerId: "lw", from: { x: 18, y: 18 }, to: { x: 35, y: 30 } },
          { playerId: "rw", from: { x: 82, y: 18 }, to: { x: 65, y: 30 } },
        ],
      },
      {
        id: "gegenpressing-to-counter",
        name: "Gegenpressing Into a Counter",
        description:
          "The instant the ball is regained, the nearest midfielder bursts vertically forward rather than resetting possession. The whole point of winning it back high is using the space before the opponent can organize.",
        formationSlug: "4-3-3",
        moving: [{ playerId: "cm2", from: { x: 68, y: 42 }, to: { x: 75, y: 15 } }],
      },
    ],
    influencedBy: [
      {
        slug: "arrigo-sacchi",
        note: "Built his gegenpressing on the pressing revolution Sacchi is widely credited with starting in the late 1980s.",
      },
    ],
    whyItWorked: [
      "Demands extremely high work rate and fitness, treating pressing intensity as a team-wide responsibility",
    ],
    vulnerabilities: [
      "Sustaining full-pitch pressing intensity for ninety minutes is physically demanding, and a team that can patiently retain the ball can tire the press out",
      "Playing long and direct bypasses the midfield press altogether, denying the trigger the whole system is built around",
    ],
    legacy:
      "His pressing approach, often described using the German term \"gegenpressing,\" brought a specific defensive-to-attacking transition style into the mainstream tactical vocabulary.",
    academyLink: { moduleSlug: "managers-minds", lessonSlug: "pressing-philosophies" },
    challengeQuestion: {
      question: "What is \"gegenpressing\" built around?",
      options: [
        "Sitting in a deep, defensive block",
        "Playing exclusively long balls",
        "Winning the ball back within seconds of losing it",
        "Man-marking every opponent",
      ],
      correctIndex: 2,
      explanation:
        "Gegenpressing is about regaining the ball within seconds of losing it, turning a defensive moment into the fastest route to a scoring chance.",
    },
  },
  {
    slug: "jose-mourinho",
    name: "José Mourinho",
    years: "Club management 2000–present",
    notableTeams: ["Porto", "Chelsea", "Inter Milan", "Real Madrid"],
    signatureFormationSlug: "4-2-3-1",
    tagline: "Built winning teams around defensive control, not possession.",
    philosophy:
      "Prioritizes defensive organization and game management above all else, setting teams up to stay compact and disciplined before striking on the counter-attack.",
    signatureMechanics: [
      {
        id: "double-pivot-shield",
        name: "The Double Pivot Shield",
        description:
          "Two holding midfielders stay anchored in front of the back four no matter what happens ahead of them, freeing the attacking midfielder and wide forwards to commit forward without leaving the defense exposed.",
        formationSlug: "4-2-3-1",
        moving: [
          { playerId: "cam", from: { x: 50, y: 28 }, to: { x: 50, y: 12 } },
          { playerId: "lw", from: { x: 18, y: 32 }, to: { x: 12, y: 15 } },
        ],
      },
    ],
    influencedBy: [
      {
        slug: "bobby-robson",
        note: "Worked as Robson's assistant and translator at Sporting CP, Porto, and Barcelona through the 1990s, his first steps into top-level coaching.",
      },
      {
        slug: "louis-van-gaal",
        note: "Stayed on as an assistant coach under Van Gaal at Barcelona after Robson departed, continuing his coaching apprenticeship there.",
      },
    ],
    whyItWorked: [
      "Adjusts his approach match by match based on the specific threat the opponent poses, rather than a fixed style",
      "Treats winning key moments and matches as the priority over any particular attacking philosophy",
    ],
    vulnerabilities: [
      "Sitting deep and compact cedes territory and the ball, so against an opponent who can break down a low block with sustained positional play rather than needing transitions to punish, his teams can be pinned back for long spells",
    ],
    legacy:
      "His pragmatic, results-first approach won domestic titles and continental trophies across four different countries, making him one of the most decorated coaches of his generation.",
    academyLink: { moduleSlug: "managers-minds", lessonSlug: "pragmatism-and-game-management" },
    challengeQuestion: {
      question: "What does Mourinho's double pivot shield allow the attacking players to do?",
      options: [
        "Play only long balls",
        "Avoid ever pressing high",
        "Rotate positions constantly",
        "Commit forward without leaving the defense exposed",
      ],
      correctIndex: 3,
      explanation:
        "The double pivot stays anchored in front of the back four, which is exactly what frees the players ahead of them to commit forward.",
    },
  },
  {
    slug: "antonio-conte",
    name: "Antonio Conte",
    years: "Club management 2006–present",
    notableTeams: ["Juventus", "Chelsea", "Inter Milan", "Tottenham Hotspur"],
    signatureFormationSlug: "3-4-3",
    tagline: "Revived the back three as an attacking platform, not just a defensive one.",
    philosophy:
      "Builds teams around a back three that provides defensive security while wing-backs supply the width, allowing the front three to focus purely on attacking play.",
    signatureMechanics: [
      {
        id: "wing-back-pendulum",
        name: "The Wing-Back Pendulum",
        description:
          "The same player swings between two completely different jobs depending on possession: an auxiliary winger providing width high up the pitch in attack, and an auxiliary full-back tucking in behind the ball out of it.",
        formationSlug: "3-4-3",
        moving: [{ playerId: "lwb", from: { x: 8, y: 50 }, to: { x: 8, y: 25 } }],
      },
      {
        id: "front-three-interchange",
        name: "Front-Three Freedom",
        description:
          "With the back three and midfield holding defensive structure behind them, the front three are free to swap positions constantly, trusting teammates to cover whichever space they've just vacated.",
        formationSlug: "3-4-3",
        moving: [
          { playerId: "st", from: { x: 50, y: 12 }, to: { x: 35, y: 15 } },
          { playerId: "lw", from: { x: 18, y: 18 }, to: { x: 50, y: 10 } },
        ],
      },
    ],
    whyItWorked: [
      "Demands extremely high fitness levels so wing-backs can cover the full length of the touchline repeatedly",
    ],
    vulnerabilities: [
      "Wing-backs are asked to cover the full length of the touchline in both directions, and a team that attacks quickly the moment one is caught upfield can isolate the back three in behind",
    ],
    legacy:
      "His use of a back three helped revive the system's popularity in leagues where a flat back four had become the default, most notably during a title-winning season in England.",
    academyLink: { moduleSlug: "managers-minds", lessonSlug: "back-to-three-conte" },
    challengeQuestion: {
      question: "In Conte's 3-4-3, what dual role does the wing-back play?",
      options: [
        "Winger in attack, full-back out of possession",
        "Striker in attack, center-back in defense",
        "Goalkeeper cover",
        "Central midfielder always",
      ],
      correctIndex: 0,
      explanation:
        "The same wing-back provides width in attack and tucks in as auxiliary defensive cover once possession is lost.",
    },
  },
  {
    slug: "marcelo-bielsa",
    name: "Marcelo Bielsa",
    years: "Club management 1990–present",
    notableTeams: ["Athletic Bilbao", "Olympique de Marseille", "Leeds United"],
    signatureFormationSlug: "4-1-4-1",
    tagline: "Pressed every blade of grass, man for man, for the full ninety minutes.",
    philosophy:
      "Commits to man-oriented pressing across the entire pitch, asking his team to follow their designated opponent rather than simply defending a zone.",
    signatureMechanics: [
      {
        id: "man-oriented-marking",
        name: "Man-Marking Anywhere on the Pitch",
        description:
          "A defender follows their assigned opponent wherever they go, even if that means abandoning a normal defensive zone entirely. It's an attacking, high-risk commitment to winning individual duels over holding shape.",
        formationSlug: "4-1-4-1",
        moving: [{ playerId: "rb", from: { x: 85, y: 75 }, to: { x: 85, y: 25 } }],
      },
    ],
    whyItWorked: [
      "Demands relentless physical intensity, since man-marking across the full pitch requires constant running",
      "Prepares teams through extremely detailed opposition analysis so each player knows their specific defensive assignment",
    ],
    vulnerabilities: [
      "Following an assigned opponent anywhere on the pitch means a defender can be dragged completely out of position, and intelligent opposition movement can use that same discipline to open space for a different runner",
    ],
    legacy:
      "His uncompromising, high-intensity style earned him a reputation as one of the most influential coaches among his peers, with several World Cup-winning managers citing him as a direct influence.",
    academyLink: { moduleSlug: "defending", lessonSlug: "zonal-vs-man-marking" },
    challengeQuestion: {
      question: "What does Bielsa's man-marking system ask defenders to do?",
      options: [
        "Hold a fixed defensive zone only",
        "Follow their assigned opponent anywhere on the pitch",
        "Never leave their own half",
        "Mark only inside the penalty box",
      ],
      correctIndex: 1,
      explanation:
        "Bielsa's man-marking system asks a defender to follow their assigned opponent anywhere on the pitch, even out of their normal zone.",
    },
  },
  {
    slug: "mikel-arteta",
    name: "Mikel Arteta",
    years: "Club management 2019–present",
    notableTeams: ["Arsenal"],
    signatureFormationSlug: "4-3-3",
    tagline: "Built a team's identity around defensive structure married to patient possession.",
    philosophy:
      "Combines a possession-based approach with a strong emphasis on defensive rest-defense, organizing the team so that losing the ball in one area is never a direct route to goal for the opponent.",
    signatureMechanics: [
      {
        id: "inverted-full-back",
        name: "The Inverted Full-Back",
        description:
          "In possession, the left-back steps inside into central midfield instead of overlapping down the touchline, adding an extra central passing option and forming a back three with the two center-backs the moment possession is lost.",
        formationSlug: "4-3-3",
        moving: [{ playerId: "lb", from: { x: 15, y: 75 }, to: { x: 38, y: 60 } }],
      },
      {
        id: "rest-defense",
        name: "Rest-Defense",
        description:
          "While the wide forwards push on to occupy the opposition's back line, the holding midfielder drops to shield a back three behind the ball, so losing possession high up the pitch is never a clean run at an empty defense.",
        formationSlug: "4-3-3",
        moving: [
          { playerId: "cdm", from: { x: 50, y: 58 }, to: { x: 50, y: 66 } },
          { playerId: "lw", from: { x: 18, y: 18 }, to: { x: 8, y: 6 } },
          { playerId: "rw", from: { x: 82, y: 18 }, to: { x: 92, y: 6 } },
        ],
      },
      {
        id: "drilled-corner-routine",
        name: "The Drilled Corner Routine",
        description:
          "Corners are rehearsed like any other pattern of play: one runner arrives early at the near post to flick the ball on or distract a marker, and a second runner arrives late at the back post to attack the space that first run opened up.",
        formationSlug: "4-3-3",
        moving: [
          { playerId: "st", from: { x: 50, y: 30 }, to: { x: 42, y: 6 } },
          { playerId: "cm2", from: { x: 68, y: 42 }, to: { x: 60, y: 8 } },
        ],
      },
    ],
    influencedBy: [
      {
        slug: "pep-guardiola",
        note: "Served as Guardiola's assistant coach at Manchester City from 2016 to 2019 before taking his first head coaching role.",
      },
    ],
    whyItWorked: [],
    vulnerabilities: [
      "Building attacks through an inverted full-back in central midfield requires that player to be comfortable there under pressure. An opponent that presses the first central pass aggressively can stall the whole buildup",
    ],
    legacy:
      "Turned a period of relative absence from title contention into sustained top-of-the-table competitiveness, with his emphasis on defensive rest-defense and set-piece preparation widely discussed as a template by other coaches.",
    academyLink: { moduleSlug: "set-pieces", lessonSlug: "attacking-corners" },
    challengeQuestion: {
      question: "What formation does Arteta's rest-defense create when possession is lost?",
      options: ["A back five", "A flat back four", "A back three", "A diamond midfield"],
      correctIndex: 2,
      explanation:
        "The holding midfielder drops to shield a back three the instant possession is lost, part of Arteta's rest-defense structure.",
    },
  },
  {
    slug: "hansi-flick",
    name: "Hansi Flick",
    years: "Club and international management 2019–present",
    notableTeams: ["Bayern Munich", "Germany national team", "Barcelona"],
    signatureFormationSlug: "4-2-3-1",
    tagline: "Turned a mid-season managerial change into an all-conquering attacking machine.",
    philosophy:
      "Combines an aggressive high defensive line with quick, direct transitions, using intense pressing to win the ball back high up the pitch and attack before the opponent can organize.",
    signatureMechanics: [
      {
        id: "high-defensive-line",
        name: "The High Defensive Line",
        description:
          "The back four pushes up close to the halfway line rather than sitting deep, compressing the space the team has to defend and supporting the press by keeping the opponent penned in.",
        formationSlug: "4-2-3-1",
        moving: [
          { playerId: "cb1", from: { x: 35, y: 78 }, to: { x: 35, y: 55 } },
          { playerId: "cb2", from: { x: 65, y: 78 }, to: { x: 65, y: 55 } },
        ],
      },
      {
        id: "inverted-wingers-overlap",
        name: "Inverted Wingers, Overlapping Backs",
        description:
          "The wide forwards tuck inside into the half-spaces rather than hugging the touchline, trusting the full-backs to provide the actual width by overlapping into the space they've just vacated.",
        formationSlug: "4-2-3-1",
        moving: [{ playerId: "lw", from: { x: 18, y: 32 }, to: { x: 35, y: 20 } }],
      },
    ],
    whyItWorked: [
      "Encourages fast combination play through the middle rather than slow, patient buildup",
    ],
    vulnerabilities: [
      "Pushing the back line high up the pitch leaves space in behind for pace, and a forward who times a run before the line steps up can create a clean run at goal",
    ],
    legacy:
      "His Bayern Munich side won every available trophy in a single season, including the Champions League, and his methods were widely credited with reviving the club's attacking identity almost overnight.",
    academyLink: { moduleSlug: "defending", lessonSlug: "setting-the-defensive-line" },
    challengeQuestion: {
      question: "What is the main risk of Flick's high defensive line?",
      options: [
        "Too much possession",
        "Poor set-piece delivery",
        "Weak midfield pressing",
        "Space in behind for a fast forward to exploit",
      ],
      correctIndex: 3,
      explanation:
        "Pushing the back line up compresses the pitch but concedes space in behind for a forward who times a run well.",
    },
  },
  {
    slug: "luis-enrique",
    name: "Luis Enrique",
    years: "Club and international management 2013–present",
    notableTeams: ["Barcelona", "Spain national team", "Paris Saint-Germain"],
    signatureFormationSlug: "4-3-3",
    tagline: "Let a front three of once-in-a-generation talent do the improvising.",
    philosophy:
      "Builds around rapid transitions and direct combination play, trusting elite individual attackers to create in open space rather than scripting every attacking pattern.",
    signatureMechanics: [
      {
        id: "vertical-into-the-front-three",
        name: "Vertical Into the Front Three",
        description:
          "The instant possession is won, the nearest midfielder looks for a direct, vertical pass into a forward rather than resetting play through safer, sideways options.",
        formationSlug: "4-3-3",
        moving: [{ playerId: "cm1", from: { x: 32, y: 42 }, to: { x: 50, y: 20 } }],
      },
      {
        id: "front-three-interchange",
        name: "Front-Three Interchange",
        description:
          "The front three constantly swap positions rather than sticking to a fixed left/right/center: a striker can drift wide and a winger can attack the middle in the same passage of play, improvising rather than following a script.",
        formationSlug: "4-3-3",
        moving: [
          { playerId: "st", from: { x: 50, y: 12 }, to: { x: 18, y: 18 } },
          { playerId: "lw", from: { x: 18, y: 18 }, to: { x: 50, y: 12 } },
        ],
      },
    ],
    influencedBy: [
      {
        slug: "johan-cruyff",
        note: "Played under Cruyff at Barcelona in the early 1990s before later managing the same club using many of the same possession principles.",
      },
    ],
    whyItWorked: [
      "Balances attacking freedom with a disciplined, compact shape when out of possession",
    ],
    vulnerabilities: [
      "Relying on individual quality in transition rather than a scripted build-up can go quiet against a team that defends deep and patiently, denying the transitions the approach depends on",
    ],
    legacy:
      "His Barcelona side won a continental treble built around one of the most prolific forward lines in the sport's history, and his direct, transition-heavy approach has continued to shape his later work with club and international sides.",
    academyLink: { moduleSlug: "transitions", lessonSlug: "breaking-at-speed" },
    challengeQuestion: {
      question: "What does Luis Enrique's front three do constantly during play?",
      options: [
        "Swap positions rather than sticking to fixed sides",
        "Stay in strict lanes",
        "Track back exclusively",
        "Take every set piece",
      ],
      correctIndex: 0,
      explanation:
        "The front three constantly swap positions rather than sticking to fixed sides, trusting individual quality to improvise in open space.",
    },
  },
  {
    slug: "rinus-michels",
    name: "Rinus Michels",
    years: "Club and international management 1965–1994",
    notableTeams: ["Ajax", "Barcelona", "Netherlands national team"],
    signatureFormationSlug: "4-3-3",
    tagline: "Built the fluid, position-swapping style that became known as Total Football.",
    philosophy:
      "Organized his teams so every outfield player could comfortably operate in almost any position, trusting the collective shape to hold together even as individuals rotated freely across it.",
    signatureMechanics: [
      {
        id: "total-football-rotation",
        name: "Total Football Rotation",
        description:
          "A center-back can step forward into midfield, trusting a midfielder to drop back and cover the space just vacated. The shape holds together through constant, trained rotation rather than everyone staying in a fixed slot.",
        formationSlug: "4-3-3",
        moving: [
          { playerId: "cb1", from: { x: 35, y: 78 }, to: { x: 32, y: 55 } },
          { playerId: "cm1", from: { x: 32, y: 42 }, to: { x: 35, y: 75 } },
        ],
      },
      {
        id: "dragging-defenders-out-of-position",
        name: "Dragging Defenders Out of Position",
        description:
          "A forward drifts wide out of their nominal position specifically to pull a marker with them, opening central space for a teammate to run into instead.",
        formationSlug: "4-3-3",
        moving: [{ playerId: "st", from: { x: 50, y: 12 }, to: { x: 75, y: 20 } }],
      },
    ],
    whyItWorked: [
      "Prioritized pressing high to win the ball back quickly, treating defense as the first phase of attack rather than a separate task",
    ],
    vulnerabilities: [
      "Total Football's constant positional rotation depends on every outfield player being comfortable operating in multiple roles. If key rotators are missing or fatigue breaks the interchange down, gaps open that a disciplined zonal defense can exploit",
    ],
    legacy:
      "The fluid, interchangeable style built at Ajax and the Netherlands national team became known as Total Football, and its influence on positional play is still traceable through generations of coaches who studied under him or his successors.",
    academyLink: { moduleSlug: "systems", lessonSlug: "formations-are-tools" },
    challengeQuestion: {
      question: "What is the defining idea behind Michels' Total Football?",
      options: [
        "A fixed back four that never changes",
        "Any outfield player can comfortably operate in almost any position",
        "Long balls to a target striker",
        "Zonal marking only at set pieces",
      ],
      correctIndex: 1,
      explanation:
        "Total Football's defining idea is that any outfield player can comfortably operate in almost any position as the team rotates.",
    },
  },
  {
    slug: "johan-cruyff",
    name: "Johan Cruyff",
    years: "Club management 1985–1996",
    notableTeams: ["Ajax", "Barcelona"],
    signatureFormationSlug: "3-4-3",
    tagline: "Turned the Total Football principles he played under into a coaching blueprint that shaped Barcelona for decades.",
    philosophy:
      "Insisted on close control, quick combination passing, and a goalkeeper comfortable as an auxiliary outfield player, building his Barcelona side around a possession-focused back three that could patiently circulate the ball before releasing wide attackers into space.",
    signatureMechanics: [
      {
        id: "sweeper-led-buildup",
        name: "Sweeper-Led Build-Up",
        description:
          "The middle center-back steps out from the back line into midfield to start attacks personally, treating a sweeper as a passing outlet under pressure rather than someone who only clears danger long.",
        formationSlug: "3-4-3",
        moving: [{ playerId: "cb2", from: { x: 50, y: 82 }, to: { x: 50, y: 65 } }],
      },
      {
        id: "suffocatingly-high-line",
        name: "A Suffocatingly High Line",
        description:
          "The back three pushes far up the pitch, compressing the whole team into the opponent's half and denying space for anyone to build an attack through the middle.",
        formationSlug: "3-4-3",
        moving: [
          { playerId: "cb1", from: { x: 25, y: 80 }, to: { x: 25, y: 58 } },
          { playerId: "cb3", from: { x: 75, y: 80 }, to: { x: 75, y: 58 } },
        ],
      },
    ],
    influencedBy: [
      {
        slug: "rinus-michels",
        note: "Played under Michels at Ajax and the Netherlands in the early 1970s, then carried the same Total Football principles into his own coaching career.",
      },
    ],
    whyItWorked: [
      "Treated youth development and first-team tactics as a single continuous idea, so young players arrived already trained in the same principles",
    ],
    vulnerabilities: [
      "A high line built around a single deep sweeper is vulnerable to quick, direct balls in behind, particularly against forwards quick enough to beat the offside trap",
    ],
    legacy:
      "The Barcelona side he built in the late 1980s and early 1990s, and the academy principles he embedded at the club, directly shaped the possession-based identity later carried forward by Pep Guardiola and others.",
    academyLink: { moduleSlug: "defending", lessonSlug: "setting-the-defensive-line" },
    challengeQuestion: {
      question: "What role does the middle center-back play in Cruyff's build-up?",
      options: [
        "Stays permanently on the goal line",
        "Marks the opposition striker man for man",
        "Steps out as a sweeper to start attacks",
        "Takes every goal kick",
      ],
      correctIndex: 2,
      explanation:
        "The middle center-back stepping out as a sweeper turns a defender into an extra passing outlet to start attacks.",
    },
  },
  {
    slug: "alex-ferguson",
    name: "Sir Alex Ferguson",
    years: "Club management 1974–2013",
    notableTeams: ["Aberdeen", "Manchester United"],
    signatureFormationSlug: "4-4-2",
    tagline: "Built and rebuilt title-winning teams across nearly four decades without ever settling into one fixed generation of players.",
    philosophy:
      "Combined a direct, high-tempo attacking approach with a relentless focus on squad renewal, treating the willingness to rebuild a winning team as more important than loyalty to any single group of players.",
    signatureMechanics: [
      {
        id: "width-and-pace-on-the-flanks",
        name: "Width and Pace on the Flanks",
        description:
          "Both wide midfielders push high and wide rather than tucking narrow, stretching the defense across the full width of the pitch and opening a direct, fast route in behind for early crosses.",
        formationSlug: "4-4-2",
        moving: [
          { playerId: "lm", from: { x: 15, y: 45 }, to: { x: 8, y: 20 } },
          { playerId: "rm", from: { x: 85, y: 45 }, to: { x: 92, y: 20 } },
        ],
      },
    ],
    whyItWorked: [
      "Refreshed the squad continuously rather than waiting for decline to set in, extending a winning cycle across multiple distinct teams",
      "Set exceptionally high standards for competitiveness and mental resilience, particularly in matches decided late",
    ],
    vulnerabilities: [
      "Committing both wide midfielders high and wide can be exploited by a compact, disciplined side that sits narrow centrally and counters immediately into the space vacated in the middle",
    ],
    legacy:
      "Managed Manchester United for over 26 years and won domestic titles across five different decades of squad, a longevity almost unmatched anywhere in the sport.",
    academyLink: { moduleSlug: "attacking", lessonSlug: "width-and-depth" },
    challengeQuestion: {
      question: "What did Ferguson prioritize to sustain success across nearly four decades?",
      options: [
        "Playing only youth academy players",
        "A fixed back three at all times",
        "Avoiding all summer transfers",
        "Continuous squad renewal rather than loyalty to one group",
      ],
      correctIndex: 3,
      explanation:
        "Continuous squad renewal, rather than loyalty to any one group of players, is what let Ferguson sustain success across five different decades.",
    },
  },
  {
    slug: "carlo-ancelotti",
    name: "Carlo Ancelotti",
    years: "Club management 1995–present",
    notableTeams: ["AC Milan", "Chelsea", "Paris Saint-Germain", "Bayern Munich", "Real Madrid"],
    signatureFormationSlug: "4-4-2-diamond",
    tagline: "Wins with whatever system best fits the squad already in the building, not a fixed personal blueprint.",
    philosophy:
      "Prioritizes player relationships and squad harmony as much as tactical instruction, adapting formation and style to the specific players available rather than imposing one system everywhere he goes.",
    signatureMechanics: [
      {
        id: "deep-lying-playmaker-drop",
        name: "The Diamond's Deep-Lying Playmaker",
        description:
          "The base of the midfield diamond drops between the two center-backs to collect the ball under pressure, turning a back four into a back three for a moment and guaranteeing an easy central outlet to start every attack.",
        formationSlug: "4-4-2-diamond",
        moving: [{ playerId: "cdm", from: { x: 50, y: 62 }, to: { x: 50, y: 78 } }],
      },
    ],
    influencedBy: [
      {
        slug: "arrigo-sacchi",
        note: "Played as a midfielder in Sacchi's Milan side of the late 1980s, absorbing the pressing principles he later carried into his own coaching career.",
      },
    ],
    whyItWorked: [
      "Manages star personalities by giving experienced players clear roles and a degree of tactical freedom within the team structure",
      "Adjusts tactical setup club to club rather than forcing the same system onto squads with very different strengths",
    ],
    vulnerabilities: [
      "A midfield diamond concentrates numbers centrally but sacrifices natural width, leaving it exposed to a team that attacks hard down both flanks at once",
    ],
    legacy:
      "Has won the Champions League a record number of times as a manager across different clubs and footballing cultures, a body of work built on adaptability rather than a single tactical identity.",
    academyLink: { moduleSlug: "systems", lessonSlug: "diamond-vs-flat-four" },
    challengeQuestion: {
      question: "In Ancelotti's midfield diamond, who drops between the center-backs to build play?",
      options: [
        "The base of the diamond (holding midfielder)",
        "The striker",
        "A winger",
        "The goalkeeper only",
      ],
      correctIndex: 0,
      explanation:
        "The base of the diamond drops between the center-backs to collect the ball, turning the back four into a temporary back three.",
    },
  },
  {
    slug: "diego-simeone",
    name: "Diego Simeone",
    years: "Club management 2006–present",
    notableTeams: ["Atlético Madrid"],
    signatureFormationSlug: "4-4-2",
    tagline: "Built a compact, defiant identity that let Atlético Madrid compete with far wealthier rivals year after year.",
    philosophy:
      "Organizes the team around an extremely compact, disciplined defensive block that surrenders as little space as possible, trusting moments of individual quality to convert the limited chances that approach creates.",
    signatureMechanics: [
      {
        id: "the-compact-block",
        name: "The Compact Block",
        description:
          "Both strikers drop out of their advanced positions to shorten the distance to midfield, denying the opponent any room to play through the middle of a deliberately short, dense defensive block.",
        formationSlug: "4-4-2",
        moving: [
          { playerId: "st1", from: { x: 38, y: 18 }, to: { x: 38, y: 42 } },
          { playerId: "st2", from: { x: 62, y: 18 }, to: { x: 62, y: 42 } },
        ],
      },
      {
        id: "no-one-exempt-from-tracking-back",
        name: "No One Exempt From Tracking Back",
        description:
          "A wide midfielder tracks a marauding opponent full-back all the way into their own defensive third. Total defensive commitment applies to attacking players just as much as it does to defenders.",
        formationSlug: "4-4-2",
        moving: [{ playerId: "lm", from: { x: 15, y: 45 }, to: { x: 15, y: 72 } }],
      },
    ],
    whyItWorked: [
      "Builds intense collective identity and work rate as a competitive advantage against squads with greater individual talent",
    ],
    vulnerabilities: [
      "A deep, narrow block invites sustained possession, and a patient side willing to shift the ball from side to side repeatedly can eventually open a gap the compact shape can't cover in time",
    ],
    legacy:
      "Turned Atlético Madrid into consistent title contenders and Champions League finalists against far wealthier rivals, with the team's relentless defensive identity becoming closely associated with his name.",
    academyLink: { moduleSlug: "game-management", lessonSlug: "controlling-tempo-and-territory" },
    challengeQuestion: {
      question: "What do Simeone's two strikers do out of possession?",
      options: [
        "Stay high to catch the offside trap",
        "Drop out of advanced positions to shorten the block",
        "Swap with the full-backs",
        "Take set pieces",
      ],
      correctIndex: 1,
      explanation:
        "Both strikers drop out of their advanced positions to shorten the distance to midfield, keeping the block compact.",
    },
  },
  {
    slug: "zinedine-zidane",
    name: "Zinedine Zidane",
    years: "Club management 2016–present",
    notableTeams: ["Real Madrid"],
    signatureFormationSlug: "4-3-3",
    tagline: "Prioritized squad harmony and big-game composure over a fixed tactical identity.",
    philosophy:
      "Manages primarily through man-management and rotation, trusting a squad of experienced, technically excellent players to solve tactical problems on the pitch rather than dictating detailed instructions from the touchline.",
    signatureMechanics: [
      {
        id: "occasional-midfield-diamond",
        name: "The Occasional Midfield Diamond",
        description:
          "In the biggest knockout matches, the two central midfielders narrow considerably to pack a compact diamond shape around the holding midfielder, prioritizing control of the middle over the team's usual width.",
        formationSlug: "4-3-3",
        moving: [
          { playerId: "cm1", from: { x: 32, y: 42 }, to: { x: 42, y: 35 } },
          { playerId: "cm2", from: { x: 68, y: 42 }, to: { x: 58, y: 35 } },
        ],
      },
    ],
    influencedBy: [
      {
        slug: "carlo-ancelotti",
        note: "Managed Real Madrid's reserve side while Ancelotti led the first team, and was promoted to the top job in 2016 after Ancelotti's departure.",
      },
    ],
    whyItWorked: [
      "Rotated the squad heavily across midweek and weekend fixtures to keep key players fresh for the most important moments",
      "Kept the dressing room settled by managing playing time carefully across a squad full of established stars",
    ],
    vulnerabilities: [
      "Narrowing the midfield into a diamond for control sacrifices width, and a team that stretches play immediately to both touchlines can isolate the full-backs in wide areas",
    ],
    legacy:
      "Won three consecutive Champions League titles as a first-time manager, a feat no one had previously achieved, built on squad management as much as tactical detail.",
    academyLink: { moduleSlug: "game-management", lessonSlug: "substitutions-that-change-games" },
    challengeQuestion: {
      question: "What did Zidane prioritize over a fixed tactical identity?",
      options: [
        "A rigid pressing system",
        "Constant formation changes every match",
        "Squad harmony and man-management",
        "Long-ball direct football",
      ],
      correctIndex: 2,
      explanation: "Zidane prioritized squad harmony and man-management over any single fixed tactical identity.",
    },
  },
  {
    slug: "vicente-del-bosque",
    name: "Vicente del Bosque",
    years: "Club and international management 1999–2016",
    notableTeams: ["Real Madrid", "Spain national team"],
    signatureFormationSlug: "4-2-3-1",
    tagline: "Guided Spain's golden generation to hold the World Cup and two European Championships at once.",
    philosophy:
      "Built the national team's approach around patient possession and positional discipline, trusting technically gifted midfielders to control matches through passing rather than direct attacking play.",
    signatureMechanics: [
      {
        id: "central-overload-to-control-the-ball",
        name: "Central Overload to Control the Ball",
        description:
          "The double pivot narrows in alongside the attacking midfielder to form a passing triangle through the middle, overloading the center of the pitch so the team can dominate the ball rather than the opponent.",
        formationSlug: "4-2-3-1",
        moving: [
          { playerId: "cdm1", from: { x: 38, y: 58 }, to: { x: 45, y: 50 } },
          { playerId: "cdm2", from: { x: 62, y: 58 }, to: { x: 55, y: 50 } },
        ],
      },
    ],
    influencedBy: [
      {
        slug: "pep-guardiola",
        note: "Inherited a Spain national team built largely around the Barcelona core Guardiola had shaped as a club coach.",
      },
    ],
    whyItWorked: [
      "Prioritized composure in possession, often accepting long spells without a clear final pass rather than forcing risk",
      "Managed a squad drawn heavily from rival domestic clubs without letting club rivalries disrupt national team unity",
    ],
    vulnerabilities: [
      "An approach built on patient central possession can be neutralized by an opponent willing to sit deep and compact through the middle, daring the team to find a final pass rather than pressing to win the ball back",
    ],
    legacy:
      "Led Spain to the 2010 World Cup and consecutive European Championships either side of it, a run of international dominance built on patient possession football.",
    academyLink: { moduleSlug: "midfield", lessonSlug: "overloading-the-middle" },
    challengeQuestion: {
      question: "What does Del Bosque's central overload aim to control?",
      options: [
        "The wide areas only",
        "Only the defensive third",
        "Set-piece delivery",
        "The ball, by overloading the center of the pitch",
      ],
      correctIndex: 3,
      explanation:
        "The double pivot narrows in to overload the center of the pitch, aiming to control the ball rather than the opponent.",
    },
  },
  {
    slug: "louis-van-gaal",
    name: "Louis van Gaal",
    years: "Club and international management 1991–2017",
    notableTeams: ["Ajax", "Barcelona", "Bayern Munich", "Manchester United", "Netherlands national team"],
    signatureFormationSlug: "3-5-2",
    tagline: "Revived the back three at the 2014 World Cup by building a system specifically around the defenders he had available.",
    philosophy:
      "Builds tactical systems from clearly defined positional roles and detailed rules for each one, favoring a well-drilled structure that every player understands over individual improvisation.",
    signatureMechanics: [
      {
        id: "wing-backs-provide-the-only-width",
        name: "Wing-Backs Provide the Only Width",
        description:
          "With three center-backs occupying the width a back four would normally split across, a wing-back pushes all the way forward to become the team's entire source of width down that flank.",
        formationSlug: "3-5-2",
        moving: [{ playerId: "lwb", from: { x: 8, y: 55 }, to: { x: 5, y: 20 } }],
      },
    ],
    influencedBy: [
      {
        slug: "rinus-michels",
        note: "Built his coaching career at Ajax on the same Total Football foundations Michels had established there two decades earlier.",
      },
    ],
    whyItWorked: [
      "Switched the Netherlands to a back three specifically to suit the center-backs available for that tournament, prioritizing fit over convention",
      "Demanded strict adherence to positional discipline, reducing individual decision-making in favor of a rehearsed structure",
    ],
    vulnerabilities: [
      "With wing-backs providing the team's only width, pinning them back defensively removes its main attacking outlet down the flanks and can leave the team narrow and predictable in possession",
    ],
    legacy:
      "His back-three system at the 2014 World Cup, built to suit a specific squad rather than personal preference, helped renew wider interest in three-at-the-back systems across European football.",
    academyLink: { moduleSlug: "systems", lessonSlug: "choosing-a-formation-for-your-players" },
    challengeQuestion: {
      question: "Why did Van Gaal switch the Netherlands to a back three at the 2014 World Cup?",
      options: [
        "To suit the specific center-backs available for that tournament",
        "Because a back four was against the rules",
        "To copy a rival team",
        "Purely for personal preference",
      ],
      correctIndex: 0,
      explanation:
        "The switch to a back three was built specifically to suit the center-backs available for that tournament, prioritizing fit over convention.",
    },
  },
  {
    slug: "helenio-herrera",
    name: "Helenio Herrera",
    years: "Club and international management 1944–1981",
    notableTeams: ["Barcelona", "Inter Milan"],
    signatureFormationSlug: "5-3-2",
    tagline: "Refined catenaccio into a defensive system that dominated European football through disciplined organization.",
    philosophy:
      "Prioritized defensive solidity above all else, organizing the team around a heavily protected back line and springing rapid counter-attacks the moment possession was won.",
    signatureMechanics: [
      {
        id: "the-liberos-sweep",
        name: "The Libero's Sweep",
        description:
          "The extra deep defender shifts across behind the rest of the back line to cover whatever gap has opened, sweeping up danger before it ever reaches a teammate in a one-on-one situation.",
        formationSlug: "5-3-2",
        moving: [{ playerId: "cb2", from: { x: 50, y: 80 }, to: { x: 30, y: 88 } }],
      },
      {
        id: "the-rapid-counter",
        name: "The Rapid Counter",
        description:
          "The moment possession is won back, a midfielder bursts directly forward into the space in front of them rather than waiting for the team to build an attack patiently.",
        formationSlug: "5-3-2",
        moving: [{ playerId: "cm1", from: { x: 35, y: 50 }, to: { x: 35, y: 15 } }],
      },
    ],
    whyItWorked: [
      "Kept the team extremely compact and disciplined out of possession, denying space before an attack could even develop",
    ],
    vulnerabilities: [
      "A deep, defensive-first setup surrenders territory and the ball, leaving it vulnerable to being pinned in its own half for long periods by a technically superior side patient enough to keep probing rather than forcing transitions",
    ],
    legacy:
      "His Inter Milan side won consecutive European Cups in the mid-1960s, and the defensively disciplined system he refined became one of the most influential, and most debated, tactical approaches in the sport's history.",
    academyLink: { moduleSlug: "transitions", lessonSlug: "the-five-second-rule" },
    challengeQuestion: {
      question: "What does the libero (extra deep defender) do in Herrera's system?",
      options: [
        "Plays as an auxiliary striker",
        "Sweeps across to cover gaps in the back line",
        "Takes every corner",
        "Marks the opposing goalkeeper",
      ],
      correctIndex: 1,
      explanation: "The libero shifts across behind the rest of the back line to sweep up whatever gap has opened.",
    },
  },
  {
    slug: "valeriy-lobanovskyi",
    name: "Valeriy Lobanovskyi",
    years: "Club and international management 1968–2001",
    notableTeams: ["Dynamo Kyiv", "Soviet Union national team"],
    signatureFormationSlug: "4-4-2",
    tagline: "Treated football as a system to be optimized, using data and fitness science decades before either became standard practice.",
    philosophy:
      "Approached team performance as a set of measurable systems, using detailed physical testing and tactical drilling to maximize collective pressing intensity and positional interchange across the whole team.",
    signatureMechanics: [
      {
        id: "universal-rotation",
        name: "Universal Rotation",
        description:
          "A wide midfielder and a central midfielder swap zones entirely mid-move, trusting that either player is trained to comfortably do the other's job. The whole system presses and rotates as one interchangeable unit.",
        formationSlug: "4-4-2",
        moving: [
          { playerId: "lm", from: { x: 15, y: 45 }, to: { x: 38, y: 50 } },
          { playerId: "cm1", from: { x: 38, y: 50 }, to: { x: 15, y: 45 } },
        ],
      },
    ],
    whyItWorked: [
      "Used early sports-science methods to track player fitness and structure training loads long before this was common practice",
      "Emphasized total team pressing intensity as a measurable, trainable quality rather than an abstract idea",
    ],
    vulnerabilities: [
      "Universal rotation depends on extremely high fitness and tactical discipline across the whole team. An opponent who can disrupt that rhythm through physical, direct play can break the interchange down",
    ],
    legacy:
      "His Dynamo Kyiv sides dominated Soviet and European football across multiple decades, and his systematic, data-informed approach to training is widely cited as ahead of its time.",
    academyLink: { moduleSlug: "systems", lessonSlug: "formations-are-tools" },
    challengeQuestion: {
      question: "What does \"universal rotation\" mean in Lobanovskyi's system?",
      options: [
        "Only strikers rotate positions",
        "The formation never changes",
        "Players swap zones, trained to comfortably do each other's job",
        "Substitutions happen every 15 minutes",
      ],
      correctIndex: 2,
      explanation:
        "Universal rotation means players are trained to comfortably swap zones and do each other's job as the team presses and moves as one.",
    },
  },
  {
    slug: "bobby-robson",
    name: "Sir Bobby Robson",
    years: "Club and international management 1968–2004",
    notableTeams: ["Ipswich Town", "England national team", "Barcelona", "Newcastle United"],
    signatureFormationSlug: "3-5-2",
    tagline: "Reshaped England's system mid-tournament at the 1990 World Cup, switching to a back three that carried the team to the semifinals.",
    philosophy:
      "Balanced traditional English directness with a willingness to adapt tactically when a specific tournament or opponent called for it, rather than committing rigidly to one system regardless of circumstances.",
    signatureMechanics: [
      {
        id: "the-back-three-switch",
        name: "The Back-Three Switch",
        description:
          "Mid-tournament, a wing-back steps into the width a back four would normally provide, letting the team convert to a back three without needing to replace a single player.",
        formationSlug: "3-5-2",
        moving: [{ playerId: "lwb", from: { x: 8, y: 55 }, to: { x: 8, y: 25 } }],
      },
    ],
    whyItWorked: [
      "Built teams around clear individual responsibilities, keeping tactical instructions simple and easy to execute under pressure",
      "Later spells across European clubs added a more possession-aware influence to an already direct approach",
    ],
    vulnerabilities: [
      "A back three assembled to suit the personnel available rather than built up over time can lack early cohesion, giving a well-drilled possession side space to exploit before the shape beds in",
    ],
    legacy:
      "Guided England to the semifinals of the 1990 World Cup with a tactical switch to a back three still remembered as one of the tournament's defining moments, and remained a widely respected figure across English and European football.",
    academyLink: { moduleSlug: "systems", lessonSlug: "wing-backs-and-width" },
    challengeQuestion: {
      question: "What allowed Robson's England to switch to a back three mid-tournament in 1990?",
      options: [
        "Bringing on entirely new players",
        "A change in the offside rule",
        "Playing an extra goalkeeper",
        "A wing-back stepping into the width a back four would provide",
      ],
      correctIndex: 3,
      explanation:
        "A wing-back stepping into the width a back four would normally provide let England convert to a back three without changing personnel.",
    },
  },
  {
    slug: "arsene-wenger",
    name: "Arsène Wenger",
    years: "Club management 1984–2019",
    notableTeams: ["Monaco", "Nagoya Grampus Eight", "Arsenal"],
    signatureFormationSlug: "4-2-3-1",
    tagline: "Reshaped English football's approach to fitness, diet, and technical recruitment as much as its tactics.",
    philosophy:
      "Built teams around quick, technical passing combinations and pace in behind the defense, while introducing sports-science-based fitness and nutrition standards that were unusual in English football at the time.",
    signatureMechanics: [
      {
        id: "quick-combinations-in-behind",
        name: "Quick Combinations in Behind",
        description:
          "A wide forward bursts into the channel in behind the defense off a quick one-touch combination, prioritizing pace and technique over the aerial, physical directness common elsewhere in the league at the time.",
        formationSlug: "4-2-3-1",
        moving: [{ playerId: "lw", from: { x: 18, y: 32 }, to: { x: 10, y: 10 } }],
      },
    ],
    whyItWorked: [
      "Recruited technically gifted players from across Europe and South America into a league that had previously prioritized physicality",
      "Introduced modern fitness testing, injury prevention, and dietary standards well ahead of most domestic rivals",
    ],
    vulnerabilities: [
      "Prioritizing intricate, technical combination play in tight areas can be nullified by extremely physical, direct opposition that closes down space and speeds the game up before a passing combination can develop",
    ],
    legacy:
      "Managed Arsenal's only unbeaten league-winning season in the modern era and is widely credited with transforming standards of fitness, diet, and technical recruitment across English football.",
    academyLink: { moduleSlug: "attacking", lessonSlug: "overlaps-and-underlaps" },
    challengeQuestion: {
      question: "What did Wenger's wide forwards prioritize over aerial, physical directness?",
      options: [
        "Pace and technique in quick combinations",
        "Long throw-ins",
        "Physical duels in the air",
        "Defensive tracking back",
      ],
      correctIndex: 0,
      explanation:
        "Wenger's wide forwards prioritized pace and technique in quick combinations over the aerial, physical directness common elsewhere at the time.",
    },
  },
  {
    slug: "unai-emery",
    name: "Unai Emery",
    years: "Club management 2004–present",
    notableTeams: ["Valencia", "Sevilla", "Paris Saint-Germain", "Arsenal", "Villarreal", "Aston Villa"],
    signatureFormationSlug: "4-2-3-1",
    tagline: "Built a reputation as a European competition specialist through exhaustive, opponent-specific match preparation.",
    philosophy:
      "Prepares extensively for each individual opponent, adjusting shape, personnel, and defensive triggers match by match rather than relying on one fixed system applied identically every week.",
    signatureMechanics: [
      {
        id: "structured-pressing-triggers",
        name: "Structured Pressing Triggers",
        description:
          "The double pivot presses forward together as a pair on a specific, rehearsed trigger rather than individually. That trigger is the coordinated foundation every match-specific game plan gets built on top of.",
        formationSlug: "4-2-3-1",
        moving: [
          { playerId: "cdm1", from: { x: 38, y: 58 }, to: { x: 38, y: 45 } },
          { playerId: "cdm2", from: { x: 62, y: 58 }, to: { x: 62, y: 45 } },
        ],
      },
    ],
    influencedBy: [
      {
        slug: "arsene-wenger",
        note: "Took over at Arsenal directly after Wenger's 22-year tenure ended in 2018.",
      },
    ],
    whyItWorked: [
      "Studies each opponent in detail and adjusts defensive setup and pressing triggers specifically to counter their strengths",
      "Rotates personnel and structure between matches more than many peers, prioritizing tactical fit over a settled lineup",
    ],
    vulnerabilities: [
      "Building every game plan around a specific opponent can leave a team short of one settled identity to fall back on when the plan doesn't work early or against an unfamiliar opponent",
    ],
    legacy:
      "Won the Europa League a record number of times across different clubs, a body of work built on detailed, opponent-specific preparation rather than one repeated system.",
    academyLink: { moduleSlug: "midfield", lessonSlug: "pressing-triggers" },
    challengeQuestion: {
      question: "What is distinctive about Emery's approach to each match?",
      options: [
        "Using the exact same lineup every week",
        "Extensive, opponent-specific preparation rather than one fixed system",
        "Avoiding video analysis entirely",
        "Playing without a game plan",
      ],
      correctIndex: 1,
      explanation:
        "Emery adjusts shape, personnel, and defensive triggers for each specific opponent rather than relying on one fixed system.",
    },
  },
  {
    slug: "thomas-tuchel",
    name: "Thomas Tuchel",
    years: "Club and international management 2009–present",
    notableTeams: ["Mainz 05", "Borussia Dortmund", "Paris Saint-Germain", "Chelsea", "Bayern Munich", "England national team"],
    signatureFormationSlug: "3-4-3",
    tagline: "Took over an unsettled Chelsea mid-season and won the Champions League within months using a back three.",
    philosophy:
      "Builds defensive solidity around a back three with wing-backs providing width, favoring compact organization and quick transitions over sustained, patient possession.",
    signatureMechanics: [
      {
        id: "wing-backs-as-the-only-width",
        name: "Wing-Backs as the Only Width",
        description:
          "A wing-back pushes all the way forward into the final third to become the team's main source of width, while the back three behind provides the defensive security to support that commitment.",
        formationSlug: "3-4-3",
        moving: [{ playerId: "rwb", from: { x: 92, y: 50 }, to: { x: 95, y: 15 } }],
      },
      {
        id: "direct-transitions",
        name: "Direct Transitions",
        description:
          "The instant possession is regained, a central midfielder drives straight forward rather than building the attack slowly through a string of short passes.",
        formationSlug: "3-4-3",
        moving: [{ playerId: "cm1", from: { x: 38, y: 48 }, to: { x: 38, y: 15 } }],
      },
    ],
    influencedBy: [
      {
        slug: "jurgen-klopp",
        note: "Took over at Borussia Dortmund directly after Klopp's departure in 2015, inheriting a squad still built around Klopp's pressing principles.",
      },
    ],
    whyItWorked: [
      "Organized defensive shape and pressing triggers meticulously, often making significant tactical changes between matches",
    ],
    vulnerabilities: [
      "With wing-backs as the only source of width, an opponent that presses and cuts off the pass out to them can force the back three into longer balls with far less width to aim for",
    ],
    legacy:
      "Won the Champions League with Chelsea within months of taking charge mid-season, a rapid tactical turnaround built on defensive reorganization around a back three.",
    academyLink: { moduleSlug: "systems", lessonSlug: "wing-backs-and-width" },
    challengeQuestion: {
      question: "In Tuchel's 3-4-3, what provides the team's width?",
      options: ["The center-backs", "The goalkeeper", "The wing-backs", "The front three staying wide"],
      correctIndex: 2,
      explanation:
        "With a back three providing defensive security, the wing-backs push forward to become the team's main source of width.",
    },
  },
  {
    slug: "julian-nagelsmann",
    name: "Julian Nagelsmann",
    years: "Club and international management 2016–present",
    notableTeams: ["Hoffenheim", "RB Leipzig", "Bayern Munich", "Germany national team"],
    signatureFormationSlug: "4-1-4-1",
    tagline: "Became one of the youngest top-flight managers in German football history while building flexible, hybrid tactical systems.",
    philosophy:
      "Designs systems that can shift fluidly between defensive shapes, often switching between back three and back four within the same match depending on whether the team has the ball.",
    signatureMechanics: [
      {
        id: "back-four-to-back-three",
        name: "Back Four to Back Three, Mid-Match",
        description:
          "A full-back tucks inside to form a back three alongside the center-backs, while the opposite full-back pushes on to become the team's width. The same eleven players reshape depending on whether they have the ball.",
        formationSlug: "4-1-4-1",
        moving: [
          { playerId: "rb", from: { x: 85, y: 75 }, to: { x: 70, y: 80 } },
          { playerId: "lb", from: { x: 15, y: 75 }, to: { x: 8, y: 45 } },
        ],
      },
    ],
    influencedBy: [
      {
        slug: "hansi-flick",
        note: "Succeeded Flick as Bayern Munich's manager in 2021, inheriting the treble-winning squad Flick had built.",
      },
    ],
    whyItWorked: [
      "Uses detailed video analysis and data to prepare specific tactical plans for individual opponents",
      "Prioritizes intense, coordinated pressing high up the pitch, in the same pressing lineage he emerged from as a young coach",
    ],
    vulnerabilities: [
      "Shifting shape mid-match requires split-second recognition from every player, and a fast transition the instant the ball is lost can catch the team still reshaping, out of position for either structure",
    ],
    legacy:
      "Became the youngest manager in Bundesliga history at 28 years old and has continued to be closely associated with flexible, data-informed tactical systems at every subsequent club.",
    academyLink: { moduleSlug: "systems", lessonSlug: "back-four-vs-back-three" },
    challengeQuestion: {
      question: "What can Nagelsmann's team switch between within the same match?",
      options: [
        "Two different goalkeepers",
        "Playing with 10 or 12 outfield players",
        "Home and away kits",
        "A back three and a back four, depending on possession",
      ],
      correctIndex: 3,
      explanation:
        "Nagelsmann's teams can switch between a back three and a back four within the same match depending on whether they have the ball.",
    },
  },
];

export function getManager(slug: string): Manager | undefined {
  return managers.find((manager) => manager.slug === slug);
}

/** The reverse of `influencedBy`: every manager who lists `slug` as an influence, derived rather than hand-authored on both ends so a new link only ever needs to be written once. */
export function getInfluenced(slug: string): LineageLink[] {
  return managers.flatMap((manager) => {
    const link = manager.influencedBy?.find((entry) => entry.slug === slug);
    return link ? [{ slug: manager.slug, note: link.note }] : [];
  });
}
