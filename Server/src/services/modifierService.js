const knex = require("../data/db/knex");

// Load all purchased modifiers for a run, grouped by type
async function getActiveModifiersForRun(runId) {
  const rows = await knex("purchases as p")
    .join("shop_items as si", "p.shop_item_id", "si.id")
    .join("shops as s", "si.shop_id", "s.id")
    .where("p.run_id", runId)
    .select(
      "si.item_type",
      "si.item_key",
      "si.name",
      "p.purchased_at",
      "s.round_number",
    );

  const jokers = [];
  const relics = [];
  const cardBuffs = [];
  const cardEnhancers = [];
  const cardChangers = [];

  for (const row of rows) {
    switch (row.item_type) {
      case "joker":
        jokers.push(row);
        break;
      case "relic":
        relics.push(row);
        break;
      case "card_buff":
        cardBuffs.push(row);
        break;
      case "card_enhancer":
        cardEnhancers.push(row);
        break;
      case "card_changer":
        cardChangers.push(row);
        break;
      default:
        break;
    }
  }

  return {
    jokers,
    relics,
    cardBuffs,
    cardEnhancers,
    cardChangers,
  };
}

// Apply joker effects to scoring
function applyJokerEffects(jokers, context) {
  let { totalScore, streakBonus, allBust, handResults } = context;

  const nonBustHands = handResults.filter((h) => h.result !== "bust").length;

  for (const joker of jokers) {
    switch (joker.item_key) {
      case "double_down_joker":
        if (nonBustHands > 0) {
          totalScore *= 2;
        }
        break;
      case "safe_hit_joker":
        if (handResults.some((h) => h.result === "bust")) {
          totalScore += 10;
        }
        break;
      case "streak_boost_joker":
        streakBonus += 10;
        break;
      default:
        break;
    }
  }

  return { totalScore, streakBonus, allBust, handResults };
}

// Apply relic effects to scoring
function applyRelicEffects(relics, context) {
  let { totalScore, streakBonus, allBust, handResults } = context;

  const nonBustHands = handResults.filter((h) => h.result !== "bust").length;

  for (const relic of relics) {
    switch (relic.item_key) {
      case "second_chance_relic":
        if (allBust && handResults.length > 0) {
          // flip allBust off and give a small pity score
          allBust = false;
          totalScore += 10;
        }
        break;
      case "steady_hand_relic":
        totalScore += 5 * nonBustHands;
        break;
      case "ace_shift_relic":
        // placeholder: small flat bonus for now
        totalScore += 5;
        break;
      default:
        break;
    }
  }

  return { totalScore, streakBonus, allBust, handResults };
}

// Apply card buff/enhancer/changer effects (for now: simple scoring tweaks)
function applyCardEffectModifiers(
  cardBuffs,
  cardEnhancers,
  cardChangers,
  context,
) {
  let { totalScore, streakBonus, allBust, handResults } = context;

  if (cardBuffs.length > 0) {
    totalScore += 5 * cardBuffs.length;
  }

  if (cardEnhancers.length > 0) {
    streakBonus += 5 * cardEnhancers.length;
  }

  if (cardChangers.length > 0) {
    totalScore += 3 * cardChangers.length;
  }

  return { totalScore, streakBonus, allBust, handResults };
}

// Main entry: apply all modifiers to base scoring
async function applyScoringModifiers(runId, baseContext) {
  const modifiers = await getActiveModifiersForRun(runId);

  let context = {
    totalScore: baseContext.totalScore,
    streakBonus: baseContext.streakBonus,
    allBust: baseContext.allBust,
    handResults: baseContext.handResults,
  };

  context = applyJokerEffects(modifiers.jokers, context);
  context = applyRelicEffects(modifiers.relics, context);
  context = applyCardEffectModifiers(
    modifiers.cardBuffs,
    modifiers.cardEnhancers,
    modifiers.cardChangers,
    context,
  );

  return context;
}

module.exports = {
  getActiveModifiersForRun,
  applyScoringModifiers,
};
