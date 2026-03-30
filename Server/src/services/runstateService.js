// src/services/runstateService.js
// Orchestrates run state using the new run-state schema.
// Engines own rules; this service owns DB orchestration and snapshots.

const knex = require("../db/knex");

const {
  createHand,
  hit,
  stay,
  doubleDown,
  split,
  checkAutoBlackjack,
} = require("../engines/handEngine");

const { calculateHandTotal } = require("../engines/cardEngine");
const { scoreHand } = require("../engines/scoringEngine");
const {
  applyFragileOnBust,
  applyFragileOnScore,
  applyFragileReduction,
} = require("../engines/fragileEngine");

// -----------------------------
// DB helpers
// -----------------------------
async function lockRun(trx, runId) {
  const run = await trx("runs").where({ id: runId }).forUpdate().first();
  if (!run) throw new Error("Run not found");
  return run;
}

async function loadInventory(trx, runId) {
  const jokers = await trx("run_jokers")
    .where({ run_id: runId })
    .orderBy("slot_index", "asc");
  const relics = await trx("run_relics")
    .where({ run_id: runId })
    .orderBy("slot_index", "asc");
  return {
    jokers: jokers.map((j) => ({ slot_index: j.slot_index, key: j.joker_key })),
    relics: relics.map((r) => ({ slot_index: r.slot_index, key: r.relic_key })),
  };
}

async function loadActiveBlind(trx, runId) {
  return trx("active_blind_state").where({ run_id: runId }).first();
}

async function loadActiveHands(trx, runId) {
  return trx("active_hand_state")
    .where({ run_id: runId })
    .orderBy("hand_index", "asc");
}

async function drawNextCard(trx, runId) {
  const run = await lockRun(trx, runId);
  const row = await trx("deck_cards")
    .where({ run_id: runId, position: run.next_position })
    .first();
  if (!row) throw new Error("Deck exhausted");

  await trx("runs")
    .where({ id: runId })
    .update({ next_position: run.next_position + 1, updated_at: trx.fn.now() });

  return {
    id: row.card_id,
    suit: row.suit,
    rank: row.rank,
    value: row.value,
    image_key: row.image_key,
    enhancement: null,
  };
}

// -----------------------------
// Ensure resume-safe state
// -----------------------------
async function ensureActiveBlindExists(trx, runId) {
  const blind = await loadActiveBlind(trx, runId);
  if (blind) return blind;

  await trx("active_blind_state").insert({
    run_id: runId,
    blind_type: "small",
    target_score: 80,
    accumulated_score: 0,
    hands_played: 0,
    boss_key: null,
  });

  return loadActiveBlind(trx, runId);
}

async function ensureAtLeastOneHandExists(trx, runId, bossKey) {
  const hands = await loadActiveHands(trx, runId);
  if (hands.length) return hands;

  const h = createHand();
  h.cards.push(await drawNextCard(trx, runId));
  h.cards.push(await drawNextCard(trx, runId));

  checkAutoBlackjack(h, {
    aceUpActive: false,
    scrambleActive: bossKey === "boss_scramble",
    prng: null,
  });

  await trx("active_hand_state").insert({
    run_id: runId,
    hand_index: 0,
    cards: JSON.stringify(h.cards),
    resolved: !!h.resolved,
    stayed: !!h.stayed,
    busted: !!h.busted,
    void_border_used: !!h.voidBorderUsed,
  });

  return loadActiveHands(trx, runId);
}

// -----------------------------
// Snapshot
// -----------------------------
async function getRunState(runId) {
  return knex.transaction(async (trx) => {
    const run = await trx("runs").where({ id: runId }).first();
    if (!run) return null;

    // 🔑 ADDITION: ensure gameplay state exists
    const blind = await ensureActiveBlindExists(trx, runId);
    const hands = await ensureAtLeastOneHandExists(trx, runId, blind.boss_key);

    const inventory = await loadInventory(trx, runId);

    return {
      run: {
        id: run.id,
        seed: run.seed,
        gold: run.gold,
        fragileStacks: run.fragile_stacks,
        permanentMultiplier: run.permanent_multiplier,
        anteIndex: run.ante_index,
        next_position: run.next_position,
        is_complete: !!run.is_complete,
        created_at: run.created_at,
        updated_at: run.updated_at,
        completed_at: run.completed_at || null,
      },
      blind: blind && {
        blind_type: blind.blind_type,
        target_score: blind.target_score,
        accumulated_score: blind.accumulated_score,
        hands_played: blind.hands_played,
        boss_key: blind.boss_key,
      },
      hands: hands.map((h) => ({
        hand_index: h.hand_index,
        cards: Array.isArray(h.cards) ? h.cards : JSON.parse(h.cards),
        resolved: !!h.resolved,
        stayed: !!h.stayed,
        busted: !!h.busted,
        void_border_used: !!h.void_border_used,
      })),
      inventory,
    };
  });
}

