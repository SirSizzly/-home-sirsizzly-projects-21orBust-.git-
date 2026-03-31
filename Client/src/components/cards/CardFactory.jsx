// CLIENT/src/components/cards/CardFactory.jsx
import React from "react";

import {
  playingCardImages,
  jokerImages,
  relicImages,
  enhancementImages,
  bossImages,
} from "../../assets/cardImages";

import BaseCard from "./BaseCard";
import TooltipCard from "./TooltipCard";

export default function CardFactory({ card }) {
  if (!card) return null;

  // -----------------------------
  // PLAYING CARDS
  // -----------------------------
  if (card.type === "playing_card") {
    const key = card.key || card.code; // backend may use either
    const image = playingCardImages[key];

    return (
      <BaseCard
        image={image}
        rarity="common"
        enhancement={card.enhancementIcon || null}
      />
    );
  }

  // -----------------------------
  // JOKERS
  // -----------------------------
  if (card.type === "joker") {
    const image = jokerImages[card.key];

    return (
      <TooltipCard
        card={{
          image,
          rarity: card.rarity || "rare",
          enhancementIcon: null,
        }}
        tooltip={{
          name: card.name,
          when: card.when,
          effect: card.effect,
          rule: card.rule,
        }}
      />
    );
  }

  // -----------------------------
  // RELICS
  // -----------------------------
  if (card.type === "relic") {
    const image = relicImages[card.key];

    return (
      <TooltipCard
        card={{
          image,
          rarity: "rare",
        }}
        tooltip={{
          name: card.name,
          when: card.when,
          effect: card.effect,
          rule: card.rule,
        }}
      />
    );
  }

  // -----------------------------
  // ENHANCEMENTS
  // -----------------------------
  if (card.type === "enhancement") {
    const image = enhancementImages[card.key];

    return (
      <TooltipCard
        card={{
          image,
          rarity: "uncommon",
        }}
        tooltip={{
          name: card.name,
          when: card.when,
          effect: card.effect,
          rule: card.rule,
        }}
      />
    );
  }

  // -----------------------------
  // BOSS BLINDS
  // -----------------------------
  if (card.type === "boss") {
    const image = bossImages[card.key];

    return (
      <TooltipCard
        card={{
          image,
          rarity: "legendary",
        }}
        tooltip={{
          name: card.name,
          when: "Boss Blind",
          effect: card.effect,
          rule: card.rule,
        }}
      />
    );
  }

  // -----------------------------
  // FALLBACK
  // -----------------------------
  console.warn("Unknown card type:", card);
  return null;
}
