// Client/src/demo/state/demoRunState.js

import { demoCards } from "../data/demoCards";

// Utility: pick a random card image
function randomCardImage() {
  return demoCards[Math.floor(Math.random() * demoCards.length)];
}

// Utility: create a new card object
function createCard() {
  return {
    id: Date.now() + Math.random(),
    image: randomCardImage(),
  };
}

// INITIAL DEMO RUN STATE
export let demoRunState = {
  runId: 1,
  gold: 10,

  blind: {
    blind_type: "Small Blind",
    target_score: 80,
    accumulated_score: 0,
    hands_played: 0,
  },

  fragile: 0,

  hands: [
    {
      cards: [createCard(), createCard()],
    },
  ],
};

// Reset run (used when restarting demo)
export function resetDemoRun() {
  demoRunState = {
    runId: 1,
    gold: 10,

    blind: {
      blind_type: "Small Blind",
      target_score: 80,
      accumulated_score: 0,
      hands_played: 0,
    },

    fragile: 0,

    hands: [
      {
        cards: [createCard(), createCard()],
      },
    ],
  };

  return demoRunState;
}

// Add a random card to the first hand
export function addRandomCard() {
  demoRunState.hands[0].cards.push(createCard());
}

// Split the first hand
export function splitHand() {
  const original = demoRunState.hands[0];
  demoRunState.hands.push({
    cards: [
      ...original.cards.map((c) => ({ ...c, id: Date.now() + Math.random() })),
    ],
  });
}

// Double down
export function doubleDownAction() {
  demoRunState.gold = Math.max(0, demoRunState.gold - 2);
  addRandomCard();
}

// Advance to next blind (optional for demo)
export function nextBlind() {
  const current = demoRunState.blind;

  const nextTarget = current.target_score * 2;
  const nextName =
    current.blind_type === "Small Blind"
      ? "Big Blind"
      : current.blind_type === "Big Blind"
        ? "Boss Blind"
        : "Small Blind";

  demoRunState.blind = {
    blind_type: nextName,
    target_score: nextTarget,
    accumulated_score: 0,
    hands_played: 0,
  };

  // Reset hands
  demoRunState.hands = [
    {
      cards: [createCard(), createCard()],
    },
  ];
}
