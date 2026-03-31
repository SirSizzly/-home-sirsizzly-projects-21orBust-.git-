// CLIENT/src/components/cards/BaseCard.jsx
import React from "react";

export default function BaseCard({
  image,
  rarity = "common",
  enhancement = null,
  width = 120,
  height = 180,
}) {
  const rarityColors = {
    common: "#555",
    uncommon: "#4b8b3b",
    rare: "#3b5f9b",
    legendary: "#b8860b",
  };

  return (
    <div
      style={{
        width,
        height,
        position: "relative",
        borderRadius: "12px",
        overflow: "hidden",
        border: `3px solid ${rarityColors[rarity]}`,
        boxShadow: "0 0 20px rgba(0,0,0,0.7)",
        background: "radial-gradient(circle, #1a1a1a, #000)",
        cursor: "pointer",
      }}
    >
      {/* Card Art */}
      <img
        src={image}
        alt="card"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* Enhancement Overlay */}
      {enhancement && (
        <img
          src={enhancement}
          alt="enhancement"
          style={{
            position: "absolute",
            bottom: 5,
            right: 5,
            width: 40,
            height: 40,
            opacity: 0.9,
          }}
        />
      )}
    </div>
  );
}
