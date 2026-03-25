// src/engines/scoringEngine.js
const blackjack = require("./blackjackLogic");
const bonuses = require("./bonusEngine");
const multipliers = require("./multiplierEngine");

function scoreHand(cards, context = {}) {
  // 1. Blackjack evaluation
  const blackjackResult = blackjack.evaluate(cards);

  // 2. Additive bonuses
  const { bonusScore, bonusEvents } = bonuses.calculate(
    cards,
    blackjackResult,
    context,
  );

  // 3. Subtotal
  const subtotal = blackjackResult.baseScore + bonusScore;

  // 4. Multipliers
  const { multiplier, multiplierEvents } = multipliers.calculate(
    cards,
    blackjackResult,
    context,
  );

  // 5. Final score
  const finalScore = Math.floor(subtotal * multiplier);

  return {
    blackjack: blackjackResult,
    bonusScore,
    bonusEvents,
    subtotal,
    multiplier,
    multiplierEvents,
    finalScore,
  };
}

module.exports = {
  scoreHand,
};
