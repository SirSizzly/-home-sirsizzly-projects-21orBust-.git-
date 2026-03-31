// Server/src/engines/deckEngine.js
// 104-card deck, sequential draw, no discard.
// Uses PRNG for shuffling and the canonical deck generator.

const { nextInt } = require("./prngEngine");
const { generateDoubleDeck } = require("../utils/deckGenerator");
const { SUITS, RANKS } = require("./cardEngine");

// Create a fresh 104-card deck state
function createDeck() {
  const cards = generateDoubleDeck(); // already has id, rank, suit, image_key, enhancement
  return {
    cards,
    position: 0,
  };
}

// Fisher–Yates shuffle using deterministic PRNG
function shuffle(deckState) {
  const cards = deckState.cards.slice();

  for (let i = cards.length - 1; i > 0; i--) {
    const j = nextInt(i + 1);
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  return {
    ...deckState,
    cards,
    position: 0,
  };
}

// Draw the next card in sequence
function draw(deckState) {
  if (deckState.position >= deckState.cards.length) {
    throw new Error("Deck exhausted");
  }

  const card = deckState.cards[deckState.position];
  deckState.position += 1;
  return card;
}

module.exports = {
  SUITS,
  RANKS,
  createDeck,
  shuffle,
  draw,
};
