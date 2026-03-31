// Server/src/engines/blindEngine.js
// Blind lifecycle + boss blind logic for 21orBust.
// No DB, no UI — pure rules.

//
// Blind types (small, big, boss) and their defaults
//
const BLIND_CONFIG = {
  small: {
    baseTarget: 80,
    handsAllowed: 5,
  },
  big: {
    baseTarget: 140,
    handsAllowed: 5,
  },
  boss: {
    baseTarget: 200,
    handsAllowed: 6,
  },
};

//
// Boss blind definitions
//
const BOSS_BLINDS = {
  the_crack_down: {
    key: "the_crack_down",
    type: "boss",
    description: "No splits allowed.",
  },
  the_tightening: {
    key: "the_tightening",
    type: "boss",
    description: "Max 2 hits per hand.",
  },
  the_jammer: {
    key: "the_jammer",
    type: "boss",
    description: "Cannot hit at 17 or more.",
  },
  the_taxman: {
    key: "the_taxman",
    type: "boss",
    description: "Reduces points by 20%.",
  },
  the_grinder: {
    key: "the_grinder",
    type: "boss",
    description: "Reduces multiplier by 1.",
  },
  the_scramble: {
    key: "boss_scramble",
    type: "boss",
    description: "Randomizes suits when scoring.",
  },
};

//
// Create a new blind state
//
function createBlindState({ blindType, anteIndex, bossKey = null }) {
  const cfg = BLIND_CONFIG[blindType] || BLIND_CONFIG.small;

  // Scale target by ante
  const target = cfg.baseTarget + (anteIndex - 1) * 20;

  return {
    blind_type: blindType,
    target_score: target,
    accumulated_score: 0,
    hands_played: 0,
    boss_key: bossKey,
  };
}

//
// Apply score from a resolved hand to the blind
//
function applyHandScoreToBlind(blindState, handScore) {
  const updated = { ...blindState };

  updated.accumulated_score =
    Number(updated.accumulated_score) + Number(handScore);
  updated.hands_played = Number(updated.hands_played) + 1;

  return updated;
}

//
// Check if blind is cleared or failed
//
function evaluateBlindOutcome(blindState) {
  const cfg = BLIND_CONFIG[blindState.blind_type] || BLIND_CONFIG.small;

  const cleared = blindState.accumulated_score >= blindState.target_score;
  const failed = !cleared && blindState.hands_played >= cfg.handsAllowed;

  return {
    cleared,
    failed,
    inProgress: !cleared && !failed,
  };
}

//
// Get boss metadata by key
//
function getBossByKey(key) {
  if (!key) return null;
  return BOSS_BLINDS[key] || null;
}

module.exports = {
  BLIND_CONFIG,
  BOSS_BLINDS,
  createBlindState,
  applyHandScoreToBlind,
  evaluateBlindOutcome,
  getBossByKey,
};
