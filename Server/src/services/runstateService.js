const knex = require("../data/db/knex");

async function getRunState(runId) {
  const run = await knex("runs").where({ id: runId }).first();
  if (!run) return null;

  const roundState = await knex("round_states")
    .where({ run_id: runId })
    .orderBy("round_number", "desc")
    .first();

  let hands = [];
  if (roundState) {
    hands = await knex("round_hands")
      .where({ round_state_id: roundState.id })
      .orderBy("hand_index", "asc");
  }

  const deckPosition = run.next_position;

  return {
    run: {
      id: run.id,
      seed: run.seed,
      score: run.score || 0,
      streak: run.streak || 0,
      next_position: run.next_position,
      is_complete: !!run.is_complete,
      created_at: run.created_at,
      updated_at: run.updated_at,
      completed_at: run.completed_at || null,
    },
    round: roundState
      ? {
          id: roundState.id,
          round_number: roundState.round_number,
          is_complete: !!roundState.is_complete,
          round_score: roundState.round_score || 0,
          streak_bonus: roundState.streak_bonus || 0,
          results: roundState.results_json
            ? JSON.parse(roundState.results_json)
            : null,
        }
      : null,
    hands,
    deckPosition,
  };
}

module.exports = {
  getRunState,
};
