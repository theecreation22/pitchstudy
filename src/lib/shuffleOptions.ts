export type ShuffledOptions = {
  options: string[];
  correctIndex: number;
};

/** FNV-1a, 32-bit. Turns a question's own text into a stable numeric seed. */
function hashSeed(seed: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/** mulberry32 — a tiny seeded PRNG, so the same seed always produces the same sequence. */
function mulberry32(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Reorders a question's answers and reports where the correct one landed.
 *
 * Authored content overwhelmingly puts the correct answer first — roughly
 * nine in ten questions across the curriculum — which makes every quiz on the
 * site beatable by always clicking the top option, without reading anything.
 * Fixing that here rather than by renumbering hundreds of `correctIndex`
 * values also means new content can't reintroduce the pattern.
 *
 * The shuffle is *seeded*, not random, for two reasons. A `Math.random()`
 * order would differ between the server render and hydration, which React
 * flags as a mismatch. It would also be free to reshuffle on any incidental
 * re-render, moving an option out from under the cursor mid-answer. Callers
 * that want a fresh order on a retry vary the seed instead — usually by
 * folding an attempt counter into it.
 */
export function shuffleOptions(options: string[], correctIndex: number, seed: string): ShuffledOptions {
  const random = mulberry32(hashSeed(seed));
  const order = options.map((_, index) => index);

  for (let i = order.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }

  return {
    options: order.map((originalIndex) => options[originalIndex]),
    correctIndex: order.indexOf(correctIndex),
  };
}
