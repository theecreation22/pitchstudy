export type Manager = {
  slug: string;
  name: string;
  years: string;
  notableTeams: string[];
  signatureFormationSlug: string;
  /** A secondary formation this manager was also well known for, shown alongside the primary one. */
  secondaryFormationSlug?: string;
  /** Short context for when/why the secondary formation appeared, e.g. "in the biggest away European nights". */
  secondaryFormationContext?: string;
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
  {
    slug: "rinus-michels",
    name: "Rinus Michels",
    years: "Club and international management 1965–1994",
    notableTeams: ["Ajax", "Barcelona", "Netherlands national team"],
    signatureFormationSlug: "4-3-3",
    tagline: "Built the fluid, position-swapping style that became known as Total Football.",
    philosophy:
      "Organized his teams so every outfield player could comfortably operate in almost any position, trusting the collective shape to hold together even as individuals rotated freely across it.",
    whyItWorked: [
      "Demanded exceptional positional intelligence, since any player might need to cover for a teammate who had drifted into a different area",
      "Used constant off-the-ball movement to drag defenders out of their preferred zones and open space elsewhere",
      "Prioritized pressing high to win the ball back quickly, treating defense as the first phase of attack rather than a separate task",
    ],
    legacy:
      "The fluid, interchangeable style built at Ajax and the Netherlands national team became known as Total Football, and its influence on positional play is still traceable through generations of coaches who studied under him or his successors.",
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
    whyItWorked: [
      "Used a sweeper-led back three to keep the team playing out from defense under pressure rather than clearing danger long",
      "Treated youth development and first-team tactics as a single continuous idea, so young players arrived already trained in the same principles",
      "Used a high defensive line and constant pressing to compress the pitch and keep play in the opponent's half",
    ],
    legacy:
      "The Barcelona side he built in the late 1980s and early 1990s, and the academy principles he embedded at the club, directly shaped the possession-based identity later carried forward by Pep Guardiola and others.",
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
    whyItWorked: [
      "Used width and pace on both flanks to stretch defenses and supply a direct route to goal",
      "Refreshed the squad continuously rather than waiting for decline to set in, extending a winning cycle across multiple distinct teams",
      "Set exceptionally high standards for competitiveness and mental resilience, particularly in matches decided late",
    ],
    legacy:
      "Managed Manchester United for over 26 years and won domestic titles across five different decades of squad, a longevity almost unmatched anywhere in the sport.",
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
    whyItWorked: [
      "Used a midfield diamond at AC Milan built around a deep-lying playmaker, prioritizing control of central areas over natural width",
      "Manages star personalities by giving experienced players clear roles and a degree of tactical freedom within the team structure",
      "Adjusts tactical setup club to club rather than forcing the same system onto squads with very different strengths",
    ],
    legacy:
      "Has won the Champions League a record number of times as a manager across different clubs and footballing cultures, a body of work built on adaptability rather than a single tactical identity.",
  },
  {
    slug: "diego-simeone",
    name: "Diego Simeone",
    years: "Club management 2006–present",
    notableTeams: ["Atlético Madrid"],
    signatureFormationSlug: "4-4-2",
    secondaryFormationSlug: "5-3-2",
    secondaryFormationContext: "in the biggest away European fixtures, dropping an extra man into defense to protect a lead",
    tagline: "Built a compact, defiant identity that let Atlético Madrid compete with far wealthier rivals year after year.",
    philosophy:
      "Organizes the team around an extremely compact, disciplined defensive block that surrenders as little space as possible, trusting moments of individual quality to convert the limited chances that approach creates.",
    whyItWorked: [
      "Keeps the distance between the defensive and attacking lines deliberately short, denying opponents space to play through the middle",
      "Demands total defensive commitment from attacking players as well as defenders, with no player exempt from tracking back",
      "Builds intense collective identity and work rate as a competitive advantage against squads with greater individual talent",
    ],
    legacy:
      "Turned Atlético Madrid into consistent title contenders and Champions League finalists against far wealthier rivals, with the team's relentless defensive identity becoming closely associated with his name.",
  },
  {
    slug: "zinedine-zidane",
    name: "Zinedine Zidane",
    years: "Club management 2016–present",
    notableTeams: ["Real Madrid"],
    signatureFormationSlug: "4-3-3",
    secondaryFormationSlug: "4-4-2-diamond",
    secondaryFormationContext: "in several of Real Madrid's biggest Champions League knockout nights",
    tagline: "Prioritized squad harmony and big-game composure over a fixed tactical identity.",
    philosophy:
      "Manages primarily through man-management and rotation, trusting a squad of experienced, technically excellent players to solve tactical problems on the pitch rather than dictating detailed instructions from the touchline.",
    whyItWorked: [
      "Rotated the squad heavily across midweek and weekend fixtures to keep key players fresh for the most important moments",
      "Packed a compact central diamond at times to prioritize control of the middle over out-and-out width",
      "Kept the dressing room settled by managing playing time carefully across a squad full of established stars",
    ],
    legacy:
      "Won three consecutive Champions League titles as a first-time manager, a feat no one had previously achieved, built on squad management as much as tactical detail.",
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
    whyItWorked: [
      "Prioritized composure in possession, often accepting long spells without a clear final pass rather than forcing risk",
      "Used technically excellent central midfielders to dominate the ball and limit the opponent's time in possession",
      "Managed a squad drawn heavily from rival domestic clubs without letting club rivalries disrupt national team unity",
    ],
    legacy:
      "Led Spain to the 2010 World Cup and consecutive European Championships either side of it, a run of international dominance built on patient possession football.",
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
    whyItWorked: [
      "Switched the Netherlands to a back three specifically to suit the center-backs available for that tournament, prioritizing fit over convention",
      "Used wing-backs to provide width while keeping extra numbers and cover in central defense",
      "Demanded strict adherence to positional discipline, reducing individual decision-making in favor of a rehearsed structure",
    ],
    legacy:
      "His back-three system at the 2014 World Cup, built to suit a specific squad rather than personal preference, helped renew wider interest in three-at-the-back systems across European football.",
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
    whyItWorked: [
      "Used an extra deep defender to sweep up behind the rest of the back line, covering any gap that appeared",
      "Kept the team extremely compact and disciplined out of possession, denying space before an attack could even develop",
      "Committed players forward quickly on the counter-attack once possession was regained, rather than building slowly",
    ],
    legacy:
      "His Inter Milan side won consecutive European Cups in the mid-1960s, and the defensively disciplined system he refined became one of the most influential — and most debated — tactical approaches in the sport's history.",
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
    whyItWorked: [
      "Used early sports-science methods to track player fitness and structure training loads long before this was common practice",
      "Trained players to be comfortable in multiple positions, allowing the team to press and rotate as a single coordinated system",
      "Emphasized total team pressing intensity as a measurable, trainable quality rather than an abstract idea",
    ],
    legacy:
      "His Dynamo Kyiv sides dominated Soviet and European football across multiple decades, and his systematic, data-informed approach to training is widely cited as ahead of its time.",
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
    whyItWorked: [
      "Switched England to a back three with wing-backs partway through the 1990 World Cup, better suiting the squad's personnel",
      "Built teams around clear individual responsibilities, keeping tactical instructions simple and easy to execute under pressure",
      "Later spells across European clubs added a more possession-aware influence to an already direct approach",
    ],
    legacy:
      "Guided England to the semifinals of the 1990 World Cup with a tactical switch to a back three still remembered as one of the tournament's defining moments, and remained a widely respected figure across English and European football.",
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
    whyItWorked: [
      "Recruited technically gifted players from across Europe and South America into a league that had previously prioritized physicality",
      "Introduced modern fitness testing, injury prevention, and dietary standards well ahead of most domestic rivals",
      "Built attacking play around quick one-touch combinations and pace on the counter-attack rather than aerial directness",
    ],
    legacy:
      "Managed Arsenal's only unbeaten league-winning season in the modern era and is widely credited with transforming standards of fitness, diet, and technical recruitment across English football.",
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
    whyItWorked: [
      "Studies each opponent in detail and adjusts defensive setup and pressing triggers specifically to counter their strengths",
      "Rotates personnel and structure between matches more than many peers, prioritizing tactical fit over a settled lineup",
      "Emphasizes defensive organization and structured pressing as the foundation each specific game plan is built on",
    ],
    legacy:
      "Won the Europa League a record number of times across different clubs, a body of work built on detailed, opponent-specific preparation rather than one repeated system.",
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
    whyItWorked: [
      "Used a back three to add defensive security while still committing wing-backs forward as the team's main source of width",
      "Prioritized quick, direct transitions once possession was regained rather than building attacks slowly through midfield",
      "Organized defensive shape and pressing triggers meticulously, often making significant tactical changes between matches",
    ],
    legacy:
      "Won the Champions League with Chelsea within months of taking charge mid-season, a rapid tactical turnaround built on defensive reorganization around a back three.",
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
    whyItWorked: [
      "Trains players to comfortably shift between formations in and out of possession rather than holding one fixed shape",
      "Uses detailed video analysis and data to prepare specific tactical plans for individual opponents",
      "Prioritizes intense, coordinated pressing high up the pitch, in the same pressing lineage he emerged from as a young coach",
    ],
    legacy:
      "Became the youngest manager in Bundesliga history at 28 years old and has continued to be closely associated with flexible, data-informed tactical systems at every subsequent club.",
  },
];

export function getManager(slug: string): Manager | undefined {
  return managers.find((manager) => manager.slug === slug);
}
