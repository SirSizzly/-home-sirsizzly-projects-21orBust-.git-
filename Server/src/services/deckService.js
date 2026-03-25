const { createPRNG } = require("../utils/prng");
const { generateDoubleDeck } = require("../data/cards");

// Fisher–Yates shuffle using deterministic PRNG
function shuffleWithSeed(seed) {
  const rng = createPRNG(seed);
  const deck = generateDoubleDeck().slice();

  for (let i = deck.length - 1; i > 0; i--) {
    const r = rng();
    const j = Math.floor(r * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}

function createDeckRun(seed) {
  const deck = shuffleWithSeed(seed);
  return {
    seed,
    cards: deck,
  };
}

module.exports = {
  shuffleWithSeed,
  createDeckRun,
};
