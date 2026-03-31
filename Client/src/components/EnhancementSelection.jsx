// CLIENT/src/components/EnhancementSelection.jsx
import React from "react";
import CardFactory from "./cards/CardFactory";

export default function EnhancementSelection({ options, onChoose }) {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>Choose an Enhancement</h2>

        <div style={styles.row}>
          {options.map((enh, idx) => (
            <div
              key={idx}
              style={styles.cardWrapper}
              onClick={() => onChoose(en)}
            >
              <CardFactory card={enh} />
            </div>
          ))}
        </div>

        <p style={styles.hint}>Hover to inspect. Click to select.</p>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.75)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },

  modal: {
    background: "radial-gradient(circle, #1a1a1a, #000)",
    border: "3px solid #663300",
    borderRadius: "16px",
    padding: "30px",
    textAlign: "center",
    color: "#ffcc66",
    fontFamily: "Cinzel, serif",
    boxShadow: "0 0 25px rgba(255, 200, 100, 0.4)",
  },

  title: {
    marginBottom: "20px",
    fontSize: "2rem",
  },

  row: {
    display: "flex",
    gap: "20px",
    justifyContent: "center",
    marginBottom: "20px",
  },

  cardWrapper: {
    cursor: "pointer",
    transition: "transform 0.15s ease",
  },

  hint: {
    color: "#ccc",
    fontSize: "1rem",
    opacity: 0.8,
  },
};
