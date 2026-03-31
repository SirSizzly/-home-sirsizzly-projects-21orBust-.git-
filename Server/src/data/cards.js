// Server/src/data/cards.js
// Authoritative deck definition for 21orBust.

const SUITS = ["club", "diamond", "heart", "spade"];

const RANKS = [
  { code: "2", value: 2, imageBase: "two" },
  { code: "3", value: 3, imageBase: "three" },
  { code: "4", value: 4, imageBase: "four" },
  { code: "5", value: 5, imageBase: "five" },
  { code: "6", value: 6, imageBase: "six" },
  { code: "7", value: 7, imageBase: "seven" },
  { code: "8", value: 8, imageBase: "eight" },
  { code: "9", value: 9, imageBase: "nine" },
  { code: "10", value: 10, imageBase: "ten" },
  { code: "J", value: 10, imageBase: "j" },
  { code: "Q", value: 10, imageBase: "q" },
  { code: "K", value: 10, imageBase: "k" },
  { code: "A", value: 11, imageBase: "a" },
];

// Canonical image key generator.
// Matches files like: a_diamond.png, q_spade.png, ten_heart.png
function imageKeyFor(rankCode, suit) {
  const rank = RANKS.find((r) => r.code === rankCode);
  if (!rank) throw new Error(`Unknown rank: ${rankCode}`);

  return `${rank.imageBase}_${suit}`;
}

function generateBaseDeck() {
  const cards = [];
  let id = 1;

  for (const suit of SUITS) {
    for (const { code, value } of RANKS) {
      cards.push({
        id: id++,
        suit,
        rank: code,
        value,
        image_key: imageKeyFor(code, suit),
      });
    }
  }

  return cards;
}

function generateDoubleDeck() {
  const deck1 = generateBaseDeck().map((c) => ({
    ...c,
    deck_index: 0,
    card_id: `${c.rank}_${c.suit}_0`,
  }));

  const deck2 = generateBaseDeck().map((c) => ({
    ...c,
    deck_index: 1,
    card_id: `${c.rank}_${c.suit}_1`,
  }));

  return [...deck1, ...deck2];
}

module.exports = {
  SUITS,
  RANKS,
  imageKeyFor,
  generateBaseDeck,
  generateDoubleDeck,
};
