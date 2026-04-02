// Client/src/components/Hand.jsx

import CardView from "./game/CardView";

export default function Hand({ hand, onAction }) {
  return (
    <div className="flex items-center justify-between bg-slate-900/60 rounded-md p-3">
      <div className="flex gap-2">
        {hand.cards.map((card, idx) => (
          <CardView
            key={`${hand.hand_index}-${card.id}-${card.image_key}-${idx}`}
            card={card}
          />
        ))}
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="text-sm text-slate-300">
          Hand {hand.hand_index} — {hand.status?.toUpperCase() || "ACTIVE"}
        </div>

        <div className="flex gap-2 text-xs">
          <button
            onClick={() => onAction(hand.hand_index, "hit")}
            className="px-2 py-1 bg-emerald-600 rounded"
          >
            Hit
          </button>

          <button
            onClick={() => onAction(hand.hand_index, "stay")}
            className="px-2 py-1 bg-sky-600 rounded"
          >
            Stay
          </button>

          <button
            onClick={() => onAction(hand.hand_index, "double")}
            className="px-2 py-1 bg-amber-600 rounded"
          >
            Double
          </button>

          <button
            onClick={() => onAction(hand.hand_index, "split")}
            className="px-2 py-1 bg-fuchsia-600 rounded"
          >
            Split
          </button>
        </div>
      </div>
    </div>
  );
}
