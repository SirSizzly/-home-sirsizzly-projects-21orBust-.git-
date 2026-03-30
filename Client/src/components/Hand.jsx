export default function Hand({ hand, onAction }) {
  return (
    <div className="hand">
      <div className="hand-header">
        Hand {hand.hand_index}
        {hand.busted && " — BUST"}
        {hand.stayed && " — STAY"}
      </div>

      <div className="cards">
        {hand.cards.map((card, i) => (
          <span key={i} className="card">
            {card.rank} {card.suit}
          </span>
        ))}
      </div>

      {!hand.resolved && (
        <div className="actions">
          <button onClick={() => onAction(hand.hand_index, "hit")}>Hit</button>
          <button onClick={() => onAction(hand.hand_index, "stay")}>
            Stay
          </button>
          <button onClick={() => onAction(hand.hand_index, "double")}>
            Double
          </button>
          <button onClick={() => onAction(hand.hand_index, "split")}>
            Split
          </button>
        </div>
      )}
    </div>
  );
}
