import { useState, useMemo } from "react";
import { demoJokers, demoRelics, demoEnhancements } from "../data/demoShopData";

function pickRandom(arr, count) {
  const copy = [...arr];
  const result = [];
  while (copy.length && result.length < count) {
    const idx = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
}

export default function useShopState() {
  const [gold, setGold] = useState(10);
  const [rerollCost, setRerollCost] = useState(2);
  const [seed, setSeed] = useState(1);

  const { jokers, relics, enhancements } = useMemo(() => {
    // simple seed bump to change selection
    const s = seed;
    const jokers = pickRandom(demoJokers, 3);
    const relics = pickRandom(demoRelics, 2);
    const enhancements = pickRandom(demoEnhancements, 2);
    return { jokers, relics, enhancements };
  }, [seed]);

  function buyItem(type, id) {
    const pool =
      type === "joker" ? jokers : type === "relic" ? relics : enhancements;

    const item = pool.find((i) => i.id === id);
    if (!item) return;
    if (gold < item.cost) return;

    setGold((g) => g - item.cost);
    // later: push into run state / inventory
  }

  function rerollShop() {
    if (gold < rerollCost) return;
    setGold((g) => g - rerollCost);
    setRerollCost((c) => c + 1);
    setSeed((s) => s + 1);
  }

  // mark affordability for UI
  const jokersWithFlag = jokers.map((j) => ({
    ...j,
    affordable: gold >= j.cost,
  }));
  const relicsWithFlag = relics.map((r) => ({
    ...r,
    affordable: gold >= r.cost,
  }));
  const enhancementsWithFlag = enhancements.map((e) => ({
    ...e,
    affordable: gold >= e.cost,
  }));

  return {
    gold,
    rerollCost,
    jokers: jokersWithFlag,
    relics: relicsWithFlag,
    enhancements: enhancementsWithFlag,
    buyItem,
    rerollShop,
  };
}
