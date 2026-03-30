// src/services/modifierRegistry.js
// Registers all gameplay modifiers with the modifier dispatcher.

const {
  registerJoker,
  registerRelic,
  registerEnhancement,
  registerBoss,
} = require("./modifierService");

// ------------------------------------------------------------
// Joker registrations
// ------------------------------------------------------------
registerJoker("face_value", (trigger, context) => {
  if (trigger !== "onScore") return null;
  return { multiplierBonus: 0.5 };
});

registerJoker("thin_margin", (trigger, context) => {
  if (trigger !== "onScore") return null;
  if (context.handTotal === 21) {
    return { multiplierBonus: 1.0 };
  }
  return null;
});

registerJoker("even_odds", (trigger, context) => {
  if (trigger !== "onScore") return null;
  if (context.handTotal % 2 === 0) {
    return { scoreBonus: 10 };
  }
  return null;
});

// ------------------------------------------------------------
// Relic registrations
// ------------------------------------------------------------
registerRelic("grave_marker", (trigger, context) => {
  if (trigger !== "onBust") return null;
  return { preventFragile: true };
});

registerRelic("void_charm", (trigger, context) => {
  if (trigger !== "onScore") return null;
  return { fragileReduction: 1 };
});

// ------------------------------------------------------------
// Enhancement registrations
// ------------------------------------------------------------
registerEnhancement("golden_edge", (trigger, context) => {
  if (trigger !== "onScore") return null;
  return { scoreMultiplier: 1.25 };
});

registerEnhancement("cracked", (trigger, context) => {
  if (trigger !== "onScore") return null;
  return { fragileIncrease: 1 };
});

// ------------------------------------------------------------
// Boss registrations
// ------------------------------------------------------------
registerBoss("boss_cutter", (trigger, context) => {
  if (trigger !== "onScore") return null;
  return { scoreMultiplier: 0.75 };
});

registerBoss("boss_scramble", (trigger, context) => {
  if (trigger !== "onHandStart") return null;
  return { scrambleHand: true };
});

// ------------------------------------------------------------
// Export nothing — side‑effect registration only
// ------------------------------------------------------------
module.exports = {};
