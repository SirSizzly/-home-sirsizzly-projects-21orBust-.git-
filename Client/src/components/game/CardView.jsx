// Client/src/components/game/CardView.jsx

export default function CardView({ card }) {
  const src = `http://localhost:5173/images/cards/${card.image_key}.png`;

  return (
    <div className="w-12 h-16 rounded-md overflow-hidden border border-slate-600 bg-slate-900 relative">
      <img src={src} alt={card.rank} className="w-full h-full object-cover" />
    </div>
  );
}
