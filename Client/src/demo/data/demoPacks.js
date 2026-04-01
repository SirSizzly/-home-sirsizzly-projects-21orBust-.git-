// Client/src/demo/data/demoPacks.js

import { demoEnhancements } from "./demoEnhancements";

// Utility: pick N random items from an array
function pickRandom(arr, count) {
  const copy = [...arr];
  const result = [];
  for (let i = 0; i < count; i++) {
    if (copy.length === 0) break;
    const idx = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
}

export function generateDemoPack() {
  return {
    id: "enh_pack_" + Date.now(),
    name: "Enhancement Pack",
    price: 3,
    image: "/images/enhancements/pack.png",

    // Random 3 enhancement options
    options: pickRandom(demoEnhancements, 3),
  };
}
