// src/services/roundServices.js
// Blind lifecycle orchestration for 21orBust.
// Owns blind start, clear, fail, and ante progression.

const knex = require("../db/knex");

// ------------------------------------------------------------
// Blind configuration (authoritative defaults)
// ------------------------------------------------------------
const BLIND_CONFIG = {
  small: { target: 80, hands: 3 },
  big: { target: 160, hands: 3 },
  boss: { target: 300, hands: 3 },
};

// ------------------------------------------------------------
// Boss selection (deterministic placeholder)
// Later this will be PRNG + ante-based weighting
// ------------------------------------------------------------
function selectBossForAnte(anteIndex) {
  // Deterministic placeholder
  return "boss_cutter";
}

// ------------------------------------------------------------
// Start a new blind
// ------------------------------------------------------------
async function startBlind(runId, blindType) {
  if (!BLIND_CONFIG[blindType]) {
    throw new Error("Invalid blind type");
  }

  return knex.transaction(async (trx) => {
    const run = await trx("runs").where({ id: runId }).forUpdate().first();
    if (!run) throw new Error("Run not found");

    // Clear any existing blind/hand state
    await trx("active_hand_state").where({ run_id: runId }).del();
    await trx("active_blind_state").where({ run_id: runId }).del();

    const bossKey =
      blindType === "boss" ? selectBossForAnte(run.ante_index) : null;

    await trx("active_blind_state").insert({
      run_id: runId,
      blind_type: blindType,
      target_score: BLIND_CONFIG[blindType].target,
      accumulated_score: 0,
      hands_played: 0,
      boss_key: bossKey,
    });

    return {
      blind_type: blindType,
      target_score: BLIND_CONFIG[blindType].target,
      boss_key: bossKey,
    };
  });
}

// ------------------------------------------------------------
// Resolve blind outcome (called after each hand resolution)
// ------------------------------------------------------------
async function resolveBlind(runId) {
  return knex.transaction(async (trx) => {
    const run = await trx("runs").where({ id: runId }).forUpdate().first();
    if (!run) throw new Error("Run not found");

    const blind = await trx("active_blind_state")
      .where({ run_id: runId })
      .first();

    if (!blind) throw new Error("No active blind");

    const maxHands = BLIND_CONFIG[blind.blind_type].hands;

    // Blind cleared
    if (blind.accumulated_score >= blind.target_score) {
      await trx("runs")
        .where({ id: runId })
        .update({
          ante_index: run.ante_index + 1,
          updated_at: trx.fn.now(),
        });

      await trx("active_hand_state").where({ run_id: runId }).del();
      await trx("active_blind_state").where({ run_id: runId }).del();

      return {
        result: "cleared",
        nextAnte: run.ante_index + 1,
      };
    }

    // Blind failed
    if (blind.hands_played >= maxHands) {
      await trx("runs").where({ id: runId }).update({
        is_complete: true,
        completed_at: trx.fn.now(),
        updated_at: trx.fn.now(),
      });

      return {
        result: "failed",
      };
    }

    // Blind still active
    return {
      result: "ongoing",
      handsRemaining: maxHands - blind.hands_played,
    };
  });
}

module.exports = {
  startBlind,
  resolveBlind,
};
