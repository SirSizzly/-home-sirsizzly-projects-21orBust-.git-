// Server/src/engines/handEngine.js
// Authoritative hand lifecycle engine for 21orBust.
// No DB, no UI, no side effects — pure game logic.
// All card math is delegated to cardEngine.

const {
  calculateHandTotal,
  hasVoidBorder,
  cloneCard,
} = require("./cardEngine");

// ------------------------------------------------------------
// Hand Factory
// ------------------------------------------------------------
function createHand() {
  return {
    cards: [],
    resolved: false,
    stayed: false,
    busted: false,
    blackjack: false,
    hitsTaken: 0,
    voidBorderUsed: false,
  };
}

// ------------------------------------------------------------
// Auto-blackjack check (after initial deal)
// ------------------------------------------------------------
function checkAutoBlackjack(hand, context) {
  if (hand.cards.length !== 2) return;

  const total = calculateHandTotal(hand.cards, context);
  if (total === 21) {
    hand.blackjack = true;
    hand.resolved = true;
    hand.stayed = true;
  }
}

// ------------------------------------------------------------
// Boss rule helpers
// ------------------------------------------------------------
function bossRestrictsHit(bossKey, hand) {
  if (!bossKey) return false;

  // The Tightening: max 2 hits
  if (bossKey === "the_tightening" && hand.hitsTaken >= 2) {
    return true;
  }

  // The Jammer: cannot hit if total >= 17
  if (bossKey === "the_jammer") {
    const total = calculateHandTotal(hand.cards, {
      aceUpActive: false,
      scrambleActive: false,
      prng: null,
    });
    return total >= 17;
  }

  return false;
}

function bossRestrictsSplit(bossKey) {
  return bossKey === "the_crack_down"; // No splits allowed
}

// ------------------------------------------------------------
// HIT
// ------------------------------------------------------------
function hit(hand, drawCardFn, context) {
  if (hand.resolved || hand.stayed) return;

  if (bossRestrictsHit(context.boss, hand)) {
    return; // Illegal hit, do nothing
  }

  const card = drawCardFn();
  hand.cards.push(card);
  hand.hitsTaken++;

  const total = calculateHandTotal(hand.cards, {
    aceUpActive: false,
    scrambleActive: context.boss === "boss_scramble",
    prng: context.run.prng,
  });

  if (total > 21) {
    // Void Border protection
    const hasVB = hand.cards.some((c) => hasVoidBorder(c));
    if (hasVB && !hand.voidBorderUsed) {
      hand.voidBorderUsed = true;
      // downgrade Ace if possible
      const downgraded = calculateHandTotal(hand.cards, {
        aceUpActive: true,
        scrambleActive: context.boss === "boss_scramble",
        prng: context.run.prng,
      });
      if (downgraded <= 21) return;
    }

    hand.busted = true;
    hand.resolved = true;
    return;
  }

  if (total === 21) {
    hand.stayed = true;
    hand.resolved = true;
  }
}

// ------------------------------------------------------------
// STAY
// ------------------------------------------------------------
function stay(hand) {
  if (hand.resolved) return;
  hand.stayed = true;
  hand.resolved = true;
}

// ------------------------------------------------------------
// DOUBLE DOWN
// ------------------------------------------------------------
function doubleDown(hand, drawCardFn, context) {
  if (hand.resolved || hand.stayed) return;

  // Double down = one forced hit + stay
  const card = drawCardFn();
  hand.cards.push(card);
  hand.hitsTaken++;

  const total = calculateHandTotal(hand.cards, {
    aceUpActive: false,
    scrambleActive: context.boss === "boss_scramble",
    prng: context.run.prng,
  });

  if (total > 21) {
    const hasVB = hand.cards.some((c) => hasVoidBorder(c));
    if (hasVB && !hand.voidBorderUsed) {
      hand.voidBorderUsed = true;
      const downgraded = calculateHandTotal(hand.cards, {
        aceUpActive: true,
        scrambleActive: context.boss === "boss_scramble",
        prng: context.run.prng,
      });
      if (downgraded <= 21) {
        hand.stayed = true;
        hand.resolved = true;
        return;
      }
    }

    hand.busted = true;
    hand.resolved = true;
    return;
  }

  hand.stayed = true;
  hand.resolved = true;
}

// ------------------------------------------------------------
// SPLIT
// ------------------------------------------------------------
function split(hand, context) {
  if (hand.resolved || hand.stayed) return null;
  if (bossRestrictsSplit(context.boss)) return null;

  if (hand.cards.length !== 2) return null;
  if (hand.cards[0].rank !== hand.cards[1].rank) return null;

  // Create two new hands
  const h1 = createHand();
  const h2 = createHand();

  h1.cards.push(cloneCard(hand.cards[0]));
  h2.cards.push(cloneCard(hand.cards[1]));

  return [h1, h2];
}

module.exports = {
  createHand,
  checkAutoBlackjack,
  hit,
  stay,
  doubleDown,
  split,
};
