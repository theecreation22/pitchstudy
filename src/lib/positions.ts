import type { PositionCode } from "./formations";

export type Zone = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type RelatedPosition = {
  code: PositionCode;
  note: string;
};

export type PositionInfo = {
  code: PositionCode;
  name: string;
  summary: string;
  inPossession: string;
  outOfPossession: string;
  strongSuits: string[];
  howToPlay: string[];
  commonMistakes: string[];
  zones: Zone[];
  related: RelatedPosition[];
  /** Tactical variation on a base position (PRD 5.2) rather than a formation slot in its own right. */
  isHybrid?: boolean;
};

export const positions: Record<PositionCode, PositionInfo> = {
  GK: {
    code: "GK",
    name: "Goalkeeper",
    summary:
      "The last line of defense and, increasingly, the first line of attack. Commands the box on crosses, organizes the back line, and starts moves with distribution under pressure.",
    inPossession:
      "Starts attacks with quick, accurate distribution — a short pass to a center-back or a longer ball to bypass the first press, chosen based on how the opposition is set up.",
    outOfPossession:
      "Organizes the last line, commands the box on crosses and set pieces, and covers the space in behind a high defensive line by sweeping up through balls.",
    strongSuits: [
      "Shot-stopping reflexes",
      "Command of the box",
      "Distribution under pressure",
      "Communication",
    ],
    howToPlay: [
      "Set your starting position based on the ball's angle, not just the center of the goal",
      "Communicate defensive assignments early, before a cross or shot is even likely",
      "Commit fully to any decision to come off your line — hesitation is what gets punished",
      "Vary distribution length and speed based on how aggressively the opposition presses",
    ],
    commonMistakes: [
      "Ball-watching instead of tracking the runners a cross is aimed at",
      "Committing to a save early and getting caught out by a late deflection",
      "Distributing to the nearest option under pressure instead of the best one",
    ],
    zones: [{ x: 30, y: 85, width: 40, height: 15 }],
    related: [
      {
        code: "SK",
        note: "A modern variation that plays far off the line and functions as an auxiliary defender behind a high back line.",
      },
    ],
  },
  LB: {
    code: "LB",
    name: "Left-Back",
    summary:
      "Defends the left channel one-on-one and overlaps into attack down the same side, balancing defensive discipline with the stamina to get up and down the full length of the pitch.",
    inPossession:
      "Provides width down the left, overlapping or underlapping the winger ahead of them to create passing lanes and crossing opportunities.",
    outOfPossession:
      "Tracks the opposition's right winger one-on-one and tucks infield to support the back line when the ball is on the far side.",
    strongSuits: [
      "Recovery pace",
      "One-on-one defending",
      "Crossing under pressure",
      "Stamina",
    ],
    howToPlay: [
      "Time overlapping runs so you arrive as an option, not before the ball is ready",
      "Tuck inside when play is on the opposite flank to keep the defensive line compact",
      "Show wide players onto their weaker foot rather than inviting a cut inside",
      "Recognize when to hold back for defensive cover versus when it's safe to join the attack",
    ],
    commonMistakes: [
      "Getting caught upfield after an attack breaks down, leaving space in behind",
      "Diving into tackles instead of jockeying wide players toward the touchline",
      "Standing too narrow and leaving the winger in front isolated out wide",
    ],
    zones: [{ x: 0, y: 55, width: 30, height: 35 }],
    related: [
      {
        code: "LWB",
        note: "In back-three systems the same player often becomes a left wing-back, covering more ground with less central cover.",
      },
      {
        code: "IFB",
        note: "A modern variation that steps into central midfield in possession instead of overlapping down the wing.",
      },
    ],
  },
  RB: {
    code: "RB",
    name: "Right-Back",
    summary:
      "The mirror of the left-back on the right flank — tracks opposing wingers, tucks in centrally when the ball is far away, and supports attacks by overlapping or underlapping.",
    inPossession:
      "Provides width down the right, overlapping or underlapping the winger ahead of them to create passing lanes and crossing opportunities.",
    outOfPossession:
      "Tracks the opposition's left winger one-on-one and tucks infield to support the back line when the ball is on the far side.",
    strongSuits: [
      "Recovery pace",
      "One-on-one defending",
      "Crossing under pressure",
      "Stamina",
    ],
    howToPlay: [
      "Time overlapping runs so you arrive as an option, not before the ball is ready",
      "Tuck inside when play is on the opposite flank to keep the defensive line compact",
      "Show wide players onto their weaker foot rather than inviting a cut inside",
      "Recognize when to hold back for defensive cover versus when it's safe to join the attack",
    ],
    commonMistakes: [
      "Getting caught upfield after an attack breaks down, leaving space in behind",
      "Diving into tackles instead of jockeying wide players toward the touchline",
      "Standing too narrow and leaving the winger in front isolated out wide",
    ],
    zones: [{ x: 70, y: 55, width: 30, height: 35 }],
    related: [
      {
        code: "RWB",
        note: "In back-three systems the same player often becomes a right wing-back, covering more ground with less central cover.",
      },
      {
        code: "IFB",
        note: "A modern variation that steps into central midfield in possession instead of overlapping down the wing.",
      },
    ],
  },
  CB: {
    code: "CB",
    name: "Center-Back",
    summary:
      "Wins aerial and ground duels against the opposition's forwards, reads danger before it develops, and is trusted with the ball to start attacks from the back.",
    inPossession:
      "Plays the first pass out of defense, either short to build through midfield or long to bypass the opposition's press.",
    outOfPossession:
      "Wins individual duels against forwards in the air and on the ground, and steps out to close down attackers before they can turn and face goal.",
    strongSuits: [
      "Aerial ability",
      "Positioning and anticipation",
      "Composure on the ball",
      "Recovery speed against pace",
    ],
    howToPlay: [
      "Hold the defensive line together — dropping off alone invites forwards to play in behind",
      "Step out to press only when a teammate is covering the space vacated",
      "Scan before receiving the ball so the first touch can go forward, not just sideways",
      "Communicate with the goalkeeper and full-backs to shift the line as a unit",
    ],
    commonMistakes: [
      "Ball-watching and losing track of a forward's run in behind",
      "Stepping out of the line without a covering teammate",
      "Panicked clearances when a simple pass out was on",
    ],
    zones: [{ x: 15, y: 68, width: 70, height: 24 }],
    related: [
      {
        code: "CDM",
        note: "A ball-playing center-back can step into midfield in possession, blurring the line with a deep-lying defensive midfielder.",
      },
    ],
  },
  LWB: {
    code: "LWB",
    name: "Left Wing-Back",
    summary:
      "Combines a full-back's defensive duty with a winger's attacking range — provides the width alone down the left in systems without a winger, covering the entire touchline in both directions.",
    inPossession:
      "Provides the entire width of the pitch alone, pushing on almost like a winger while the back three holds its shape centrally.",
    outOfPossession:
      "Drops into a back five, tucking in alongside the center-backs to defend crosses and cover the wide channel.",
    strongSuits: [
      "Exceptional stamina",
      "Crossing and delivery",
      "Recovery pace",
      "Judgment on when to commit forward",
    ],
    howToPlay: [
      "Recognize the moment to sprint back into the back line once possession is lost",
      "Provide width high up the pitch in possession since there's no winger ahead of you",
      "Combine with the nearest central midfielder to create two-on-one situations wide",
      "Don't gamble going forward when the center-backs are already stretched",
    ],
    commonMistakes: [
      "Getting caught too far upfield when possession turns over",
      "Neglecting defensive shape by treating the role as a purely attacking one",
      "Running the same wide lane as a winger ahead, congesting the flank",
    ],
    zones: [{ x: 0, y: 35, width: 30, height: 55 }],
    related: [
      {
        code: "LB",
        note: "Reverts to a conventional left-back role defensively when the team drops into a back four out of possession.",
      },
      {
        code: "LM",
        note: "Provides similar width to a left midfielder, but starts from a deeper position.",
      },
    ],
  },
  RWB: {
    code: "RWB",
    name: "Right Wing-Back",
    summary:
      "The mirror of the left wing-back on the right flank — the sole provider of width down that side, expected to defend the channel and support the attack in equal measure.",
    inPossession:
      "Provides the entire width of the pitch alone, pushing on almost like a winger while the back three holds its shape centrally.",
    outOfPossession:
      "Drops into a back five, tucking in alongside the center-backs to defend crosses and cover the wide channel.",
    strongSuits: [
      "Exceptional stamina",
      "Crossing and delivery",
      "Recovery pace",
      "Judgment on when to commit forward",
    ],
    howToPlay: [
      "Recognize the moment to sprint back into the back line once possession is lost",
      "Provide width high up the pitch in possession since there's no winger ahead of you",
      "Combine with the nearest central midfielder to create two-on-one situations wide",
      "Don't gamble going forward when the center-backs are already stretched",
    ],
    commonMistakes: [
      "Getting caught too far upfield when possession turns over",
      "Neglecting defensive shape by treating the role as a purely attacking one",
      "Running the same wide lane as a winger ahead, congesting the flank",
    ],
    zones: [{ x: 70, y: 35, width: 30, height: 55 }],
    related: [
      {
        code: "RB",
        note: "Reverts to a conventional right-back role defensively when the team drops into a back four out of possession.",
      },
      {
        code: "RM",
        note: "Provides similar width to a right midfielder, but starts from a deeper position.",
      },
    ],
  },
  CDM: {
    code: "CDM",
    name: "Defensive Midfielder",
    summary:
      "Screens the back four, breaks up opposition attacks before they start, and recycles possession simply so more creative teammates further forward can do their work.",
    inPossession:
      "Recycles possession simply and safely, often splitting the center-backs or dropping short to keep the ball moving under pressure.",
    outOfPossession:
      "Screens the back four by cutting off passing lanes into the opposition's most dangerous attacker and winning the ball back early.",
    strongSuits: [
      "Positional discipline",
      "Reading the game",
      "Tackling and interceptions",
      "Secure passing under pressure",
    ],
    howToPlay: [
      "Stay goal-side of the opponent you're screening rather than chasing the ball",
      "Break up attacks before they reach the back four, not after",
      "Keep passes simple under pressure — the priority is retaining the ball, not creating",
      "Scan constantly to spot the next passing lane the opposition wants to use",
    ],
    commonMistakes: [
      "Getting drawn out of position chasing the ball across the pitch",
      "Attempting an ambitious pass in a dangerous area instead of the safe option",
      "Failing to track a late runner arriving from midfield",
    ],
    zones: [{ x: 25, y: 45, width: 50, height: 20 }],
    related: [
      {
        code: "CB",
        note: "Can drop between the center-backs to help build play from deep, a common rotation in possession-based systems.",
      },
      {
        code: "CM",
        note: "Becomes the more advanced version of this role once another midfielder covers the defensive duties.",
      },
      {
        code: "DLP",
        note: "A more progressive variation that drops deep to dictate attacks personally, rather than purely screening the defense.",
      },
    ],
  },
  CM: {
    code: "CM",
    name: "Central Midfielder",
    summary:
      "The engine of the team — covers box to box, links defense to attack, and balances contributing to both phases of play depending on the moment in the game.",
    inPossession:
      "Links defense to attack, moving the ball forward through midfield and supporting both the build-up and the final pass.",
    outOfPossession:
      "Covers ground box-to-box, closing down opposition midfielders and tracking runners beyond the defensive midfielder's zone.",
    strongSuits: [
      "Work rate",
      "Passing range",
      "Tactical awareness in both boxes",
      "Balance between defense and attack",
    ],
    howToPlay: [
      "Judge each moment on its merits — know when to join the attack and when to hold your position",
      "Support the player on the ball with a passing option, not just physical proximity",
      "Arrive late into the box on occasion rather than always staying deep",
      "Track back immediately the moment possession is lost",
    ],
    commonMistakes: [
      "Ball-watching instead of finding space to receive the next pass",
      "Joining every attack and leaving the defensive midfielder without central support",
      "Slowing play down with an unnecessary touch instead of playing first-time",
    ],
    zones: [{ x: 20, y: 30, width: 60, height: 30 }],
    related: [
      {
        code: "CDM",
        note: "Sits deeper and prioritizes defensive duty when paired with a more attack-minded central midfielder.",
      },
      {
        code: "CAM",
        note: "Pushes higher and prioritizes creativity when the team needs an extra attacking presence.",
      },
      {
        code: "B2B",
        note: "The purest expression of this role — leaning further toward covering the full length of the pitch every match.",
      },
    ],
  },
  CAM: {
    code: "CAM",
    name: "Attacking Midfielder",
    summary:
      "Operates in the pocket between the opposition's midfield and defense, looking for the pass or the run that unlocks a settled defensive shape.",
    inPossession:
      "Operates in the pocket between the opposition's midfield and defense, looking for the pass or run that unlocks a settled defense.",
    outOfPossession:
      "Leads the press from the front, cutting off the opposition's easiest passing lane out of their own half.",
    strongSuits: [
      "Vision and creativity",
      "Close control in tight spaces",
      "Composure in the final third",
      "Timing of late runs",
    ],
    howToPlay: [
      "Find the pockets of space between the opposition's midfield and defensive lines",
      "Disguise passes and body shape to buy an extra half-second on the ball",
      "Vary between dropping deep to help build play and staying high to be the outlet",
      "Lead the press by cutting off the opponent's first passing option",
    ],
    commonMistakes: [
      "Drifting too wide and losing the central influence the role is built on",
      "Forcing a killer pass instead of recycling possession when it isn't on",
      "Neglecting defensive work early in transition, leaving the team a man light",
    ],
    zones: [{ x: 25, y: 15, width: 50, height: 20 }],
    related: [
      {
        code: "CM",
        note: "Drops deeper to help retain possession when the team doesn't have the ball in the final third.",
      },
      {
        code: "F9",
        note: "A striker dropping into this same pocket of space is exactly the false 9 idea, arriving there by movement rather than starting deep.",
      },
    ],
  },
  LM: {
    code: "LM",
    name: "Left Midfielder",
    summary:
      "Patrols the left side of a flat midfield four, tracking back to help the left-back defensively and providing width in possession.",
    inPossession:
      "Holds the width of a flat midfield four, combining with the left-back to overload the flank or cutting inside to join central play.",
    outOfPossession:
      "Tracks back to form a compact bank of four, doubling up with the left-back against the opposition's winger or wing-back.",
    strongSuits: [
      "Two-way stamina",
      "Crossing ability",
      "Discipline to track back",
      "Comfort in one-on-one situations",
    ],
    howToPlay: [
      "Hold your position in the line rather than wandering centrally out of possession",
      "Overlap or interchange with the left-back to create a numbers-up situation wide",
      "Track the opposition's wide threat all the way back, not just to the halfway line",
      "Look to switch play when the opposite flank is more open",
    ],
    commonMistakes: [
      "Drifting inside so often that the team loses its width entirely",
      "Ball-watching in transition and getting caught upfield",
      "Duplicating the full-back's overlapping run instead of staying to combine",
    ],
    zones: [{ x: 0, y: 30, width: 35, height: 30 }],
    related: [
      {
        code: "LW",
        note: "Pushes higher and wider in possession-heavy systems, trading some defensive duty for a more advanced starting position.",
      },
      {
        code: "LWB",
        note: "A deeper, more defensively-oriented version of the same wide role.",
      },
    ],
  },
  RM: {
    code: "RM",
    name: "Right Midfielder",
    summary:
      "The mirror of the left midfielder — holds the right side of a flat midfield four, balancing defensive tracking with attacking width.",
    inPossession:
      "Holds the width of a flat midfield four, combining with the right-back to overload the flank or cutting inside to join central play.",
    outOfPossession:
      "Tracks back to form a compact bank of four, doubling up with the right-back against the opposition's winger or wing-back.",
    strongSuits: [
      "Two-way stamina",
      "Crossing ability",
      "Discipline to track back",
      "Comfort in one-on-one situations",
    ],
    howToPlay: [
      "Hold your position in the line rather than wandering centrally out of possession",
      "Overlap or interchange with the right-back to create a numbers-up situation wide",
      "Track the opposition's wide threat all the way back, not just to the halfway line",
      "Look to switch play when the opposite flank is more open",
    ],
    commonMistakes: [
      "Drifting inside so often that the team loses its width entirely",
      "Ball-watching in transition and getting caught upfield",
      "Duplicating the full-back's overlapping run instead of staying to combine",
    ],
    zones: [{ x: 65, y: 30, width: 35, height: 30 }],
    related: [
      {
        code: "RW",
        note: "Pushes higher and wider in possession-heavy systems, trading some defensive duty for a more advanced starting position.",
      },
      {
        code: "RWB",
        note: "A deeper, more defensively-oriented version of the same wide role.",
      },
    ],
  },
  LW: {
    code: "LW",
    name: "Left Winger",
    summary:
      "Stays high and wide on the left before cutting inside or driving at the full-back, stretching the defense and creating or finishing chances.",
    inPossession:
      "Stays high and wide before cutting inside or driving at the full-back, stretching the defense and creating or finishing chances.",
    outOfPossession:
      "Starts the press on the opposition's full-back and tracks back enough to prevent the wide area from being overloaded.",
    strongSuits: [
      "Take-on ability",
      "Pace in behind",
      "End product",
      "Comfort operating in isolation",
    ],
    howToPlay: [
      "Stay high and wide to stretch the defense before deciding when to attack the space",
      "Attack the full-back's weaker side to open up the cut-inside or the byline run",
      "Time runs in behind to stay onside against a high defensive line",
      "Track back enough to stop the opposition overloading your flank, even without full defensive duty",
    ],
    commonMistakes: [
      "Drifting too far infield too early and taking away the team's width",
      "Forcing the same move every time instead of reading which side is open",
      "Doing too little defensive work and leaving the full-back exposed two-on-one",
    ],
    zones: [{ x: 0, y: 8, width: 35, height: 27 }],
    related: [
      {
        code: "LM",
        note: "Drops into a flatter midfield line defensively when the team sets up in a back-to-four-at-the-back shape.",
      },
      {
        code: "ST",
        note: "Can tuck inside to play as an auxiliary striker in narrower attacking systems.",
      },
    ],
  },
  RW: {
    code: "RW",
    name: "Right Winger",
    summary:
      "The mirror of the left winger on the right flank — stretches play wide, then attacks the box or cuts inside depending on which foot leads their game.",
    inPossession:
      "Stays high and wide before cutting inside or driving at the full-back, stretching the defense and creating or finishing chances.",
    outOfPossession:
      "Starts the press on the opposition's full-back and tracks back enough to prevent the wide area from being overloaded.",
    strongSuits: [
      "Take-on ability",
      "Pace in behind",
      "End product",
      "Comfort operating in isolation",
    ],
    howToPlay: [
      "Stay high and wide to stretch the defense before deciding when to attack the space",
      "Attack the full-back's weaker side to open up the cut-inside or the byline run",
      "Time runs in behind to stay onside against a high defensive line",
      "Track back enough to stop the opposition overloading your flank, even without full defensive duty",
    ],
    commonMistakes: [
      "Drifting too far infield too early and taking away the team's width",
      "Forcing the same move every time instead of reading which side is open",
      "Doing too little defensive work and leaving the full-back exposed two-on-one",
    ],
    zones: [{ x: 65, y: 8, width: 35, height: 27 }],
    related: [
      {
        code: "RM",
        note: "Drops into a flatter midfield line defensively when the team sets up in a back-to-four-at-the-back shape.",
      },
      {
        code: "ST",
        note: "Can tuck inside to play as an auxiliary striker in narrower attacking systems.",
      },
    ],
  },
  ST: {
    code: "ST",
    name: "Striker",
    summary:
      "The team's most direct route to goal — holds up play, makes runs in behind, and is judged above all on the ability to finish chances.",
    inPossession:
      "Holds up play with their back to goal, makes runs in behind, and is judged above all on finishing when the chance arrives.",
    outOfPossession:
      "Leads the press by cutting off the opposition's center-backs from an easy pass out, even without dropping deep to defend.",
    strongSuits: [
      "Finishing",
      "Movement in the box",
      "Hold-up play",
      "Timing of runs to beat the offside line",
    ],
    howToPlay: [
      "Vary runs between in behind, short to feet, and across the front line to stay unpredictable",
      "Hold the ball up under pressure just long enough for support to arrive",
      "Attack the space between center-backs rather than running straight at them",
      "Lead the press by showing the ball into a predictable, weaker side",
    ],
    commonMistakes: [
      "Making the same run too often, letting defenders anticipate it",
      "Checking to feet too much and never threatening the space in behind",
      "Standing still on the shoulder of the last defender instead of working the whole box",
    ],
    zones: [{ x: 20, y: 0, width: 60, height: 20 }],
    related: [
      {
        code: "F9",
        note: "A deep-lying forward variant that drops into the pocket usually occupied by an attacking midfielder.",
      },
      {
        code: "LW",
        note: "Wide forwards often interchange positions with the striker to drag defenders out of shape.",
      },
    ],
  },
  IFB: {
    code: "IFB",
    name: "Inverted Full-Back",
    isHybrid: true,
    summary:
      "A full-back who steps into central midfield in possession instead of overlapping down the wing — trading traditional width for an extra body in the middle of the pitch.",
    inPossession:
      "Moves inside into central midfield once the team has the ball, forming an extra central passing option and freeing a winger or wide forward to hold the width instead.",
    outOfPossession:
      "Reverts to a conventional full-back position, defending the wide channel one-on-one just like in a traditional back four.",
    strongSuits: [
      "Positional intelligence",
      "Passing range",
      "Comfort playing centrally",
      "Recovery pace to reset wide",
    ],
    howToPlay: [
      "Recognize exactly when possession is secure enough to tuck inside rather than hold the touchline",
      "Occupy the central pocket the defensive midfielder vacates when they push forward, rather than duplicating their position",
      "Reset back to a wide starting position immediately once possession is lost",
      "Use the extra central passing lane to help the team play through a high press",
    ],
    commonMistakes: [
      "Tucking inside too early, before the team has actually secured possession",
      "Occupying the same space as the defensive midfielder instead of a genuinely different lane",
      "Getting caught centrally when possession turns over, leaving the wide channel open",
    ],
    zones: [
      { x: 0, y: 55, width: 30, height: 35 },
      { x: 25, y: 40, width: 50, height: 20 },
    ],
    related: [
      {
        code: "LB",
        note: "The traditional starting point for this role — the same player reverts to a standard left-back position the moment possession is lost.",
      },
      {
        code: "RB",
        note: "The mirror on the right flank — the same tactical idea applied to a right-back instead.",
      },
    ],
  },
  F9: {
    code: "F9",
    name: "False 9",
    isHybrid: true,
    summary:
      "A striker who drops deep into midfield rather than staying on the last line, dragging opposition center-backs out of position and creating space in behind for others to run into.",
    inPossession:
      "Drops off the front line into the pocket between the opposition's defense and midfield, looking to combine before a teammate makes the run into the space just vacated.",
    outOfPossession:
      "Leads the press from the front just like a conventional striker, using the withdrawn starting position to also help screen passes into the opposition's deepest midfielder.",
    strongSuits: [
      "Vision and link-up play",
      "Comfort receiving with back to goal",
      "Passing under pressure",
      "Intelligent decoy movement",
    ],
    howToPlay: [
      "Drop into the pocket to draw a center-back out of position before releasing a teammate into the space created",
      "Vary how deep you drop so the movement stays a genuine surprise rather than a predictable habit",
      "Combine quickly rather than holding the ball, since the whole point is creating space for a teammate's run",
      "Recognize when to stay high instead, so the movement doesn't become entirely predictable",
    ],
    commonMistakes: [
      "Dropping so deep, so often, that the team has no one occupying the last line at all",
      "Holding the ball too long after dropping, giving defenders time to recover their shape",
      "Failing to combine with the runners the movement was designed to free up",
    ],
    zones: [
      { x: 20, y: 0, width: 60, height: 12 },
      { x: 25, y: 15, width: 50, height: 20 },
    ],
    related: [
      {
        code: "ST",
        note: "The more traditional target-man or poacher version of the same central striker slot, staying high rather than dropping deep.",
      },
      {
        code: "CAM",
        note: "Occupies a very similar pocket of space, though the false 9 arrives there by dropping from the front line rather than starting deeper.",
      },
    ],
  },
  B2B: {
    code: "B2B",
    name: "Box-to-Box Midfielder",
    isHybrid: true,
    summary:
      "A central midfielder who covers the full length of the pitch every match, contributing fully to both defensive duty and the attack rather than specializing in either.",
    inPossession:
      "Arrives late into the box to support attacks after first helping build play through midfield, covering ground few other positions are asked to cover in a single passage of play.",
    outOfPossession:
      "Gets fully behind the ball to help defensively, then immediately looks to break forward again the moment possession is regained.",
    strongSuits: [
      "Exceptional stamina",
      "Work rate across 90 minutes",
      "Timing of late runs into the box",
      "Balance between defensive and attacking duty",
    ],
    howToPlay: [
      "Judge each phase of play individually rather than defaulting to a fixed starting position",
      "Time runs into the box so you arrive as the attack develops, not before it",
      "Get fully back behind the ball on defensive transitions rather than half-committing",
      "Manage energy across 90 minutes, since the role demands more total ground covered than almost any other",
    ],
    commonMistakes: [
      "Committing fully to attack too often, leaving the team light in midfield on the counter",
      "Arriving into the box too early and blocking a teammate's run instead of adding a genuine option",
      "Running so much early that intensity drops in the final third of the match",
    ],
    zones: [{ x: 15, y: 12, width: 70, height: 76 }],
    related: [
      {
        code: "CM",
        note: "The base position this role is drawn from — every box-to-box midfielder is fundamentally a central midfielder leaning further toward covering the full pitch.",
      },
      {
        code: "CDM",
        note: "A more purely defensive version of central midfield, trading this role's attacking contribution for extra defensive discipline.",
      },
    ],
  },
  SK: {
    code: "SK",
    name: "Sweeper-Keeper",
    isHybrid: true,
    summary:
      "A goalkeeper who plays far off their line, acting as an auxiliary defender behind a high back line in addition to the traditional shot-stopping and handling duties.",
    inPossession:
      "Comfortable receiving passes well outside the box and playing out under pressure, effectively functioning as an extra outfield passing option during build-up.",
    outOfPossession:
      "Positions far off the goal line to cover the space in behind a high defensive line, ready to sweep up through balls before an onrushing attacker can reach them.",
    strongSuits: [
      "Comfort and technique with the ball at their feet",
      "Reading through-balls early",
      "Composure under pressure outside the box",
      "Speed off the line",
    ],
    howToPlay: [
      "Set a starting position based on the height of your own defensive line, not a fixed spot near goal",
      "Commit early and decisively when coming out to clear a through-ball — hesitation is what gets punished most",
      "Treat distribution as a genuine first-phase passing option, not just a way to restart play",
      "Communicate constantly with the back line so everyone moves up and drops as a unit",
    ],
    commonMistakes: [
      "Playing high off the line without the reading-of-the-game needed to get to through-balls first",
      "Taking an extra touch outside the box under pressure instead of playing simply",
      "Losing track of exact positioning relative to the goal when play is far away",
    ],
    zones: [
      { x: 20, y: 70, width: 60, height: 30 },
      { x: 30, y: 55, width: 40, height: 20 },
    ],
    related: [
      {
        code: "GK",
        note: "The traditional, line-hugging version of the same position, prioritizing shot-stopping positioning over sweeping up through-balls.",
      },
      {
        code: "CB",
        note: "Effectively becomes an auxiliary extra defender when play is in the opposition's half, much like a center-back stepping into midfield.",
      },
    ],
  },
  DLP: {
    code: "DLP",
    name: "Deep-Lying Playmaker",
    isHybrid: true,
    summary:
      "A deep midfielder who drops between or beside the center-backs in possession to start attacks personally, rather than simply screening the defense.",
    inPossession:
      "Drops into the space between the center-backs to receive the ball from the goalkeeper and dictate the tempo of the team's entire build-up from deep.",
    outOfPossession:
      "Screens the back line like a conventional defensive midfielder, cutting passing lanes and positioning to win the ball back before it reaches a dangerous area.",
    strongSuits: [
      "Passing range and vision",
      "Composure receiving under pressure",
      "Game intelligence and tempo control",
      "Positional discipline",
    ],
    howToPlay: [
      "Drop between or beside the center-backs early, before the goalkeeper is forced into a rushed decision",
      "Scan the pitch before receiving so the first touch can already break the opposition's first line",
      "Dictate tempo deliberately — slow the game down or speed it up based on what the team needs",
      "Recover into a screening position immediately once the ball moves beyond your control",
    ],
    commonMistakes: [
      "Dropping so deep and so often that a genuine passing outlet becomes a standing target for the opposition's press",
      "Prioritizing a spectacular long pass over the simple ball that actually keeps possession moving",
      "Failing to recover into a defensive screening position once the team loses the ball",
    ],
    zones: [
      { x: 20, y: 55, width: 60, height: 20 },
      { x: 25, y: 70, width: 50, height: 15 },
    ],
    related: [
      {
        code: "CDM",
        note: "The base position this role is drawn from — every deep-lying playmaker is fundamentally a defensive midfielder leaning further toward starting attacks personally.",
      },
      {
        code: "CB",
        note: "Occupies very similar space when dropping between the center-backs, effectively becoming an auxiliary extra defender in build-up.",
      },
    ],
  },
};

export function getPosition(code: string): PositionInfo | undefined {
  return positions[code as PositionCode];
}
