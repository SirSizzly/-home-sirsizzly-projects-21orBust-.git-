// Server/src/utils/deckGenerator.js

function generateSeed() {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
}

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateDeck(seed) {
  const suits = ["hearts", "diamonds", "clubs", "spades"];
  const ranks = [
    { rank: "A", value: 11 },
    { rank: "2", value: 2 },
    { rank: "3", value: 3 },
    { rank: "4", value: 4 },
    { rank: "5", value: 5 },
    { rank: "6", value: 6 },
    { rank: "7", value: 7 },
    { rank: "8", value: 8 },
    { rank: "9", value: 9 },
    { rank: "10", value: 10 },
    { rank: "J", value: 10 },
    { rank: "Q", value: 10 },
    { rank: "K", value: 10 },
  ];

  const deck = [];
  let id = 1;

  // Double deck (104 cards)
  for (let i = 0; i < 2; i++) {
    for (const suit of suits) {
      for (const r of ranks) {
        deck.push({
          id: id++,
          suit,
          rank: r.rank,
          value: r.value,
          image_key: `${r.rank}_of_${suit}`,
        });
      }
    }
  }

  const rand = mulberry32(seed);

  // Deterministic shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}

module.exports = {
  generateSeed,
  generateDeck,
};
