// Client/src/demo/data/demoRandom.js

// ------------------------------
// Generic Random Helpers
// ------------------------------
export function pickOne(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function pickMany(arr, count) {
  const copy = [...arr];
  const result = [];
  for (let i = 0; i < count; i++) {
    if (copy.length === 0) break;
    const idx = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
}

export function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// ------------------------------
// Action Buttons
// ------------------------------
export const actionButtons = {
  hit: "/images/actions/hit_button.png",
  stay: "/images/actions/stay_button.png",
  split: "/images/actions/split_button.png",
  double: "/images/actions/double_down.png",
};

// ------------------------------
// Economy Icons
// ------------------------------
export const economyIcons = {
  gold: "/images/economy/gold_coin.png",
  buy: "/images/economy/buy_button.png",
  reroll: "/images/economy/reroll.png",
  sell: "/images/economy/sell_button.png",
};

// ------------------------------
// Backgrounds
// ------------------------------
export const backgrounds = [
  "/images/backgrounds/velvet_table.png",
  "/images/backgrounds/stone_wall.png",
];

// ------------------------------
// Boss Icons
// ------------------------------
export const bossIcons = [
  "/images/bosses/the_cutter.png",
  "/images/bosses/the_misdeal.png",
  "/images/bosses/the_taxman.png",
  "/images/bosses/the_grinder.png",
  "/images/bosses/the_tightening.png",
  "/images/bosses/the_short_stack.png",
  "/images/bosses/the_dealers_due.png",
  "/images/bosses/the_inflation.png",
  "/images/bosses/the_leak.png",
  "/images/bosses/the_crack_down.png",
  "/images/bosses/the_jammer.png",
  "/images/bosses/the_scramble.png",
  "/images/bosses/the_final_hand.png",
  "/images/bosses/the_overload.png",
  "/images/bosses/the_void.png",
];
