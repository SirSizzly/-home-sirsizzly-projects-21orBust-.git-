import CardView from "./CardView";

export default function HandArea({ hands, onAction }) {
  return (
    <div className="bg-slate-800/60 rounded-lg p-4 border border-slate-700">
      <div className="mb-2 text-sm uppercase tracking-wide text-slate-400">
        Hands
      </div>

      <div className="flex flex-col gap-3">
        {hands.map((hand) => (
          <div
            key={hand.hand_index}
            className="flex items-center justify-between bg-slate-900/60 rounded-md p-3"
          >
            <div className="flex gap-2">
              {hand.cards.map((card, idx) => (
                <CardView key={idx} card={card} />
              ))}
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
        ))}
      </div>
    </div>
  );
}
