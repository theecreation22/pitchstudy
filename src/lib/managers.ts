export type Manager = {
  slug: string;
  name: string;
  years: string;
  notableTeams: string[];
  signatureFormationSlug: string;
  tagline: string;
  philosophy: string;
  whyItWorked: string[];
  legacy: string;
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
      "Built his teams around a compact, zonal defensive block that moved as a single unit — pressing high up the pitch to win the ball back within seconds rather than retreating to defend a lead.",
    whyItWorked: [
      "Insisted on constant collective movement, so the team's shape stayed compact regardless of where the ball was",
      "Prioritized coordinated pressing triggers over man-marking individual opponents",
      "Treated organization and rehearsed patterns of play as more valuable than individual improvisation",
    ],
    legacy:
      "Widely credited with popularizing zonal-marking, high-pressing football in Italy at a time when man-marking sweeper systems were the norm, influencing a generation of European coaches who came after him.",
  },
  {
    slug: "pep-guardiola",
    name: "Pep Guardiola",
    years: "Club management 2008–present",
    notableTeams: ["Barcelona", "Bayern Munich", "Manchester City"],
    signatureFormationSlug: "4-3-3",
    tagline: "Turned possession itself into the primary attacking weapon.",
    philosophy:
      "Builds teams around dominating possession and manipulating space — using precise positioning to consistently create passing lanes and outnumber the opposition around the ball.",
    whyItWorked: [
      "Emphasizes exact positional discipline so teammates are always reachable by a pass, even under pressure",
      "Uses full-backs who tuck into central midfield in possession to overload the middle of the pitch",
      "Builds attacks patiently from the goalkeeper rather than bypassing midfield with long passes",
    ],
    legacy:
      "His teams' approach to possession and positional play became one of the most widely studied and imitated tactical templates in modern football.",
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
    whyItWorked: [
      "Organizes the front line to press in coordinated angles rather than chasing the ball individually",
      "Prioritizes fast vertical transitions once the ball is regained, attacking before the opponent can reset",
      "Demands extremely high work rate and fitness, treating pressing intensity as a team-wide responsibility",
    ],
    legacy:
      "His pressing approach, often described using the German term \"gegenpressing,\" brought a specific defensive-to-attacking transition style into the mainstream tactical vocabulary.",
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
    whyItWorked: [
      "Uses a double pivot in midfield to keep the team defensively solid before committing players forward",
      "Adjusts his approach match by match based on the specific threat the opponent poses, rather than a fixed style",
      "Treats winning key moments and matches as the priority over any particular attacking philosophy",
    ],
    legacy:
      "His pragmatic, results-first approach won domestic titles and continental trophies across four different countries, making him one of the most decorated coaches of his generation.",
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
    whyItWorked: [
      "Uses wing-backs who function as auxiliary wingers in possession and auxiliary full-backs out of it",
      "Demands extremely high fitness levels so wing-backs can cover the full length of the touchline repeatedly",
      "Keeps the front three's attacking roles flexible while the back three and midfield provide defensive structure",
    ],
    legacy:
      "His use of a back three helped revive the system's popularity in leagues where a flat back four had become the default, most notably during a title-winning season in England.",
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
    whyItWorked: [
      "Demands relentless physical intensity, since man-marking across the full pitch requires constant running",
      "Prepares teams through extremely detailed opposition analysis so each player knows their specific defensive assignment",
      "Prioritizes an attacking, high-risk approach even against stronger opponents rather than sitting back",
    ],
    legacy:
      "His uncompromising, high-intensity style earned him a reputation as one of the most influential coaches among his peers, with several World Cup-winning managers citing him as a direct influence.",
  },
  {
    slug: "mikel-arteta",
    name: "Mikel Arteta",
    years: "Club management 2019–present",
    notableTeams: ["Arsenal"],
    signatureFormationSlug: "4-3-3",
    tagline: "Built a team's identity around defensive structure married to patient possession.",
    philosophy:
      "Combines a possession-based approach with a strong emphasis on defensive rest-defense — organizing the team so that losing the ball in one area is never a direct route to goal for the opponent.",
    whyItWorked: [
      "Uses an inverted full-back who tucks into midfield in possession, forming an extra central passing option and a back three for defensive cover",
      "Sets specific rules for where players must be positioned when possession is lost, prioritizing defensive safety over further attacking risk",
      "Treats set-piece routines as a deliberate, heavily-drilled source of goals rather than an afterthought",
    ],
    legacy:
      "Turned a period of relative absence from title contention into sustained top-of-the-table competitiveness, with his emphasis on defensive rest-defense and set-piece preparation widely discussed as a template by other coaches.",
  },
  {
    slug: "hansi-flick",
    name: "Hansi Flick",
    years: "Club and international management 2019–present",
    notableTeams: ["Bayern Munich", "Germany national team", "Barcelona"],
    signatureFormationSlug: "4-2-3-1",
    tagline: "Turned a mid-season managerial change into an all-conquering attacking machine.",
    philosophy:
      "Combines an aggressive high defensive line with quick, direct transitions — using intense pressing to win the ball back high up the pitch and attack before the opponent can organize.",
    whyItWorked: [
      "Pushes the back line up close to the halfway line to compress space and support the press",
      "Encourages fast combination play through the middle rather than slow, patient buildup",
      "Uses full-backs who provide constant width so inverted wingers can attack the half-spaces",
    ],
    legacy:
      "His Bayern Munich side won every available trophy in a single season, including the Champions League, and his methods were widely credited with reviving the club's attacking identity almost overnight.",
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
    whyItWorked: [
      "Prioritizes quick vertical passes into forwards the moment possession is won, rather than resetting play",
      "Gives his most creative attackers freedom to interchange positions and improvise in the final third",
      "Balances attacking freedom with a disciplined, compact shape when out of possession",
    ],
    legacy:
      "His Barcelona side won a continental treble built around one of the most prolific forward lines in the sport's history, and his direct, transition-heavy approach has continued to shape his later work with club and international sides.",
  },
];

export function getManager(slug: string): Manager | undefined {
  return managers.find((manager) => manager.slug === slug);
}
