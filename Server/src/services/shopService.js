const knex = require("../data/db/knex");

// ----------------- deterministic helpers -----------------
function deriveShopSeed(seed, roundNumber) {
  // simple deterministic mix, no extra RNG lib
  return Number(seed) + roundNumber * 101;
}

function pickFromPool(pool, baseSeed, index) {
  if (pool.length === 0) return null;
  const idx = Math.abs((baseSeed + index * 17) % pool.length);
  return pool[idx];
}

// ----------------- item pools -----------------
// These are logical item definitions; actual effects will be wired later
const JOKER_POOL = [
  { key: "double_down_joker", name: "Double Down Joker", type: "joker" },
  { key: "safe_hit_joker", name: "Safe Hit Joker", type: "joker" },
  { key: "streak_boost_joker", name: "Streak Boost Joker", type: "joker" },
];

const RELIC_POOL = [
  { key: "second_chance_relic", name: "Second Chance Relic", type: "relic" },
  { key: "ace_shift_relic", name: "Ace Shift Relic", type: "relic" },
  { key: "steady_hand_relic", name: "Steady Hand Relic", type: "relic" },
];

const CARD_BUFF_POOL = [
  { key: "plus_two_buff", name: "+2 Card Buff", type: "card_buff" },
  { key: "plus_three_buff", name: "+3 Card Buff", type: "card_buff" },
];

const CARD_ENHANCER_POOL = [
  {
    key: "sticky_21_enhancer",
    name: "Sticky 21 Enhancer",
    type: "card_enhancer",
  },
  {
    key: "high_roll_enhancer",
    name: "High Roll Enhancer",
    type: "card_enhancer",
  },
];

const CARD_CHANGER_POOL = [
  {
    key: "reroll_card_changer",
    name: "Reroll Card Changer",
    type: "card_changer",
  },
  { key: "suit_swap_changer", name: "Suit Swap Changer", type: "card_changer" },
];

// ----------------- core shop logic -----------------
async function createOrGetShopForRound(runId, roundNumber) {
  // check if shop already exists for this run + round
  let shop = await knex("shops")
    .where({ run_id: runId, round_number: roundNumber })
    .first();

  if (shop) {
    const items = await knex("shop_items")
      .where({ shop_id: shop.id })
      .orderBy("id", "asc");

    return { shop, items };
  }

  // create new shop
  const run = await knex("runs").where({ id: runId }).first();
  if (!run) throw new Error("Run not found");

  const seedBase = deriveShopSeed(run.seed, roundNumber);

  const [createdShop] = await knex("shops")
    .insert({
      run_id: runId,
      round_number: roundNumber,
      seed_offset: seedBase,
      created_at: knex.fn.now(),
    })
    .returning("*");

  const itemsToInsert = [];

  // jokers: 2 slots
  for (let i = 0; i < 2; i++) {
    const joker = pickFromPool(JOKER_POOL, seedBase, i);
    if (joker) {
      itemsToInsert.push({
        shop_id: createdShop.id,
        item_type: joker.type,
        item_key: joker.key,
        name: joker.name,
        price: 50,
        rarity: "rare",
      });
    }
  }

  // relics: 1 slot
  const relic = pickFromPool(RELIC_POOL, seedBase, 100);
  if (relic) {
    itemsToInsert.push({
      shop_id: createdShop.id,
      item_type: relic.type,
      item_key: relic.key,
      name: relic.name,
      price: 75,
      rarity: "epic",
    });
  }

  // card buffs: 1 slot
  const buff = pickFromPool(CARD_BUFF_POOL, seedBase, 200);
  if (buff) {
    itemsToInsert.push({
      shop_id: createdShop.id,
      item_type: buff.type,
      item_key: buff.key,
      name: buff.name,
      price: 25,
      rarity: "common",
    });
  }

  // card enhancers: 1 slot
  const enhancer = pickFromPool(CARD_ENHANCER_POOL, seedBase, 300);
  if (enhancer) {
    itemsToInsert.push({
      shop_id: createdShop.id,
      item_type: enhancer.type,
      item_key: enhancer.key,
      name: enhancer.name,
      price: 40,
      rarity: "uncommon",
    });
  }

  // card changers: 1 slot
  const changer = pickFromPool(CARD_CHANGER_POOL, seedBase, 400);
  if (changer) {
    itemsToInsert.push({
      shop_id: createdShop.id,
      item_type: changer.type,
      item_key: changer.key,
      name: changer.name,
      price: 35,
      rarity: "uncommon",
    });
  }

  if (itemsToInsert.length > 0) {
    await knex("shop_items").insert(itemsToInsert);
  }

  const items = await knex("shop_items")
    .where({ shop_id: createdShop.id })
    .orderBy("id", "asc");

  return { shop: createdShop, items };
}

async function getCurrentShopForRun(runId) {
  const latestRound = await knex("round_states")
    .where({ run_id: runId, is_complete: true })
    .orderBy("round_number", "desc")
    .first();

  if (!latestRound) return null;

  const shop = await knex("shops")
    .where({ run_id: runId, round_number: latestRound.round_number })
    .first();

  if (!shop) return null;

  const items = await knex("shop_items")
    .where({ shop_id: shop.id })
    .orderBy("id", "asc");

  return { shop, items };
}

async function purchaseItem(runId, shopItemId) {
  const shopItem = await knex("shop_items").where({ id: shopItemId }).first();

  if (!shopItem) throw new Error("Shop item not found");

  const shop = await knex("shops").where({ id: shopItem.shop_id }).first();

  if (!shop || shop.run_id !== runId) {
    throw new Error("Shop item does not belong to this run");
  }

  const run = await knex("runs").where({ id: runId }).first();
  if (!run) throw new Error("Run not found");

  // For now, we don't enforce currency; we just record the purchase.
  // Later, you can subtract score or add a dedicated currency.
  await knex("purchases").insert({
    run_id: runId,
    shop_item_id: shopItemId,
    purchased_at: knex.fn.now(),
  });

  // In future: apply effects (relics, jokers, buffs, etc.) here or via dedicated engines.

  return {
    message: "Item purchased",
    item: shopItem,
  };
}

module.exports = {
  createOrGetShopForRound,
  getCurrentShopForRun,
  purchaseItem,
};
