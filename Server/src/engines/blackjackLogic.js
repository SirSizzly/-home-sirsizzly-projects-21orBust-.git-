// src/engines/blackjackLogic.js

function evaluate(cards) {
  let total = 0;
  let aces = 0;

  for (const card of cards) {
    if (card.rank === "A") {
      total += 11;
      aces += 1;
    } else {
      total += card.value;
    }
  }

  // Soft ace adjustment
  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }

  const busted = total > 21;
  const blackjack = total === 21;

  // Simple base scoring curve (you can tune this)
  let baseScore = 0;
  if (!busted) {
    if (total === 21) baseScore = 100;
    else if (total === 20) baseScore = 40;
    else if (total === 19) baseScore = 20;
    else if (total === 18) baseScore = 10;
    else baseScore = Math.max(0, total - 10); // small reward for lower totals
  }

  return {
    total,
    busted,
    blackjack,
    baseScore,
  };
}

module.exports = {
  evaluate,
};
