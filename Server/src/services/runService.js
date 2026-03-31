// src/services/runService.js
// Run lifecycle only: create, fetch, complete.
// No hand/blind/shop resolution lives here.

const knex = require("../db/knex");
const { generateSeed, generateDeck } = require("../utils/deckGenerator");

/**
 * Start a new run:
 * - generate deterministic seed
 * - generate full 104-card deck from that seed
 * - persist run row
 * - persist deck_cards rows
 * - initialize run_stats row
 *
 * Blind/hand state is created lazily by runstateService.
 */
async function startRun() {
  const seed = generateSeed();
  const deck = generateDeck(seed);

  return knex.transaction(async (trx) => {
    // Create run
    const [run] = await trx("runs")
      .insert({
        seed,
        next_position: 0,
        gold: 5,
        fragile_stacks: 0,
        permanent_multiplier: 0,
        ante_index: 1,
        is_complete: false,
        created_at: trx.fn.now(),
        updated_at: trx.fn.now(),
      })
      .returning("*");

    // Persist deck into deck_cards
    const deckRows = deck.map((card, index) => ({
      run_id: run.id,
      position: index, // 0–103
      card_id: card.id,
      suit: card.suit,
      rank: card.rank,
      value: card.value,
      image_key: card.image_key,
    }));

    await trx("deck_cards").insert(deckRows);

    // Initialize run_stats
    await trx("run_stats").insert({
      run_id: run.id,
      highest_ante: 0,
      total_score: 0,
      hands_played: 0,
      blackjacks: 0,
      busts: 0,
    });

    // Return canonical run DTO
    return {
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
    };
  });
}

/**
 * Fetch a single run plus its stats.
 */
async function getRun(runId) {
  const run = await knex("runs").where({ id: runId }).first();
  if (!run) return null;

  const stats = await knex("run_stats").where({ run_id: runId }).first();

  return {
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
    stats: stats || null,
  };
}

/**
 * Mark a run as complete.
 */
async function completeRun(runId) {
  const run = await knex("runs").where({ id: runId }).first();
  if (!run) throw new Error("Run not found");

  await knex("runs").where({ id: runId }).update({
    is_complete: true,
    completed_at: knex.fn.now(),
    updated_at: knex.fn.now(),
  });

  return true;
}

module.exports = {
  startRun,
  getRun,
  completeRun,
};