// -----------------------------
// Apply a hand action
// -----------------------------
async function applyHandAction(runId, handIndex, action) {
  const allowed = new Set(["hit", "stay", "double", "split"]);
  if (!allowed.has(action)) throw new Error("Invalid action");

  return knex.transaction(async (trx) => {
    const run = await lockRun(trx, runId);
    const blind = await ensureActiveBlindExists(trx, runId);
    await ensureAtLeastOneHandExists(trx, runId, blind.boss_key);

    const inventory = await loadInventory(trx, runId);
    const handsRows = await loadActiveHands(trx, runId);
    const row = handsRows.find((h) => h.hand_index === handIndex);
    if (!row) throw new Error("Hand not found");

    const bossKey = blind.boss_key || null;

    const hand = {
      cards: Array.isArray(row.cards) ? row.cards : JSON.parse(row.cards),
      resolved: !!row.resolved,
      busted: !!row.busted,
      blackjack: false,
      stayed: !!row.stayed,
      hitsTaken: 0,
      voidBorderUsed: !!row.void_border_used,
    };

    const engineRun = {
      gold: run.gold,
      fragileStacks: run.fragile_stacks,
      permanentMultiplier: run.permanent_multiplier,
      jokers: inventory.jokers,
      relics: inventory.relics,
      prng: null,
    };

    const preDraw = async () => drawNextCard(trx, runId);

    if (action === "hit") {
      const card = await preDraw();
      hit(hand, () => card, { boss: bossKey, run: engineRun });
    } else if (action === "stay") {
      stay(hand);
    } else if (action === "double") {
      const card = await preDraw();
      doubleDown(hand, () => card, { boss: bossKey, run: engineRun });
    } else if (action === "split") {
      const result = split(hand, { boss: bossKey, echoSplit: false });
      if (!result) throw new Error("Split not allowed");

      const [h1, h2] = result;
      const nextIndex = Math.max(...handsRows.map((h) => h.hand_index)) + 1;

      await trx("active_hand_state")
        .where({ run_id: runId, hand_index: handIndex })
        .update({
          cards: JSON.stringify(h1.cards),
          resolved: !!h1.resolved,
          stayed: !!h1.stayed,
          busted: !!h1.busted,
          void_border_used: !!h1.voidBorderUsed,
        });

      await trx("active_hand_state").insert({
        run_id: runId,
        hand_index: nextIndex,
        cards: JSON.stringify(h2.cards),
        resolved: !!h2.resolved,
        stayed: !!h2.stayed,
        busted: !!h2.busted,
        void_border_used: !!h2.voidBorderUsed,
      });

      await trx("runs").where({ id: runId }).update({
        gold: engineRun.gold,
        updated_at: trx.fn.now(),
      });

      return getRunState(runId);
    }

    await trx("active_hand_state")
      .where({ run_id: runId, hand_index: handIndex })
      .update({
        cards: JSON.stringify(hand.cards),
        resolved: !!hand.resolved,
        stayed: !!hand.stayed,
        busted: !!hand.busted,
        void_border_used: !!hand.voidBorderUsed,
      });

    await trx("runs").where({ id: runId }).update({
      gold: engineRun.gold,
      updated_at: trx.fn.now(),
    });

    if (hand.resolved) {
      const total = calculateHandTotal(hand.cards, {
        aceUpActive: false,
        scrambleActive: bossKey === "boss_scramble",
        prng: null,
      });

      if (total === 21) hand.blackjack = true;

      const scoringContext = {
        run: {
          permanentMultiplier: engineRun.permanentMultiplier,
          fragileStacks: engineRun.fragileStacks,
        },
        boss: bossKey,
        handTotal: total,
        firstHand: blind.hands_played === 0,
        firstBlackjack: false,
        jokers: inventory.jokers.map((j) => j.key),
        relics: inventory.relics.map((r) => r.key),
        enhancements: hand.cards
          .map((c) => c.enhancement && c.enhancement.key)
          .filter(Boolean),
      };

      const { preFragileScore } = scoreHand(hand, scoringContext);

      if (hand.busted) {
        applyFragileOnBust({
          run: engineRun,
          boss: bossKey,
          jokers: scoringContext.jokers,
          relics: scoringContext.relics,
          enhancements: scoringContext.enhancements,
        });
      } else {
        applyFragileOnScore({ run: engineRun, boss: bossKey });
      }

      const finalScore = applyFragileReduction(
        preFragileScore,
        engineRun.fragileStacks,
      );

      await trx("active_blind_state")
        .where({ run_id: runId })
        .update({
          accumulated_score:
            Number(blind.accumulated_score) + Number(finalScore),
          hands_played: Number(blind.hands_played) + 1,
        });

      await trx("runs").where({ id: runId }).update({
        fragile_stacks: engineRun.fragileStacks,
        permanent_multiplier: engineRun.permanentMultiplier,
        updated_at: trx.fn.now(),
      });
    }

    return getRunState(runId);
  });
}

module.exports = {
  getRunState,
  applyHandAction,
};
