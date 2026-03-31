// CLIENT/src/screens/RunStartScreen.jsx
import { startRun } from "../api/runApi";
import { useState } from "react";

export default function RunStartScreen({ onStart }) {
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    const data = await startRun();
    onStart(data.id);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>21orBust</h1>
      <p style={styles.subtitle}>
        Build, enhance, and gamble your way through a crooked casino.
      </p>

      <button style={styles.button} onClick={handleStart} disabled={loading}>
        {loading ? "Starting..." : "Start Run"}
      </button>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #1a1a1a, #333)",
    color: "white",
    textAlign: "center",
  },
  title: {
    fontSize: "4rem",
    marginBottom: "0.5rem",
  },
  subtitle: {
    fontSize: "1.2rem",
    opacity: 0.8,
    marginBottom: "2rem",
  },
  button: {
    padding: "1rem 2rem",
    fontSize: "1.5rem",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    background: "#ffcc00",
    color: "#000",
    fontWeight: "bold",
  },
};
