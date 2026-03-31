// CLIENT/src/screens/StartScreen.jsx
import React from "react";

export default function StartScreen({ onStart }) {
  return (
    <div style={styles.container}>
      <div style={styles.titleWrapper}>
        <h1 style={styles.title}>21orBust</h1>
        <p style={styles.subtitle}>A Game of Risk, Ruin, and Arcane Fortune</p>
      </div>

      <button style={styles.startButton} onClick={onStart}>
        Begin Your Run
      </button>

      <p style={styles.footer}>
        Enter the Vault. Face the Blinds. Defy the Deck.
      </p>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    width: "100vw",
    background: `
      linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)),
      url('http://localhost:3000/backgrounds/stone-wall.png')
    `,
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#e6e6e6",
    fontFamily: "Cinzel, serif",
    textAlign: "center",
  },

  titleWrapper: { marginBottom: "40px" },

  title: {
    fontSize: "5rem",
    color: "#ffcc66",
    textShadow: "0 0 25px rgba(255, 200, 100, 0.6)",
    margin: 0,
  },

  subtitle: {
    fontSize: "1.3rem",
    opacity: 0.85,
    marginTop: "10px",
    color: "#d9b98c",
  },

  startButton: {
    padding: "18px 40px",
    fontSize: "1.6rem",
    background: "radial-gradient(circle, #3b0000, #1a0000)",
    border: "3px solid #aa0000",
    borderRadius: "12px",
    color: "#ffdddd",
    cursor: "pointer",
    fontWeight: "bold",
    letterSpacing: "1px",
    boxShadow: "0 0 20px rgba(255, 0, 0, 0.4)",
    transition: "all 0.2s ease-in-out",
  },

  footer: {
    position: "absolute",
    bottom: "30px",
    fontSize: "1rem",
    opacity: 0.7,
    color: "#c9c9c9",
  },
};
