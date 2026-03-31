// src/services/shopService.js
// DB orchestration for shop state: get, reroll, buy.

const knex = require("../db/knex");
const { setSeed } = require("../engines/prngEngine");
const { generateShopOffers, rerollCost } = require("../engines/shopEngine");

// Ensure active_shop_state row exists
async function ensureShopState(trx, run) {
  let row = await trx("active_shop_state").where({ run_id: run.id }).first();

  if (row) return row;

  // Seed PRNG from run seed + ante to keep deterministic
  setSeed(run.seed + run.ante_index * 1000);
  const offers = generateShopOffers({ anteIndex: run.ante_index });

  await trx("active_shop_state").insert({
    run_id: run.id,
    offers: JSON.stringify(offers),
    rerolls_used: 0,
  });

  row = await trx("active_shop_state").where({ run_id: run.id }).first();

  return row;
}

async function getShopState(runId) {
  return knex.transaction(async (trx) => {
    const run = await trx("runs").where({ id: runId }).first();
    if (!run) throw new Error("Run not found");

    const row = await ensureShopState(trx, run);

    return {
      run: {
        id: run.id,
        gold: run.gold,
        anteIndex: run.ante_index,
      },
      shop: {
        offers: Array.isArray(row.offers) ? row.offers : JSON.parse(row.offers),
        rerolls_used: row.rerolls_used || 0,
      },
    };
  });
}

async function rerollShop(runId) {
  return knex.transaction(async (trx) => {
    const run = await trx("runs").where({ id: runId }).first();
    if (!run) throw new Error("Run not found");

    const row = await ensureShopState(trx, run);
    const rerollsUsed = row.rerolls_used || 0;

    const cost = rerollCost(run.ante_index, rerollsUsed);
    if (run.gold < cost) {
      throw new Error("Not enough gold to reroll");
    }

    // Charge gold
    await trx("runs")
      .where({ id: run.id })
      .update({
        gold: run.gold - cost,
        updated_at: trx.fn.now(),
      });

    // New offers
    setSeed(run.seed + run.ante_index * 1000 + rerollsUsed + 1);
    const offers = generateShopOffers({ anteIndex: run.ante_index });

    await trx("active_shop_state")
      .where({ run_id: run.id })
      .update({
        offers: JSON.stringify(offers),
        rerolls_used: rerollsUsed + 1,
      });

    return {
      gold: run.gold - cost,
      offers,
      rerolls_used: rerollsUsed + 1,
    };
  });
}

async function buyShopItem(runId, slotIndex) {
  return knex.transaction(async (trx) => {
    const run = await trx("runs").where({ id: runId }).first();
    if (!run) throw new Error("Run not found");

    const row = await ensureShopState(trx, run);
    const offers = Array.isArray(row.offers)
      ? row.offers
      : JSON.parse(row.offers);

    const offer = offers.find((o) => o.slot_index === slotIndex);
    if (!offer) throw new Error("Offer not found");
    if (offer.sold) throw new Error("Already purchased");
    if (run.gold < offer.price) throw new Error("Not enough gold");

    // Charge gold
    await trx("runs")
      .where({ id: run.id })
      .update({
        gold: run.gold - offer.price,
        updated_at: trx.fn.now(),
      });

    // Mark as sold
    offer.sold = true;

    await trx("active_shop_state")
      .where({ run_id: run.id })
      .update({
        offers: JSON.stringify(offers),
      });

    // Apply acquisition to inventory tables
    if (offer.type === "joker") {
      await trx("run_jokers").insert({
        run_id: run.id,
        joker_key: offer.key,
        slot_index: await nextInventorySlot(trx, "run_jokers", run.id),
      });
    } else if (offer.type === "relic") {
      await trx("run_relics").insert({
        run_id: run.id,
        relic_key: offer.key,
        slot_index: await nextInventorySlot(trx, "run_relics", run.id),
      });
    }
    // Enhancements are applied later when chosen for a card

    return {
      gold: run.gold - offer.price,
      offers,
      purchased: offer,
    };
  });
}

async function nextInventorySlot(trx, table, runId) {
  const rows = await trx(table)
    .where({ run_id: runId })
    .orderBy("slot_index", "asc");

  if (!rows.length) return 0;
  return rows[rows.length - 1].slot_index + 1;
}

module.exports = {
  getShopState,
  rerollShop,
  buyShopItem,
};
