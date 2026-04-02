// Server/src/services/shopService.js
const knex = require("knex")(require("../../knexfile").development);

const { setSeed } = require("../engines/prngEngine");
const { generateShopOffers, rerollCost } = require("../engines/shopEngine");

function toClientShopState(run, offers, rerollsUsed, extra = {}) {
  const jokers = offers.filter((o) => o.type === "joker");
  const relic = offers.find((o) => o.type === "relic") || null;
  const pack = offers.find((o) => o.type === "enhancement_pack") || null;

  return {
    gold: run.gold,
    jokers,
    relic,
    pack,
    rerolls_used: rerollsUsed || 0,
    ...extra,
  };
}

async function ensureShopState(trx, run) {
  let row = await trx("active_shop_state").where({ run_id: run.id }).first();

  if (row) return row;

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
    const offers = Array.isArray(row.offers)
      ? row.offers
      : JSON.parse(row.offers);

    return toClientShopState(run, offers, row.rerolls_used);
  });
}

async function rerollShop(runId) {
  return knex.transaction(async (trx) => {
    const run = await trx("runs").where({ id: runId }).first();
    if (!run) throw new Error("Run not found");

    const row = await ensureShopState(trx, run);
    const rerollsUsed = row.rerolls_used || 0;

    const cost = rerollCost(run.ante_index, rerollsUsed);
    if (run.gold < cost) throw new Error("Not enough gold to reroll");

    const newGold = run.gold - cost;

    await trx("runs").where({ id: run.id }).update({
      gold: newGold,
      updated_at: trx.fn.now(),
    });

    setSeed(run.seed + run.ante_index * 1000 + rerollsUsed + 1);
    const offers = generateShopOffers({ anteIndex: run.ante_index });

    await trx("active_shop_state")
      .where({ run_id: run.id })
      .update({
        offers: JSON.stringify(offers),
        rerolls_used: rerollsUsed + 1,
      });

    return toClientShopState(
      { ...run, gold: newGold },
      offers,
      rerollsUsed + 1,
    );
  });
}

async function buyShopItem(runId, type, index) {
  return knex.transaction(async (trx) => {
    const run = await trx("runs").where({ id: runId }).first();
    if (!run) throw new Error("Run not found");

    const row = await ensureShopState(trx, run);
    const offers = Array.isArray(row.offers)
      ? row.offers
      : JSON.parse(row.offers);

    if (type === "choose_enhancement") {
      // Stub: you can wire enhancement choice later
      return toClientShopState(run, offers, row.rerolls_used);
    }

    let offer;
    if (type === "joker" && typeof index === "number") {
      offer = offers.filter((o) => o.type === "joker")[index];
    } else if (type === "relic") {
      offer = offers.find((o) => o.type === "relic");
    } else if (type === "enhancement_pack") {
      offer = offers.find((o) => o.type === "enhancement_pack");
    }

    if (!offer) throw new Error("Offer not found");
    if (offer.sold) throw new Error("Already purchased");
    if (run.gold < offer.price) throw new Error("Not enough gold");

    const newGold = run.gold - offer.price;

    await trx("runs").where({ id: run.id }).update({
      gold: newGold,
      updated_at: trx.fn.now(),
    });

    offer.sold = true;

    await trx("active_shop_state")
      .where({ run_id: run.id })
      .update({
        offers: JSON.stringify(offers),
      });

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

    return toClientShopState(
      { ...run, gold: newGold },
      offers,
      row.rerolls_used,
    );
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
