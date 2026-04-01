import { demoRunState, addRandomCard } from "../state/demoRunState";

export const startRun = async () => demoRunState;

export const hit = async () => {
  addRandomCard();
  demoRunState.blind.accumulated_score += 5;
  return demoRunState;
};

export const stay = async () => {
  demoRunState.blind.hands_played += 1;
  return demoRunState;
};

export const split = async () => {
  demoRunState.hands.push({
    cards: [...demoRunState.hands[0].cards],
  });
  return demoRunState;
};

export const doubleDown = async () => {
  demoRunState.gold -= 2;
  addRandomCard();
  return demoRunState;
};
