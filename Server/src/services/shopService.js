// src/services/shopService.js
// Shop orchestration for 21orBust.
// Owns shop inventory, purchases, rerolls, and persistence.

const knex = require("../db/knex");

// ------------------------------------------------------------
// Configuration (authoritative defaults)
// ------------------------------------------------------------
const SHOP_CONFIG = {
  jokerSlots: 3,
  relicSlots: 1,
  enhancementPacks: 1,
  baseRerollCost: 1,
  jokerCost: 3,
  relicCost: 5,
  enhancementPackCost: 4,
};

// Placeholder pools (keys only; effects live elsewhere)
const JOKER_POOL = [
  "face_value",
  "thin_margin",
  "even_odds",
  "high_card",
  "odd_luck",
];

const RELIC_POOL = ["grave_marker", "void_charm"];

// ------------------------------------------------------------
// Deterministic picker
// ------------------------------------------------------------
function pickFromPool(pool, seed, count) {
  const picks = [];
  let cursor = seed % pool.length;

  for (let i = 0; i < count; i++) {
    picks.push(pool[cursor]);
    cursor = (cursor + 1) % pool.length;
  }

  return picks;
}

// ------------------------------------------------------------
// Ensure shop exists (resume-safe)
// ------------------------------------------------------------
async function ensureShopState(trx, run) {
  let shop = await trx("active_shop_state").where({ run_id: run.id }).first();
  if (shop) return shop;

  const jokers = pickFromPool(
    JOKER_POOL,
    run.seed + run.ante_index,
    SHOP_CONFIG.jokerSlots,
  );

  const relics = pickFromPool(
    RELIC_POOL,
    run.seed + run.ante_index * 7,
    SHOP_CONFIG.relicSlots,
  );

  await trx("active_shop_state").insert({
    run_id: run.id,
    jokers: JSON.stringify(jokers),
    relics: JSON.stringify(relics),
    enhancement_packs: SHOP_CONFIG.enhancementPacks,
    reroll_cost: SHOP_CONFIG.baseRerollCost,
  });

  return trx("active_shop_state").where({ run_id: run.id }).first();
}

// ------------------------------------------------------------
// Snapshot
// ------------------------------------------------------------
async function getShopState(runId) {
  return knex.transaction(async (trx) => {
    const run = await trx("runs").where({ id: runId }).first();
    if (!run) return null;

    const shop = await ensureShopState(trx, run);

    return {
      gold: run.gold,
      jokers: JSON.parse(shop.jokers),
      relics: JSON.parse(shop.relics),
      enhancementPacks: shop.enhancement_packs,
      rerollCost: shop.reroll_cost,
    };
  });
}

// ------------------------------------------------------------
// Buy item
// ------------------------------------------------------------
async function buyItem(runId, type, index) {
  return knex.transaction(async (trx) => {
    const run = await trx("runs").where({ id: runId }).forUpdate().first();
    if (!run) throw new Error("Run not found");

    const shop = await ensureShopState(trx, run);

    if (type === "joker") {
      const jokers = JSON.parse(shop.jokers);
      const key = jokers[index];
      if (!key) throw new Error("Invalid joker slot");
      if (run.gold < SHOP_CONFIG.jokerCost) throw new Error("Not enough gold");

      await trx("run_jokers").insert({
        run_id: runId,
        slot_index: Date.now(), // slot assignment handled elsewhere
        joker_key: key,
      });

      jokers.splice(index, 1);

      await trx("runs")
        .where({ id: runId })
        .update({
          gold: run.gold - SHOP_CONFIG.jokerCost,
        });

      await trx("active_shop_state")
        .where({ run_id: runId })
        .update({
          jokers: JSON.stringify(jokers),
          updated_at: trx.fn.now(),
        });
    }

    if (type === "relic") {
      const relics = JSON.parse(shop.relics);
      const key = relics[index];
      if (!key) throw new Error("Invalid relic slot");
      if (run.gold < SHOP_CONFIG.relicCost) throw new Error("Not enough gold");

      await trx("run_relics").insert({
        run_id: runId,
        slot_index: Date.now(),
        relic_key: key,
      });

      relics.splice(index, 1);

      await trx("runs")
        .where({ id: runId })
        .update({
          gold: run.gold - SHOP_CONFIG.relicCost,
        });

      await trx("active_shop_state")
        .where({ run_id: runId })
        .update({
          relics: JSON.stringify(relics),
          updated_at: trx.fn.now(),
        });
    }

    if (type === "enhancement_pack") {
      if (shop.enhancement_packs <= 0) {
        throw new Error("No enhancement packs available");
      }
      if (run.gold < SHOP_CONFIG.enhancementPackCost) {
        throw new Error("Not enough gold");
      }

      await trx("runs")
        .where({ id: runId })
        .update({
          gold: run.gold - SHOP_CONFIG.enhancementPackCost,
        });

      await trx("active_shop_state")
        .where({ run_id: runId })
        .update({
          enhancement_packs: shop.enhancement_packs - 1,
          updated_at: trx.fn.now(),
        });
    }

    return getShopState(runId);
  });
}

// ------------------------------------------------------------
// Reroll jokers
// ------------------------------------------------------------
async function rerollJokers(runId) {
  return knex.transaction(async (trx) => {
    const run = await trx("runs").where({ id: runId }).forUpdate().first();
    if (!run) throw new Error("Run not found");

    const shop = await ensureShopState(trx, run);
    if (run.gold < shop.reroll_cost) throw new Error("Not enough gold");

    const jokers = pickFromPool(
      JOKER_POOL,
      run.seed + Date.now(),
      SHOP_CONFIG.jokerSlots,
    );

    await trx("runs")
      .where({ id: runId })
      .update({
        gold: run.gold - shop.reroll_cost,
      });

    await trx("active_shop_state")
      .where({ run_id: runId })
      .update({
        jokers: JSON.stringify(jokers),
        reroll_cost: shop.reroll_cost + 1,
        updated_at: trx.fn.now(),
      });

    return getShopState(runId);
  });
}

module.exports = {
  getShopState,
  buyItem,
  rerollJokers,
};
