/**
 * Canonical definitions for the tactical vocabulary the content uses.
 *
 * Two problems this solves. Some terms (final third, low block, half-space,
 * between the lines) are used across the site and explained nowhere. Others
 * are explained well, but in exactly one lesson — so a reader arriving on a
 * manager page from search gets the bare term with its explanation three
 * modules away.
 *
 * Definitions are deliberately one sentence and written for someone who has
 * just finished Module 1. All wording is original per the project's content
 * constraint; nothing here is lifted or paraphrase-copied from a reference.
 */

export type GlossaryEntry = {
  /** Stable id, used as the DOM anchor and search key. */
  id: string;
  /** Canonical display form. */
  term: string;
  /**
   * Other spellings that should resolve to this entry: plurals, hyphenation
   * variants, and the -ing/-ed forms the prose actually uses.
   */
  aliases?: string[];
  definition: string;
  /**
   * Whether the auto-linker may mark this term up inside lesson prose.
   *
   * False for terms that are ordinary English as well as tactical jargon —
   * "width" appears 177 times across the content and is usually just the
   * everyday word. Those still appear in the glossary and in search; they
   * simply do not get linked automatically, because a wrong link is worse
   * than a missing one.
   */
  autoLink: boolean;
};

export const glossary: GlossaryEntry[] = [
  {
    id: "final-third",
    term: "final third",
    definition:
      "The third of the pitch closest to the goal you are attacking, where chances get created and defending gets most desperate.",
    autoLink: true,
  },
  {
    id: "build-up",
    term: "build-up",
    aliases: ["build up play", "build-up play", "building up"],
    definition:
      "The passing phase that moves the ball out from your own goalkeeper and defenders toward midfield, rather than hitting it long straight away.",
    autoLink: true,
  },
  {
    id: "low-block",
    term: "low block",
    definition:
      "A defensive setup where the whole team drops deep and defends close to its own goal, giving up territory to deny space behind.",
    autoLink: true,
  },
  {
    id: "mid-block",
    term: "mid block",
    definition:
      "A defensive setup that holds its shape around the middle of the pitch, neither pressing high nor retreating to the goal.",
    autoLink: true,
  },
  {
    id: "high-block",
    term: "high block",
    aliases: ["high line"],
    definition:
      "A defensive setup that holds a line far up the pitch, squeezing the opponent back at the cost of space in behind.",
    autoLink: true,
  },
  {
    id: "half-space",
    term: "half-space",
    aliases: ["half-spaces", "half space", "half spaces"],
    definition:
      "The vertical strip between the middle of the pitch and the touchline, where an attacker can face goal without being pinned to the sideline.",
    autoLink: true,
  },
  {
    id: "between-the-lines",
    term: "between the lines",
    definition:
      "The gap between an opponent's midfield and defence, where a receiving player is hard to mark because nobody clearly owns them.",
    autoLink: true,
  },
  {
    id: "offside-trap",
    term: "offside trap",
    definition:
      "A defence stepping up together at the moment the ball is played, so the attacker running through is caught offside.",
    autoLink: true,
  },
  {
    id: "gegenpress",
    term: "gegenpress",
    aliases: ["gegenpressing", "counter-press", "counterpress", "counter-pressing"],
    definition:
      "Winning the ball back immediately after losing it, attacking the opponent in the seconds before they can settle.",
    autoLink: true,
  },
  {
    id: "press-trigger",
    term: "press trigger",
    aliases: ["press triggers", "pressing trigger"],
    definition:
      "The specific cue that tells a team to start pressing, such as a backwards pass or a bad first touch.",
    autoLink: true,
  },
  {
    id: "overload",
    term: "overload",
    aliases: ["overloads", "overloading"],
    definition:
      "Deliberately putting more of your players than theirs into one area of the pitch, so someone is free.",
    autoLink: true,
  },
  {
    id: "overlap",
    term: "overlap",
    aliases: ["overlaps", "overlapping"],
    definition:
      "A teammate running outside and beyond the player on the ball, usually a full-back going past a winger.",
    autoLink: true,
  },
  {
    id: "underlap",
    term: "underlap",
    aliases: ["underlaps", "underlapping"],
    definition:
      "The same idea as an overlap but run on the inside, between the opposition's full-back and centre-back.",
    autoLink: true,
  },
  {
    id: "double-pivot",
    term: "double pivot",
    definition:
      "Two defensive midfielders playing side by side in front of the back line, sharing the job of screening it.",
    autoLink: true,
  },
  {
    id: "false-nine",
    term: "false 9",
    aliases: ["false nine"],
    definition:
      "A centre-forward who drops into midfield instead of leading the line, dragging a centre-back out of position or going unmarked.",
    autoLink: true,
  },
  {
    id: "target-man",
    term: "target man",
    definition:
      "A forward the team can aim long passes at, expected to hold the ball up under pressure until support arrives.",
    autoLink: true,
  },
  {
    id: "sweeper-keeper",
    term: "sweeper keeper",
    aliases: ["sweeper-keeper"],
    definition:
      "A goalkeeper who plays well off the line to clear balls in behind, acting as an extra defender.",
    autoLink: true,
  },
  {
    id: "box-to-box",
    term: "box-to-box",
    definition:
      "A midfielder who covers the full length of the pitch, defending in their own penalty area and arriving in the opponent's.",
    autoLink: true,
  },
  {
    id: "man-marking",
    term: "man-marking",
    aliases: ["man marking", "man-mark", "man-marked"],
    definition:
      "Each defender is responsible for one specific opponent and follows them wherever they go.",
    autoLink: true,
  },
  {
    id: "zonal-marking",
    term: "zonal marking",
    definition:
      "Each defender is responsible for an area of the pitch rather than a particular opponent.",
    autoLink: true,
  },
  {
    id: "rest-defence",
    term: "rest defence",
    aliases: ["rest defense"],
    definition:
      "The players kept back in position while the team attacks, there to stop the counter-attack before it starts.",
    autoLink: true,
  },
  {
    id: "switch-of-play",
    term: "switch of play",
    aliases: ["switching play", "switch the play"],
    definition:
      "Moving the ball quickly from one side of the pitch to the other to attack the space the defence has just vacated.",
    autoLink: true,
  },
  {
    id: "cutback",
    term: "cutback",
    aliases: ["cut-back", "cutbacks"],
    definition:
      "A pass rolled backwards from near the byline to a teammate arriving at the edge of the box.",
    autoLink: true,
  },
  {
    id: "back-three",
    term: "back three",
    definition: "A defence built on three centre-backs rather than the more common flat four.",
    autoLink: true,
  },
  {
    id: "inverted-full-back",
    term: "inverted full-back",
    aliases: ["inverted fullback", "inverts"],
    definition:
      "A full-back who moves infield into midfield when their team has the ball, instead of pushing up the touchline.",
    autoLink: true,
  },
  {
    id: "inverted-winger",
    term: "inverted winger",
    definition:
      "A winger playing on the opposite side to their stronger foot, so cutting inside sets up a shot rather than a cross.",
    autoLink: true,
  },
  {
    id: "libero",
    term: "libero",
    definition:
      "A free defender playing behind the defensive line with no marking assignment, able to step forward with the ball.",
    autoLink: true,
  },
  {
    id: "regista",
    term: "regista",
    definition:
      "A deep midfielder who sets the tempo and direction of a team's attacks with their passing from in front of the defence.",
    autoLink: true,
  },
  {
    id: "trequartista",
    term: "trequartista",
    definition:
      "A creative player operating between midfield and attack, freed from most defensive duties to invent chances.",
    autoLink: true,
  },
  {
    id: "tiki-taka",
    term: "tiki-taka",
    definition:
      "A style built on continuous short passing and movement, using possession itself to control the game.",
    autoLink: true,
  },
  {
    id: "catenaccio",
    term: "catenaccio",
    definition:
      "A defence-first system built around dense, disciplined shape and a spare defender behind the back line.",
    autoLink: true,
  },
  {
    id: "park-the-bus",
    term: "park the bus",
    aliases: ["parking the bus"],
    definition:
      "Putting nearly the whole team behind the ball with no real attempt to attack, purely to protect the result.",
    autoLink: true,
  },
  {
    id: "route-one",
    term: "route one",
    definition:
      "Skipping midfield entirely by hitting long balls forward from the back toward a target.",
    autoLink: true,
  },

  // Ambiguous with everyday English. Defined and searchable, never auto-linked.
  {
    id: "width",
    term: "width",
    definition:
      "How far apart a team spreads across the pitch, stretching the opposition defence sideways to open gaps in the middle.",
    autoLink: false,
  },
  {
    id: "tempo",
    term: "tempo",
    definition: "How fast a team moves the ball and attacks, from patient circulation to hitting forward at speed.",
    autoLink: false,
  },
  {
    id: "transition",
    term: "transition",
    aliases: ["transitions"],
    definition:
      "The moments right after possession changes hands, when both teams are briefly out of shape and most vulnerable.",
    autoLink: false,
  },
  {
    id: "pocket",
    term: "pocket",
    aliases: ["pockets"],
    definition: "A small area of space between opponents where a player can receive the ball and turn.",
    autoLink: false,
  },
  {
    id: "channel",
    term: "channel",
    aliases: ["channels"],
    definition: "The running lane between two defenders, often the gap between a centre-back and a full-back.",
    autoLink: false,
  },
  {
    id: "pivot",
    term: "pivot",
    definition:
      "The midfielder positioned in front of the defence that the team's play turns around, both screening and distributing.",
    autoLink: false,
  },
  {
    id: "compactness",
    term: "compactness",
    aliases: ["compact"],
    definition:
      "Keeping short distances between your own players so there is no space between the lines to play through.",
    autoLink: false,
  },
];

const byId = new Map(glossary.map((entry) => [entry.id, entry]));

export function getGlossaryEntry(id: string): GlossaryEntry | undefined {
  return byId.get(id);
}

/**
 * Every auto-linkable surface form paired with its entry, longest first.
 *
 * Length order matters: "low block" must be tested before "block" would be,
 * and "inverted full-back" before "inverted winger" shares a prefix —
 * otherwise a shorter term wins and swallows the longer one's match.
 */
export const autoLinkForms: { form: string; entry: GlossaryEntry }[] = glossary
  .filter((entry) => entry.autoLink)
  .flatMap((entry) => [entry.term, ...(entry.aliases ?? [])].map((form) => ({ form, entry })))
  .sort((a, b) => b.form.length - a.form.length);
