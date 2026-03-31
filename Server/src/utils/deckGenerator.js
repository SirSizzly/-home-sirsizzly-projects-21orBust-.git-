// Server/src/utils/deckGenerator.js
// Deterministic deck generator for 21orBust.
// Produces a 104-card double deck, shuffles it using the PRNG,
// and returns the full deck in the exact shape required by runService.

const { generateDoubleDeck } = require("../data/cards");
const { setSeed, nextInt } = require("../engines/prngEngine");

/**
 * Generate a numeric seed for the PRNG.
 * You can replace this with crypto.randomUUID() or similar later.
 */
function generateSeed() {
  return Date.now();
}

/**
 * Deterministic Fisher–Yates shuffle using the PRNG engine.
 */
function shuffleDeterministic(cards) {
  const arr = cards.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = nextInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generate a full 104-card deck from a seed.
 * This is the ONLY function runService should call.
 *
 * Returns an array of card objects:
 * {
 *   card_id: "Q_club_0",
 *   rank: "Q",
 *   suit: "club",
 *   value: 10,
 *   image_key: "q_club",
 *   deck_index: 0 or 1
 * }
 */
function generateDeck(seed) {
  // Initialize PRNG
  setSeed(seed);

  // Build the canonical 104-card deck
  const deck = generateDoubleDeck();

  // Shuffle deterministically
  const shuffled = shuffleDeterministic(deck);

  return shuffled;
}

module.exports = {
  generateSeed,
  generateDeck,
};
