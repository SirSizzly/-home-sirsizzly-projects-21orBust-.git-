const knex = require("../data/db/knex");
const roundService = require("./roundService");
const shopService = require("./shopService");
const modifierService = require("./modifierService");

// ----------------- scoring helpers -----------------
function scoreHand(hand) {
  if (hand.total > 21) {
    return {
      result: "bust",
      score: 0,
      multiplier: 0,
    };
  }

  const cards = JSON.parse(hand.cards);

  if (hand.total === 21 && cards.length === 2) {
    return {
      result: "blackjack",
      score: 50,
      multiplier: 2,
    };
  }

  return {
    result: "normal",
    score: hand.total,
    multiplier: 1,
  };
}

function scoreRoundBase(hands) {
  let totalScore = 0;
  let streakBonus = 0;
  let handResults = [];
  let allBust = true;

  for (const hand of hands) {
    const result = scoreHand(hand);
    handResults.push({ hand_index: hand.hand_index, ...result });

    totalScore += result.score * result.multiplier;

    if (result.result === "blackjack") streakBonus += 25;
    if (result.result !== "bust") allBust = false;
  }

  return {
    totalScore,
    streakBonus,
    handResults,
    allBust,
  };
}

// ----------------- apply round results -----------------
async function applyRoundResults(runId, roundStateId) {
  return knex.transaction(async (trx) => {
    const hands = await trx("round_hands")
      .where({ round_state_id: roundStateId })
      .orderBy("hand_index", "asc");

    if (hands.length === 0) {
      throw new Error("No hands found for round");
    }

    const baseScoring = scoreRoundBase(hands);

    // apply jokers, relics, card buffs/enhancers/changers
    const scoring = await modifierService.applyScoringModifiers(runId, {
      hands,
      ...baseScoring,
    });

    const run = await trx("runs").where({ id: runId }).first();
    if (!run) throw new Error("Run not found");

    const prevScore = run.score || 0;
    const prevStreak = run.streak || 0;

    const newScore = prevScore + scoring.totalScore + scoring.streakBonus;
    const newStreak = scoring.allBust ? 0 : prevStreak + 1;

    const runUpdate = {
      score: newScore,
      streak: newStreak,
      updated_at: trx.fn.now(),
    };

    if (scoring.allBust) {
      runUpdate.is_complete = true;
      runUpdate.completed_at = trx.fn.now();
    }

    await trx("runs").where({ id: runId }).update(runUpdate);

    await trx("round_states")
      .where({ id: roundStateId })
      .update({
        is_complete: true,
        round_score: scoring.totalScore,
        streak_bonus: scoring.streakBonus,
        results_json: JSON.stringify(scoring.handResults),
      });

    return {
      scoring,
      newScore,
      newStreak,
      runEnded: !!runUpdate.is_complete,
    };
  });
}

// ----------------- complete round and open shop -----------------
async function nextRound(runId) {
  const current = await roundService.getCurrentRound(runId);

  if (!current) {
    const first = await roundService.startRound(runId);
    return {
      message: "Started first round",
      runEnded: false,
      scoring: null,
      shop: null,
      nextRound: first,
    };
  }

  const { roundState, hands } = current;

  if (!hands.every((h) => h.is_finished)) {
    throw new Error("Cannot advance — round still in progress");
  }

  const result = await applyRoundResults(runId, roundState.id);

  if (result.runEnded) {
    return {
      message: "Run ended after this round",
      scoring: result.scoring,
      runEnded: true,
      shop: null,
      nextRound: null,
    };
  }

  const shop = await shopService.createOrGetShopForRound(
    runId,
    roundState.round_number,
  );

  return {
    message: "Round complete, shop available",
    scoring: result.scoring,
    runEnded: false,
    shop,
    nextRound: null,
  };
}

// ----------------- explicit end run -----------------
async function endRun(runId) {
  const run = await knex("runs").where({ id: runId }).first();
  if (!run) throw new Error("Run not found");

  if (run.is_complete) {
    return {
      message: "Run already complete",
      finalScore: run.score || 0,
      streak: run.streak || 0,
    };
  }

  await knex("runs").where({ id: runId }).update({
    is_complete: true,
    completed_at: knex.fn.now(),
    updated_at: knex.fn.now(),
  });

  const updated = await knex("runs").where({ id: runId }).first();

  return {
    message: "Run complete",
    finalScore: updated.score || 0,
    streak: updated.streak || 0,
  };
}

module.exports = {
  scoreHand,
  scoreRoundBase,
  applyRoundResults,
  nextRound,
  endRun,
};
