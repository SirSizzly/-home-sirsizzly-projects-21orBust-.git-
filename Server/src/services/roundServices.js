// ------------------------------------------------------------
// roundServices.js — authoritative round engine for 21orBust
// ------------------------------------------------------------
//
// Implements:
// - Full ante/blind loop: Small → Big → Boss per ante
// - Blind targets: Ante 1 = 80/160/320, doubling each ante
// - Boss selection per ante
// - Max 3 hands per blind
// - Round start (deck + initial hand)
// - Hand actions (hit/stay/double/split)
// - Blind resolution and run end
//
// Spec references:
// “A run consists of escalating antes. Each ante contains three blinds: Small Blind, Big Blind, Boss Blind.”
// “Ante 1: 80 → 160 → 320. Scaling: Every blind target doubles from the previous blind indefinitely.”
// “Maximum hands per blind: Default: 3 hands”
// “The player must clear each blind by scoring at least the blind’s required score. Failure ends the run.”
// “If all hands are used and the blind target is not met: The run ends immediately.”
// ------------------------------------------------------------

const knex = require("knex")(require("../../knexfile").development);

const handEngine = require("../engines/handEngine");
const cardEngine = require("../engines/cardEngine");

// ------------------------------------------------------------
// Public API
// ------------------------------------------------------------

async function startRun() {
  return await db.transaction(async (trx) => {
    // From spec:
    // run.gold = 5
    // run.permanentMultiplier = 1.0
    // run.fragileStacks = 0
    // run.anteIndex = 1
    const [run] = await trx("runs")
      .insert({
        gold: 5,
        permanent_multiplier: 1.0,
        fragile_stacks: 0,
        ante_index: 1,
        is_over: false,
      })
      .returning("*");

    // Start first blind: Small Blind of Ante 1
    await startBlind(run.id, "small", trx);

    // Start first round: deck + initial hand
    await startRound(run.id, trx);

    return await loadRunState(run.id, trx);
  });
}

// Start a new round: fresh deck, initial hand, clear active_hand_state
async function startRound(runId, externalTrx = null) {
  const trx = externalTrx || (await db.transaction());

  try {
    const run = await trx("runs").where({ id: runId }).first();
    if (!run) throw new Error("Run not found");
    if (run.is_over) throw new Error("Run is already over");

    // Build a fresh 104‑card deck (2 standard decks combined)
    // “Deck size: 104 cards (2 standard decks combined)”
    const deck = cardEngine.buildDoubleDeck(); // implement in cardEngine
    const shuffledDeck = cardEngine.shuffleDeck(deck, { prng: null });

    // Reset round_states for this run
    await trx("round_states").where({ run_id: runId }).del();

    await trx("round_states").insert({
      run_id: runId,
      deck: JSON.stringify(shuffledDeck),
    });

    // Clear any existing active hands
    await trx("active_hand_state").where({ run_id: runId }).del();

    // Deal initial hand: 2 cards
    const initialCards = shuffledDeck.slice(0, 2);

    await trx("active_hand_state").insert({
      run_id: runId,
      hand_index: 0,
      cards: JSON.stringify(initialCards),
      resolved: false,
      stayed: false,
      busted: false,
      void_border_used: false,
    });

    // Persist remaining deck
    const remainingDeck = shuffledDeck.slice(2);
    await trx("round_states")
      .where({ run_id: runId })
      .update({ deck: JSON.stringify(remainingDeck) });

    if (!externalTrx) await trx.commit();
    return await loadRunState(runId, db);
  } catch (err) {
    if (!externalTrx) await trx.rollback();
    throw err;
  }
}

// Start a blind of given type: "small" | "big" | "boss"
async function startBlind(runId, blindType, trx) {
  const run = await trx("runs").where({ id: runId }).first();
  if (!run) throw new Error("Run not found");

  const anteIndex = run.ante_index;

  // From spec:
  // “Ante 1: 80 → 160 → 320”
  // “Scaling: Every blind target doubles from the previous blind indefinitely”
  const { smallTarget, bigTarget, bossTarget } =
    calculateBlindTargets(anteIndex);

  let targetScore;
  switch (blindType) {
    case "small":
      targetScore = smallTarget;
      break;
    case "big":
      targetScore = bigTarget;
      break;
    case "boss":
      targetScore = bossTarget;
      break;
    default:
      throw new Error("Unknown blind type: " + blindType);
  }

  // Boss selection only for boss blind
  let bossKey = null;
  if (blindType === "boss") {
    bossKey = await selectBossForAnte(anteIndex, trx);
  }

  // Clear any existing active blind
  await trx("active_blind_state").where({ run_id: runId }).del();

  // “Maximum hands per blind: Default: 3 hands”
  await trx("active_blind_state").insert({
    run_id: runId,
    blind_type: blindType,
    target_score: targetScore,
    accumulated_score: 0,
    hands_played: 0,
    boss_key: bossKey,
  });
}

