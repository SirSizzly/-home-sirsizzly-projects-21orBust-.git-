// CLIENT/src/components/Tooltip.jsx
import { useState } from "react";

export default function Tooltip({ children, content }) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}

      {visible && (
        <div style={styles.tooltip}>
          <div style={styles.title}>{content.name}</div>
          <div style={styles.when}>{content.when}</div>
          <div style={styles.effect}>{content.effect}</div>
          <div style={styles.rule}>{content.rule}</div>
          {content.notes && <div style={styles.notes}>{content.notes}</div>}
        </div>
      )}
    </div>
  );
}

const styles = {
  tooltip: {
    position: "absolute",
    top: "110%",
    left: "50%",
    transform: "translateX(-50%)",
    background: "rgba(20, 20, 20, 0.95)",
    border: "2px solid #663300",
    borderRadius: "10px",
    padding: "12px 16px",
    width: "240px",
    color: "#e6e6e6",
    fontFamily: "Cinzel, serif",
    zIndex: 999,
    boxShadow: "0 0 15px rgba(255, 0, 0, 0.3)",
  },
  title: {
    fontSize: "1.2rem",
    color: "#ffcc66",
    marginBottom: "4px",
  },
  when: {
    fontSize: "0.9rem",
    color: "#cc4444",
    marginBottom: "6px",
  },
  effect: {
    fontSize: "1rem",
    color: "#bb88ff",
    marginBottom: "6px",
  },
  rule: {
    fontSize: "0.95rem",
    color: "#dddddd",
    marginBottom: "6px",
  },
  notes: {
    fontSize: "0.85rem",
    color: "#888",
  },
};
