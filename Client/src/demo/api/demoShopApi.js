import { demoShopState, generateDemoShopState } from "../state/demoShopState";

export const getShop = async () => demoShopState;

export const buyItem = async (type, index = 0) => {
  if (type === "joker") {
    demoShopState.gold -= demoShopState.jokers[index].price;
  }
  if (type === "relic") {
    demoShopState.gold -= demoShopState.relics[index].price;
  }
  if (type === "pack") {
    demoShopState.gold -= demoShopState.packs[index].price;
  }
  return demoShopState;
};

// NEW: REROLL SHOP
export const rerollShop = async () => {
  demoShopState.jokers = generateDemoShopState().jokers;
  demoShopState.packs = generateDemoShopState().packs;
  return demoShopState;
};
