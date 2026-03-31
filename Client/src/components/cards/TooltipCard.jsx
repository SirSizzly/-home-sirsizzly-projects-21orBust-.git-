// CLIENT/src/components/cards/TooltipCard.jsx
import Tooltip from "../Tooltip";
import BaseCard from "./BaseCard";

export default function TooltipCard({ card, tooltip }) {
  return (
    <Tooltip content={tooltip}>
      <BaseCard
        image={card.image}
        rarity={card.rarity}
        enhancement={card.enhancementIcon}
      />
    </Tooltip>
  );
}