// Resolve current blind: cleared = true/false
async function resolveBlind(runId, cleared, trx) {
  const blind = await trx("active_blind_state")
    .where({ run_id: runId })
    .first();

  if (!blind) return;

  const run = await trx("runs").where({ id: runId }).first();
  if (!run) throw new Error("Run not found");

  const anteIndex = run.ante_index;
  const blindType = blind.blind_type;

  // Remove current blind
  await trx("active_blind_state").where({ run_id: runId }).del();

  if (!cleared) {
    // “The player must clear each blind by scoring at least the blind’s required score. Failure ends the run.”
    // “If all hands are used and the blind target is not met: The run ends immediately.”
    await trx("runs").where({ id: runId }).update({ is_over: true });
    return;
  }

  // Cleared path
  if (blindType === "small") {
    // Small → Big (same ante)
    await startBlind(runId, "big", trx);
    await startRound(runId, trx);
    return;
  }

  if (blindType === "big") {
    // Big → Boss (same ante)
    await startBlind(runId, "boss", trx);
    await startRound(runId, trx);
    return;
  }

  if (blindType === "boss") {
    // Boss cleared → ante++
    await trx("runs")
      .where({ id: runId })
      .update({ ante_index: anteIndex + 1 });

    // New ante starts at Small Blind
    await startBlind(runId, "small", trx);
    await startRound(runId, trx);
    return;
  }
}

// Convenience for routes: full snapshot
async function getRunState(runId) {
  return await loadRunState(runId, db);
}

// ------------------------------------------------------------
// Hand action engine (applyHandAction + helpers)
// ------------------------------------------------------------

async function applyHandAction(runId, handIndex, action) {
  return await db.transaction(async (trx) => {
    const state = await loadRunState(runId, trx);
    if (!state.run) throw new Error("Run not found");
    if (state.run.is_over) throw new Error("Run is already over");

    const hand = state.hands.find((h) => h.hand_index === handIndex);
    if (!hand) throw new Error("Hand not found");

    const engineHand = dbHandToEngineHand(hand);

    await applyActionToHand(engineHand, action, state, trx);

    await writeEngineHand(runId, handIndex, engineHand, trx);

    if (engineHand.resolved) {
      await finalizeHand(runId, handIndex, state, engineHand, trx);
    }

    await updateBlindState(runId, trx);

    return await loadRunState(runId, trx);
  });
}

async function applyActionToHand(engineHand, action, state, trx) {
  const drawCardFn = () => drawCard(state, trx);

  switch (action) {
    case "hit":
      handEngine.hit(engineHand, drawCardFn, state.context);
      break;
    case "stay":
      handEngine.stay(engineHand);
      break;
    case "double":
      handEngine.doubleDown(engineHand, drawCardFn, state.context);
      break;
    case "split":
      await handleSplit(engineHand, state, trx);
      break;
    default:
      throw new Error("Unknown action: " + action);
  }
}

// Split: create a new hand row with next hand_index
async function handleSplit(engineHand, state, trx) {
  const result = handEngine.split(engineHand, state.context);
  if (!result) return;

  const [h1, h2] = result;

  Object.assign(engineHand, h1);

  const newIndex =
    state.hands.length === 0
      ? 0
      : Math.max(...state.hands.map((h) => h.hand_index)) + 1;

  await trx("active_hand_state").insert({
    run_id: state.run.id,
    hand_index: newIndex,
    cards: JSON.stringify(h2.cards),
    resolved: h2.resolved,
    stayed: h2.stayed,
    busted: h2.busted,
    void_border_used: h2.voidBorderUsed,
  });
}

// Finalize a hand: compute score and add to blind
async function finalizeHand(runId, handIndex, state, engineHand, trx) {
  // From spec:
  // “If not busted: base_points = hand_total × 10”
  // “If busted: base_points = 0 (unless modified).”
  const score = scoreHand(engineHand);

  await trx("active_blind_state").where({ run_id: runId }).increment({
    accumulated_score: score,
    hands_played: 1,
  });
}

