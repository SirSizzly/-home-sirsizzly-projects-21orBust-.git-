const knex = require("../data/db/knex");
const { generateSeed, generateDeck } = require("../utils/deckGenerator");

async function startRun() {
  const seed = generateSeed();
  const deck = generateDeck(seed);

  return await knex.transaction(async (trx) => {
    // Insert run
    const [run] = await trx("runs")
      .insert({
        seed,
        next_position: 0,
        created_at: trx.fn.now(),
      })
      .returning("*");

    // Insert deck cards
    const deckRows = deck.map((card, index) => ({
      run_id: run.id,
      position: index,
      card_id: card.id,
      suit: card.suit,
      rank: card.rank,
      value: card.value,
      image_key: card.image_key,
    }));

    await trx("deck_cards").insert(deckRows);

    return {
      ...run,
      deck,
    };
  });
}

async function getRun(runId) {
  const run = await knex("runs").where({ id: runId }).first();
  if (!run) return null;

  const deck = await knex("deck_cards")
    .where({ run_id: runId })
    .orderBy("position", "asc");

  const roundState = await knex("round_states")
    .where({ run_id: runId })
    .orderBy("round_number", "desc")
    .first();

  return {
    ...run,
    deck,
    roundState: roundState || null,
  };
}

async function advancePosition(runId, amount = 1) {
  const run = await knex("runs").where({ id: runId }).first();
  if (!run) throw new Error("Run not found");

  const newPos = run.next_position + amount;

  await knex("runs").where({ id: runId }).update({ next_position: newPos });

  return newPos;
}

async function attachRoundState(runId, roundNumber, state) {
  const [row] = await knex("round_states")
    .insert({
      run_id: runId,
      round_number: roundNumber,
      state_json: JSON.stringify(state),
      created_at: knex.fn.now(),
    })
    .returning("*");

  return row;
}

module.exports = {
  startRun,
  getRun,
  advancePosition,
  attachRoundState,
};
