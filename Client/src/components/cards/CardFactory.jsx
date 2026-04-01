// Client/src/components/cards/CardFactory.jsx
import React from "react";

export default function CardFactory({ card }) {
  if (!card || !card.image_key) return null;

  // Backend sends: q_club, ten_club, ace_spade, etc.
  // Server serves: http://localhost:3000/deck/<image_key>.png
  const src = `http://localhost:3000/deck/${card.image_key}.png`;

  return (
    <img
      src={src}
      alt={card.image_key}
      style={{ width: "80px", height: "120px", borderRadius: "6px" }}
      onError={(e) => {
        console.error("Missing card image:", src);
        e.target.style.display = "none";
      }}
    />
  );
}