// Check blind clear/fail after each resolved hand
async function updateBlindState(runId, trx) {
  const blind = await trx("active_blind_state")
    .where({ run_id: runId })
    .first();

  if (!blind) return;

  const { accumulated_score, target_score, hands_played } = blind;

  if (accumulated_score >= target_score) {
    await resolveBlind(runId, true, trx);
    return;
  }

  // “Maximum hands per blind: Default: 3 hands”
  if (hands_played >= 3) {
    await resolveBlind(runId, false, trx);
    return;
  }
}

// Base scoring only (no jokers/relics/fragile yet)
function scoreHand(hand) {
  if (hand.busted) return 0;

  const total = cardEngine.calculateHandTotal(hand.cards, {
    aceUpActive: false,
    scrambleActive: false,
    prng: null,
  });

  return total * 10;
}

// Draw from deck in round_states
async function drawCard(state, trx) {
  const deck = [...state.deck];
  if (deck.length === 0) {
    throw new Error("Deck is empty");
  }

  const card = deck.shift();

  await trx("round_states")
    .where({ run_id: state.run.id })
    .update({ deck: JSON.stringify(deck) });

  state.deck = deck;
  return card;
}

// DB → engine hand mapping
function dbHandToEngineHand(row) {
  return {
    cards: row.cards,
    resolved: row.resolved,
    stayed: row.stayed,
    busted: row.busted,
    blackjack: false,
    hitsTaken: Math.max(0, row.cards.length - 2),
    voidBorderUsed: row.void_border_used,
  };
}

// engine hand → DB writeback
async function writeEngineHand(runId, handIndex, hand, trx) {
  await trx("active_hand_state")
    .where({ run_id: runId, hand_index: handIndex })
    .update({
      cards: JSON.stringify(hand.cards),
      resolved: hand.resolved,
      stayed: hand.stayed,
      busted: hand.busted,
      void_border_used: hand.voidBorderUsed,
    });
}

// ------------------------------------------------------------
// State loading and helpers
// ------------------------------------------------------------

async function loadRunState(runId, client = db) {
  const run = await client("runs").where({ id: runId }).first();
  if (!run) return { run: null };

  const blind = await client("active_blind_state")
    .where({ run_id: runId })
    .first();

  const hands = await client("active_hand_state")
    .where({ run_id: runId })
    .orderBy("hand_index", "asc");

  const roundState = await client("round_states")
    .where({ run_id: runId })
    .first();

  return {
    run,
    blind,
    hands,
    deck: roundState ? roundState.deck : [],
    context: {
      boss: blind?.boss_key || null,
      run: { prng: null },
    },
  };
}

// Blind targets per ante, from spec
function calculateBlindTargets(anteIndex) {
  // “Ante 1: 80 → 160 → 320”
  // “Scaling: Every blind target doubles from the previous blind indefinitely”
  const baseSmall = 80;
  const factor = Math.pow(2, anteIndex - 1);

  const smallTarget = baseSmall * factor;
  const bigTarget = smallTarget * 2;
  const bossTarget = bigTarget * 2;

  return { smallTarget, bigTarget, bossTarget };
}

// Boss selection per ante, using keys from spec
function bossPool() {
  return [
    { key: "boss_cutter", ante: 1 },
    { key: "boss_misdeal", ante: 1 },
    { key: "boss_taxman", ante: 1 },
    { key: "boss_grinder", ante: 2 },
    { key: "boss_tightening", ante: 2 },
    { key: "boss_short_stack", ante: 2 },
    { key: "boss_dealers_due", ante: 3 },
    { key: "boss_inflation", ante: 3 },
    { key: "boss_leak", ante: 3 },
    { key: "boss_crackdown", ante: 4 },
    { key: "boss_jammer", ante: 4 },
    { key: "boss_scramble", ante: 4 },
    { key: "boss_final_hand", ante: 5 },
    { key: "boss_overload", ante: 5 },
    { key: "boss_void", ante: 5 },
  ];
}

async function selectBossForAnte(anteIndex, trx) {
  const pool = bossPool().filter((b) => b.ante === anteIndex);
  if (pool.length === 0) return null;

  // For now, simple RNG; later you can plug in seeded PRNG
  const idx = Math.floor(Math.random() * pool.length);
  return pool[idx].key;
}

// ------------------------------------------------------------
// Exports
// ------------------------------------------------------------

module.exports = {
  startRun,
  startRound,
  startBlind,
  resolveBlind,
  getRunState,
  applyHandAction,
};
