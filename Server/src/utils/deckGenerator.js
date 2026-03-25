const seedrandom = require("seedrandom");

function generateSeed() {
  return Math.floor(Math.random() * 1_000_000_000);
}

function generateDeterministicDeck(seed) {
  const rng = seedrandom(seed.toString());

  const suits = ["♠", "♥", "♦", "♣"];
  const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  let deck = [];

  for (const suit of suits) {
    for (const value of values) {
      deck.push({ value, suit });
    }
  }

  // Fisher-Yates shuffle using deterministic RNG
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}

module.exports = { generateSeed, generateDeterministicDeck };
