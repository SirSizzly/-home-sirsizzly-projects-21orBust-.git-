// src/services/runprogressionService.js
// Handles blind progression, ante advancement, and boss rotation.
// Pure orchestration: DB + blindEngine + runstateService.

const knex = require("knex")(require("../../knexfile").development);

const {
  createBlindState,
  applyHandScoreToBlind,
  evaluateBlindOutcome,
  getBossByKey,
  BOSS_BLINDS,
} = require("../engines/blindEngine");

// Boss rotation order (deterministic)
const BOSS_ORDER = [
  "the_crack_down",
  "the_tightening",
  "the_jammer",
  "the_taxman",
  "the_grinder",
  "boss_scramble",
];

// ------------------------------------------------------------
// Advance to next blind (small → big → boss → next ante)
// ------------------------------------------------------------
async function advanceBlind(trx, run) {
  const currentBlind = await trx("active_blind_state")
    .where({ run_id: run.id })
    .first();

  let nextBlindType = "small";
  let nextBossKey = null;
  let nextAnte = run.ante_index;

  if (!currentBlind) {
    // First blind of the run
    nextBlindType = "small";
  } else if (currentBlind.blind_type === "small") {
    nextBlindType = "big";
  } else if (currentBlind.blind_type === "big") {
    nextBlindType = "boss";
    nextBossKey = pickNextBoss(run);
  } else if (currentBlind.blind_type === "boss") {
    // Completed full cycle → next ante
    nextAnte = run.ante_index + 1;
    nextBlindType = "small";
  }

  const newBlind = createBlindState({
    blindType: nextBlindType,
    anteIndex: nextAnte,
    bossKey: nextBossKey,
  });

  // Replace blind row
  await trx("active_blind_state").where({ run_id: run.id }).del();

  await trx("active_blind_state").insert({
    run_id: run.id,
    blind_type: newBlind.blind_type,
    target_score: newBlind.target_score,
    accumulated_score: newBlind.accumulated_score,
    hands_played: newBlind.hands_played,
    boss_key: newBlind.boss_key,
  });

  // Update run ante
  await trx("runs").where({ id: run.id }).update({
    ante_index: nextAnte,
    updated_at: trx.fn.now(),
  });

  return newBlind;
}

// ------------------------------------------------------------
// Boss rotation (deterministic)
// ------------------------------------------------------------
function pickNextBoss(run) {
  const index = (run.ante_index - 1) % BOSS_ORDER.length;
  return BOSS_ORDER[index];
}

// ------------------------------------------------------------
// Apply score to blind and evaluate outcome
// ------------------------------------------------------------
async function applyScoreAndEvaluate(runId, handScore) {
  return knex.transaction(async (trx) => {
    const run = await trx("runs").where({ id: runId }).first();
    if (!run) throw new Error("Run not found");

    const blind = await trx("active_blind_state")
      .where({ run_id: runId })
      .first();

    if (!blind) throw new Error("Blind state missing");

    // Apply score
    const updatedBlind = applyHandScoreToBlind(blind, handScore);

    await trx("active_blind_state").where({ run_id: runId }).update({
      accumulated_score: updatedBlind.accumulated_score,
      hands_played: updatedBlind.hands_played,
    });

    // Evaluate outcome
    const outcome = evaluateBlindOutcome(updatedBlind);

    if (outcome.cleared) {
      const nextBlind = await advanceBlind(trx, run);

      // Clear active hands for next blind
      await trx("active_hand_state").where({ run_id: runId }).del();

      return {
        status: "cleared",
        nextBlind,
      };
    }

    if (outcome.failed) {
      // Mark run as complete (loss)
      await trx("runs").where({ id: runId }).update({
        is_complete: true,
        completed_at: trx.fn.now(),
        updated_at: trx.fn.now(),
      });

      return {
        status: "failed",
        nextBlind: null,
      };
    }

    return {
      status: "in_progress",
      nextBlind: null,
    };
  });
}

module.exports = {
  applyScoreAndEvaluate,
  advanceBlind,
  pickNextBoss,
};
