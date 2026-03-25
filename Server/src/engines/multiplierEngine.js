// src/engines/multiplierEngine.js

function calculate(cards, blackjackResult, context = {}) {
  const events = [];
  let multiplier = 1.0;

  // Example: streak-based multiplier (from context)
  if (context.streak && context.streak > 0) {
    const value = 1 + Math.min(context.streak * 0.1, 1.0); // up to 2x
    multiplier *= value;
    events.push({
      type: "streak",
      label: "Win Streak",
      value,
      reason: `Current streak: ${context.streak}`,
    });
  }

  // Example: joker-based multiplier (placeholder)
  if (context.jokers && Array.isArray(context.jokers)) {
    for (const joker of context.jokers) {
      // You’ll later define real joker rules; here’s a simple hook:
      if (joker.type === "lucky_21" && blackjackResult.blackjack) {
        const value = 1.5;
        multiplier *= value;
        events.push({
          type: "joker",
          label: "Lucky 21 Joker",
          value,
          reason: "Hand total was 21",
        });
      }
    }
  }

  // Example: suit-based buff
  if (context.heartBuff && cards.some((c) => c.suit === "hearts")) {
    const value = 1.1;
    multiplier *= value;
    events.push({
      type: "buff",
      label: "Heart Booster",
      value,
      reason: "Hand contained Hearts",
    });
  }

  return {
    multiplier,
    multiplierEvents: events,
  };
}

module.exports = {
  calculate,
};
