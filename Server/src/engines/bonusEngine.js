// src/engines/bonusEngine.js

function calculate(cards, blackjackResult, context = {}) {
  const events = [];
  let bonusScore = 0;

  const sameSuit = allSameSuit(cards);
  const faceCount = countFaces(cards);
  const cardCount = cards.length;

  // Example: 5-card hand bonus
  if (!blackjackResult.busted && cardCount >= 5) {
    const value = 20;
    bonusScore += value;
    events.push({
      type: "five_card",
      label: "5-Card Trick",
      value,
      reason: `Reached ${blackjackResult.total} with ${cardCount} cards`,
    });
  }

  // Example: flush bonus
  if (!blackjackResult.busted && sameSuit) {
    const value = 15;
    bonusScore += value;
    events.push({
      type: "same_suit",
      label: "Flush Bonus",
      value,
      reason: "All cards were the same suit",
    });
  }

  // Example: face card chain
  if (!blackjackResult.busted && faceCount >= 3) {
    const value = 10;
    bonusScore += value;
    events.push({
      type: "face_chain",
      label: "Face Card Chain",
      value,
      reason: `Used ${faceCount} face cards`,
    });
  }

  // Example: perfect 21 callout
  if (blackjackResult.blackjack) {
    const value = 25;
    bonusScore += value;
    events.push({
      type: "perfect_21",
      label: "Perfect 21!",
      value,
      reason: "Hit exactly 21",
    });
  }

  return {
    bonusScore,
    bonusEvents: events,
  };
}

function allSameSuit(cards) {
  if (cards.length === 0) return false;
  const suit = cards[0].suit;
  return cards.every((c) => c.suit === suit);
}

function countFaces(cards) {
  const faces = new Set(["J", "Q", "K"]);
  return cards.filter((c) => faces.has(c.rank)).length;
}

module.exports = {
  calculate,
};
