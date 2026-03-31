// src/engines/shopEngine.js
// Pure shop logic: offer generation, pricing, reroll cost.
// No DB, no side effects.

const { nextInt } = require("./prngEngine");

// Simple rarity buckets
const JOKER_POOL = [
  { key: "lucky_sevens", type: "joker", rarity: "common", basePrice: 4 },
  { key: "face_parade", type: "joker", rarity: "common", basePrice: 4 },
  { key: "even_odds", type: "joker", rarity: "uncommon", basePrice: 6 },
  { key: "pressure_cooker", type: "joker", rarity: "rare", basePrice: 8 },
];

const RELIC_POOL = [
  { key: "golden_ledger", type: "relic", rarity: "rare", basePrice: 10 },
  { key: "loaded_deck", type: "relic", rarity: "uncommon", basePrice: 8 },
  { key: "grave_marker", type: "relic", rarity: "uncommon", basePrice: 7 },
];

const ENHANCEMENT_POOL = [
  {
    key: "rank_ascension",
    type: "enhancement",
    rarity: "common",
    basePrice: 3,
  },
  { key: "suit_changer", type: "enhancement", rarity: "common", basePrice: 3 },
  { key: "phantom_ink", type: "enhancement", rarity: "uncommon", basePrice: 5 },
  { key: "void_border", type: "enhancement", rarity: "rare", basePrice: 7 },
];

function pickRandom(pool) {
  if (!pool.length) return null;
  const idx = nextInt(pool.length);
  return pool[idx];
}

function priceFor(item, anteIndex) {
  const anteFactor = 1 + (anteIndex - 1) * 0.2;
  return Math.max(1, Math.round(item.basePrice * anteFactor));
}

function generateShopOffers({ anteIndex }) {
  const offers = [];

  // 2 Jokers
  for (let i = 0; i < 2; i++) {
    const item = pickRandom(JOKER_POOL);
    if (item) {
      offers.push({
        slot_index: offers.length,
        key: item.key,
        type: item.type,
        rarity: item.rarity,
        price: priceFor(item, anteIndex),
        sold: false,
      });
    }
  }

  // 1 Relic
  {
    const item = pickRandom(RELIC_POOL);
    if (item) {
      offers.push({
        slot_index: offers.length,
        key: item.key,
        type: item.type,
        rarity: item.rarity,
        price: priceFor(item, anteIndex),
        sold: false,
      });
    }
  }

  // 2 Enhancements
  for (let i = 0; i < 2; i++) {
    const item = pickRandom(ENHANCEMENT_POOL);
    if (item) {
      offers.push({
        slot_index: offers.length,
        key: item.key,
        type: item.type,
        rarity: item.rarity,
        price: priceFor(item, anteIndex),
        sold: false,
      });
    }
  }

  return offers;
}

function rerollCost(anteIndex, rerollsUsed) {
  const base = 2 + (anteIndex - 1);
  return base + rerollsUsed;
}

module.exports = {
  generateShopOffers,
  rerollCost,
};
