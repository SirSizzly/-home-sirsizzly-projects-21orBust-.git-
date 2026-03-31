// Server/src/engines/scoringEngine.js
// Pure scoring engine for 21orBust.
// No DB, no side effects — returns a scoring breakdown object.

const {
  calculateHandTotal,
  countFaceCards,
  countRank,
  uniqueSuits,
} = require("./cardEngine");

// ------------------------------------------------------------
// Base point rules
// ------------------------------------------------------------
function calculateBasePoints(handTotal, busted) {
  if (busted) return 0;
  return handTotal * 10; // Your rule: score = total * 10
}

// ------------------------------------------------------------
// Base point modifiers (Jokers, Relics, Bosses)
// ------------------------------------------------------------
function applyBaseModifiers(basePoints, context, hand) {
  let points = basePoints;
  const effects = [];

  // Example: Face Parade (each face card +5 points)
  if (context.jokers.includes("face_parade")) {
    const faces = countFaceCards(hand.cards);
    if (faces > 0) {
      const bonus = faces * 5;
      points += bonus;
      effects.push({ type: "joker", key: "face_parade", bonus });
    }
  }

  // Example: Lucky Sevens (each 7 gives +7 points)
  if (context.jokers.includes("lucky_sevens")) {
    const sevens = countRank(hand.cards, "7");
    if (sevens > 0) {
      const bonus = sevens * 7;
      points += bonus;
      effects.push({ type: "joker", key: "lucky_sevens", bonus });
    }
  }

  // Example: Suit Tyrant (all cards same suit → +20)
  if (context.jokers.includes("suit_tyrant")) {
    const suits = uniqueSuits(hand.cards);
    if (suits.size === 1) {
      points += 20;
      effects.push({ type: "joker", key: "suit_tyrant", bonus: 20 });
    }
  }

  // Boss: The Taxman (reduce base points by 20%)
  if (context.boss === "the_taxman") {
    const reduction = Math.floor(points * 0.2);
    points -= reduction;
    effects.push({ type: "boss", key: "the_taxman", reduction });
  }

  return { points, effects };
}

// ------------------------------------------------------------
// Multiplier assembly
// ------------------------------------------------------------
function assembleMultiplier(context, hand) {
  let mult = 1;
  const effects = [];

  // Permanent multiplier
  if (context.run.permanentMultiplier > 0) {
    mult += context.run.permanentMultiplier;
    effects.push({
      type: "run",
      key: "permanent_multiplier",
      amount: context.run.permanentMultiplier,
    });
  }

  // Example: Even Odds (if total is even, +1x)
  if (context.jokers.includes("even_odds")) {
    if (context.handTotal % 2 === 0) {
      mult += 1;
      effects.push({ type: "joker", key: "even_odds", amount: 1 });
    }
  }

  // Example: Pressure Cooker (each hit adds +0.25x)
  if (context.jokers.includes("pressure_cooker")) {
    const bonus = hand.hitsTaken * 0.25;
    mult += bonus;
    effects.push({ type: "joker", key: "pressure_cooker", amount: bonus });
  }

  // Boss: The Grinder (multiplier reduced by 1)
  if (context.boss === "the_grinder") {
    mult = Math.max(1, mult - 1);
    effects.push({ type: "boss", key: "the_grinder", amount: -1 });
  }

  return { mult, effects };
}

// ------------------------------------------------------------
// Main scoring function
// ------------------------------------------------------------
function scoreHand(hand, context) {
  const handTotal = context.handTotal;
  const busted = hand.busted;

  // 1. Base points
  const basePoints = calculateBasePoints(handTotal, busted);

  // 2. Base modifiers
  const { points: modifiedBase, effects: baseEffects } = applyBaseModifiers(
    basePoints,
    context,
    hand,
  );

  // 3. Multiplier assembly
  const { mult, effects: multEffects } = assembleMultiplier(context, hand);

  // 4. Pre-fragile score
  const preFragileScore = Math.floor(modifiedBase * mult);

  return {
    basePoints,
    modifiedBase,
    multiplier: mult,
    preFragileScore,
    finalScore: preFragileScore, // fragile applied in runstateService
    triggeredEffects: [...baseEffects, ...multEffects],
  };
}

module.exports = {
  scoreHand,
};
