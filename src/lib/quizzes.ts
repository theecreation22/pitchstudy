export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type Quiz = {
  slug: string;
  title: string;
  tagline: string;
  questions: QuizQuestion[];
};

export const quizzes: Quiz[] = [
  {
    slug: "formations",
    title: "Formations",
    tagline: "Test what you've picked up from the pitch explorer.",
    questions: [
      {
        id: "formations-1",
        question:
          "Which formation sacrifices width for midfield control by narrowing into a diamond shape?",
        options: ["4-4-2", "4-4-2 Diamond", "4-3-3", "3-4-3"],
        correctIndex: 1,
        explanation:
          "The 4-4-2 Diamond adds an extra central midfielder by narrowing into a diamond, but that means full-backs have to provide almost all of the team's width.",
      },
      {
        id: "formations-2",
        question:
          "Which of these formations relies on wing-backs to provide a team's entire width down each flank?",
        options: ["4-4-2", "3-5-2", "4-3-3", "4-2-3-1"],
        correctIndex: 1,
        explanation:
          "In a 3-5-2, there are no natural wide midfielders or wingers: wing-backs alone cover the width in both directions.",
      },
      {
        id: "formations-3",
        question: "How many central midfielders form the triangle behind the front three in a 4-3-3?",
        options: ["1", "2", "3", "4"],
        correctIndex: 2,
        explanation:
          "A 4-3-3's midfield three is often set up as a triangle: typically one deeper player and two further forward, or vice versa.",
      },
      {
        id: "formations-4",
        question:
          "Which formation is built around a lone striker supported by three attacking midfielders?",
        options: ["4-2-3-1", "4-4-2", "3-4-3", "4-1-4-1"],
        correctIndex: 0,
        explanation:
          "The '3' in 4-2-3-1 sits just behind a single central striker, creating a front four that funnels support into one focal point.",
      },
      {
        id: "formations-5",
        question: "What's the main defensive risk of a 3-4-3?",
        options: [
          "Too many central midfielders",
          "Wing-backs exposed if the front three doesn't track back",
          "The lone striker gets isolated",
          "No aerial threat at set pieces",
        ],
        correctIndex: 1,
        explanation:
          "With only two central midfielders and an advanced front three, the wing-backs can be left exposed if the front three doesn't help track back.",
      },
      {
        id: "formations-6",
        question:
          "Which formation uses a single holding midfielder to shield the back four while four players hold a flat line ahead of them?",
        options: ["4-1-4-1", "4-4-2", "4-2-3-1", "3-5-2"],
        correctIndex: 0,
        explanation:
          "4-1-4-1 places one dedicated defensive midfielder in front of the back four, with a flat four ahead providing width and central presence.",
      },
      {
        id: "formations-7",
        question:
          "A back five where the wing-backs act as auxiliary defenders rather than attacking outlets describes which formation?",
        options: ["3-5-2", "5-3-2", "3-4-3", "4-4-2 Diamond"],
        correctIndex: 1,
        explanation:
          "5-3-2 is the more conservative sibling of the 3-5-2: the wing-backs sit deeper, prioritizing defensive solidity over attacking width.",
      },
      {
        id: "formations-8",
        question:
          "Which formation is most associated with two strikers supporting each other up top and two flat banks of four behind them?",
        options: ["4-3-3", "4-4-2", "4-2-3-1", "3-4-3"],
        correctIndex: 1,
        explanation:
          "The classic 4-4-2 pairs two strikers together with two flat lines of four, simple to organize and even across the width of the pitch.",
      },
    ],
  },
  {
    slug: "positions",
    title: "Positions",
    tagline: "See how well you know what each role actually does.",
    questions: [
      {
        id: "positions-1",
        question:
          "Which position is most responsible for screening the back four and winning the ball back before an attack develops?",
        options: ["Attacking Midfielder", "Defensive Midfielder", "Striker", "Left Winger"],
        correctIndex: 1,
        explanation:
          "The defensive midfielder screens the back four, cutting off passing lanes and breaking up attacks before they reach the defense.",
      },
      {
        id: "positions-2",
        question:
          "Which position is expected to win aerial and ground duels against opposing forwards while also starting attacks from the back?",
        options: ["Center-Back", "Defensive Midfielder", "Left-Back", "Goalkeeper"],
        correctIndex: 0,
        explanation:
          "The center-back's job blends old-school dueling with a modern responsibility: playing the first pass out of defense.",
      },
      {
        id: "positions-3",
        question:
          "Which position provides width alone down one flank in formations without a winger, like the 3-5-2?",
        options: ["Left-Back", "Left Midfielder", "Left Wing-Back", "Left Winger"],
        correctIndex: 2,
        explanation:
          "The left wing-back covers the entire touchline alone in back-three systems, since there's no winger ahead of them to share the wide duties.",
      },
      {
        id: "positions-4",
        question:
          "Which position typically operates in the pocket between the opposition's midfield and defensive lines?",
        options: ["Defensive Midfielder", "Attacking Midfielder", "Center-Back", "Striker"],
        correctIndex: 1,
        explanation:
          "The attacking midfielder looks to find space in exactly that pocket, searching for the pass or run that unlocks a settled defense.",
      },
      {
        id: "positions-5",
        question:
          "Which position is judged above all on the ability to finish chances the rest of the team creates?",
        options: ["Attacking Midfielder", "Central Midfielder", "Striker", "Defensive Midfielder"],
        correctIndex: 2,
        explanation:
          "However well a striker holds up play or makes intelligent runs, the role is ultimately judged on finishing.",
      },
      {
        id: "positions-6",
        question:
          "Which hybrid role describes a striker who drops deep into midfield to drag defenders out of position?",
        options: ["Sweeper-Keeper", "False 9", "Box-to-Box Midfielder", "Deep-Lying Playmaker"],
        correctIndex: 1,
        explanation:
          "A false 9 drops off the front line into midfield, pulling a center-back out of position and creating space for a teammate's run.",
      },
      {
        id: "positions-7",
        question:
          "A goalkeeper who plays far off their line and acts as an auxiliary defender behind a high back line is known as what?",
        options: ["Libero", "Sweeper-Keeper", "Deep-Lying Playmaker", "Inverted Full-Back"],
        correctIndex: 1,
        explanation:
          "The sweeper-keeper trades some shot-stopping caution for the ability to sweep up through-balls well outside the box.",
      },
      {
        id: "positions-8",
        question:
          "Which position is defined by covering the full length of the pitch, contributing fully to both attacking and defensive phases?",
        options: ["Defensive Midfielder", "Attacking Midfielder", "Box-to-Box Midfielder", "Winger"],
        correctIndex: 2,
        explanation:
          "A box-to-box midfielder is asked to do a bit of everything: defending in their own box one moment, arriving in the opposition's the next.",
      },
    ],
  },
  {
    slug: "managers",
    title: "Managers",
    tagline: "Match each tactical idea back to the manager behind it.",
    questions: [
      {
        id: "managers-1",
        question:
          "Which manager is most associated with popularizing zonal-marking, high-pressing football at AC Milan in the late 1980s?",
        options: ["Pep Guardiola", "Arrigo Sacchi", "José Mourinho", "Marcelo Bielsa"],
        correctIndex: 1,
        explanation:
          "Arrigo Sacchi's Milan built a compact, zonal defensive block that pressed as a unit, at a time when man-marking sweeper systems were the norm in Italy.",
      },
      {
        id: "managers-2",
        question: "Which manager's approach is most associated with the term \"gegenpressing\"?",
        options: ["Jürgen Klopp", "Antonio Conte", "Hansi Flick", "Luis Enrique"],
        correctIndex: 0,
        explanation:
          "Jürgen Klopp's teams are known for winning the ball back within seconds of losing it, a style widely described using the German term \"gegenpressing.\"",
      },
      {
        id: "managers-3",
        question:
          "Which manager is known for building teams around a back three with wing-backs supplying the width?",
        options: ["José Mourinho", "Antonio Conte", "Mikel Arteta", "Pep Guardiola"],
        correctIndex: 1,
        explanation:
          "Antonio Conte's sides consistently use a back three that provides defensive security while wing-backs supply the width.",
      },
      {
        id: "managers-4",
        question:
          "Which manager's Bayern Munich side won every available trophy in a single season, including the Champions League?",
        options: ["Hansi Flick", "Pep Guardiola", "Jürgen Klopp", "Luis Enrique"],
        correctIndex: 0,
        explanation:
          "Hansi Flick took over Bayern mid-season and led them to a historic clean sweep of every available trophy.",
      },
      {
        id: "managers-5",
        question:
          "Which manager prioritizes defensive organization and game management above all else, built around a compact double pivot?",
        options: ["José Mourinho", "Marcelo Bielsa", "Antonio Conte", "Arrigo Sacchi"],
        correctIndex: 0,
        explanation:
          "José Mourinho's teams stay compact and disciplined before striking on the counter-attack, prioritizing results over a fixed attacking style.",
      },
      {
        id: "managers-6",
        question:
          "Which manager is known for man-oriented pressing across the entire pitch, asking players to follow their designated opponent rather than defend a zone?",
        options: ["Marcelo Bielsa", "Pep Guardiola", "Mikel Arteta", "Hansi Flick"],
        correctIndex: 0,
        explanation:
          "Marcelo Bielsa commits his teams to man-marking across the full pitch, demanding relentless physical intensity from every player.",
      },
      {
        id: "managers-7",
        question:
          "Which manager's Barcelona side won a continental treble built around one of the most prolific forward lines in the sport's history?",
        options: ["Pep Guardiola", "Luis Enrique", "Antonio Conte", "José Mourinho"],
        correctIndex: 1,
        explanation:
          "Luis Enrique's Barcelona side won a treble trusting elite individual attackers to create in open space through rapid transitions.",
      },
      {
        id: "managers-8",
        question:
          "Which manager built a team's identity around defensive rest-defense and heavily-drilled set-piece routines?",
        options: ["Mikel Arteta", "Antonio Conte", "José Mourinho", "Pep Guardiola"],
        correctIndex: 0,
        explanation:
          "Mikel Arteta organizes his team so losing the ball in one area is never a direct route to goal, while treating set pieces as a deliberate source of goals.",
      },
    ],
  },
];

export function getQuiz(slug: string): Quiz | undefined {
  return quizzes.find((quiz) => quiz.slug === slug);
}
