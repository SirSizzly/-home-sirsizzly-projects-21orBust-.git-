// DRAFT 3 — Cards raised 5%, buttons lowered + centered

import { useState } from "react";
import { demoCards } from "../data/demoCards";
import { demoBackgrounds } from "../data/demoBackgrounds";

export default function DemoGameplayScreen() {
  const [hands] = useState([
    { id: 1, cards: [demoCards[0], demoCards[1]] },
    { id: 2, cards: [demoCards[2], demoCards[3]] },
  ]);

  const jokerSlots = [null, null, null, null];
  const relicSlots = [null, null];

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        backgroundImage: `url(${demoBackgrounds.main})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Fog + vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at center, rgba(0,0,0,0.15), rgba(0,0,0,0.85))",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* TOP LEDGER */}
      <div
        style={{
          position: "relative",
          zIndex: 5,
          paddingTop: "40px",
          textAlign: "center",
          color: "#d9d2c2",
          fontFamily: "'Cinzel', serif",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          textShadow: `
            0px 3px 2px rgba(0,0,0,0.9),
            0px 6px 4px rgba(0,0,0,0.85)
          `,
        }}
      >
        <div style={{ fontSize: "42px", marginBottom: "10px" }}>
          Blind Target: <span style={{ color: "#e8ddc8" }}>160</span>
        </div>

        <div style={{ fontSize: "26px", opacity: 0.85 }}>
          Score: 0 • Fragile: 0 • Multiplier: 1×
        </div>

        <div
          style={{
            marginTop: "12px",
            fontSize: "22px",
            color: "#b8a894",
            opacity: 0.75,
          }}
        >
          Boss Blind: None
        </div>
      </div>

      {/* ACTION BAR — lowered + centered */}
      <div
        style={{
          position: "relative",
          zIndex: 20,
          display: "flex",
          justifyContent: "center",
          gap: "32px",
          marginTop: "200px",
          marginBottom: "0px",
        }}
      >
        {["Hit", "Stay", "Split", "Double"].map((label) => (
          <button
            key={label}
            style={{
              padding: "16px 38px",
              background: "rgba(40,20,20,0.55)",
              borderRadius: "8px",
              border: "1px solid rgba(180,150,100,0.4)",
              color: "#e8ddc8",
              fontWeight: "700",
              fontSize: "20px",
              fontFamily: "'Cinzel', serif",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              cursor: "pointer",
              boxShadow: `
                inset 0 0 12px rgba(0,0,0,0.9),
                0 4px 6px rgba(0,0,0,0.7)
              `,
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "scale(1.03)";
              e.target.style.boxShadow =
                "inset 0 0 14px rgba(0,0,0,0.95), 0 4px 8px rgba(0,0,0,0.8)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow =
                "inset 0 0 12px rgba(0,0,0,0.9), 0 4px 6px rgba(0,0,0,0.7)";
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* JOKER + RELIC ALCOVES */}
      <div
        style={{
          position: "absolute",
          top: "140px",
          left: "40px",
          zIndex: 5,
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {jokerSlots.map((slot, i) => (
          <div
            key={i}
            style={{
              width: "120px",
              height: "160px",
              background: "rgba(20,20,20,0.65)",
              border: "2px solid #a38f6d",
              borderRadius: "6px",
              boxShadow: `
                inset 0 0 12px rgba(0,0,0,0.9),
                0 4px 6px rgba(0,0,0,0.8)
              `,
            }}
          />
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          top: "140px",
          right: "40px",
          zIndex: 5,
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {relicSlots.map((slot, i) => (
          <div
            key={i}
            style={{
              width: "140px",
              height: "180px",
              background: "rgba(20,20,20,0.65)",
              border: "2px solid #a38f6d",
              borderRadius: "6px",
              boxShadow: `
                inset 0 0 12px rgba(0,0,0,0.9),
                0 4px 6px rgba(0,0,0,0.8)
              `,
            }}
          />
        ))}
      </div>

      {/* TABLE AREA — cards raised 5% */}
      <div
        style={{
          position: "absolute",
          bottom: "7vh",
          width: "100%",
          height: "35vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          perspective: "900px",
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: `${Math.max(80 - hands.length * 10, 40)}px`,
            transform: "rotateX(12deg)",
          }}
        >
          {hands.map((hand) => (
            <div key={hand.id} style={{ display: "flex", gap: "12px" }}>
              {hand.cards.map((card, i) => (
                <img
                  key={i}
                  src={card}
                  alt="card"
                  style={{
                    width: "140px",
                    borderRadius: "6px",
                    filter: `
                      brightness(0.92)
                      contrast(1.1)
                      drop-shadow(-6px 12px 10px rgba(0,0,0,0.7))
                    `,
                    transform: "rotateX(12deg)",
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
