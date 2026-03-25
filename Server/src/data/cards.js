const SUITS = ["hearts", "diamonds", "clubs", "spades"];
const RANKS = [
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

function generateBaseDeck() {
  const cards = [];
  let id = 1;

  for (const suit of SUITS) {
    for (const { rank, value } of RANKS) {
      cards.push({
        id: id++,
        suit,
        rank,
        value,
        imageKey: `${rank}_of_${suit}`,
      });
    }
  }

  return cards;
}

function generateDoubleDeck() {
  const deck1 = generateBaseDeck();
  const deck2 = generateBaseDeck().map((card) => ({
    ...card,
    id: card.id + 1000, // ensure uniqueness in memory
  }));

  return [...deck1, ...deck2];
}

module.exports = {
  generateBaseDeck,
  generateDoubleDeck,
  SUITS,
  RANKS,
};
