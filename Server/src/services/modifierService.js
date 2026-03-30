// src/services/modifierService.js
// Central dispatcher for all gameplay modifiers.
// Owns registration, trigger ordering, and override resolution.

const jokerHandlers = {};
const relicHandlers = {};
const enhancementHandlers = {};
const bossHandlers = {};

// ------------------------------------------------------------
// Registration API
// ------------------------------------------------------------
function registerJoker(key, handler) {
  jokerHandlers[key] = handler;
}

function registerRelic(key, handler) {
  relicHandlers[key] = handler;
}

function registerEnhancement(key, handler) {
  enhancementHandlers[key] = handler;
}

function registerBoss(key, handler) {
  bossHandlers[key] = handler;
}

// ------------------------------------------------------------
// Trigger execution
// ------------------------------------------------------------
function applyModifiers({
  trigger,
  context,
  jokers = [],
  relics = [],
  enhancements = [],
  boss = null,
}) {
  const effects = [];

  // 1. Boss always executes first
  if (boss && bossHandlers[boss]) {
    const result = bossHandlers[boss](trigger, context);
    if (result) effects.push(result);
  }

  // 2. Relics
  for (const key of relics) {
    const handler = relicHandlers[key];
    if (!handler) continue;
    const result = handler(trigger, context);
    if (result) effects.push(result);
  }

  // 3. Jokers
  for (const key of jokers) {
    const handler = jokerHandlers[key];
    if (!handler) continue;
    const result = handler(trigger, context);
    if (result) effects.push(result);
  }

  // 4. Enhancements (card-level, lowest priority)
  for (const key of enhancements) {
    const handler = enhancementHandlers[key];
    if (!handler) continue;
    const result = handler(trigger, context);
    if (result) effects.push(result);
  }

  return resolveOverrides(effects);
}

// ------------------------------------------------------------
// Override resolution
// ------------------------------------------------------------
function resolveOverrides(effects) {
  let final = {};

  for (const effect of effects) {
    for (const [key, value] of Object.entries(effect)) {
      // Later effects override earlier ones
      final[key] = value;
    }
  }

  return final;
}

// ------------------------------------------------------------
// Public API
// ------------------------------------------------------------
module.exports = {
  registerJoker,
  registerRelic,
  registerEnhancement,
  registerBoss,
  applyModifiers,
};
