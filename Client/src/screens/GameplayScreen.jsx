import { useEffect, useState } from "react";
import { getRun, hit, stay, nextHand, nextBlind } from "../api/runApi";
import CardFactory from "../components/cards/CardFactory";

export default function GameplayScreen({ runId, onShop }) {
  const [runState, setRunState] = useState(null);

  // Load run state
  useEffect(() => {
    getRun(runId).then(setRunState);
  }, [runId]);

  // Auto-shop when blind beaten
  useEffect(() => {
    if (!runState) return;
    const { blind } = runState;

    const blindBeaten =
      blind.accumulated_score >= blind.target_score && blind.hands_played > 0;

    if (blindBeaten) {
      onShop();
    }
  }, [runState, onShop]);

  if (!runState) {
    return <div style={styles.loading}>Loading...</div>;
  }

  const { run, blind, hands, inventory } = runState;

  const inActiveBlind = blind.accumulated_score < blind.target_score;

  // ACTION HANDLERS — all return unified run state
  const handleHit = async () => {
    const updated = await hit(runId);
    setRunState(updated);
  };

  const handleStay = async () => {
    const updated = await stay(runId);
    setRunState(updated);
  };

  const handleSplit = async () => {
    console.warn("Split not implemented yet");
  };

  const handleDoubleDown = async () => {
    console.warn("Double Down not implemented yet");
  };

  const handleNextHand = async () => {
    const updated = await nextHand(runId);
    setRunState(updated);
  };

  const handleNextBlind = async () => {
    if (inActiveBlind) return;
    const updated = await nextBlind(runId);
    setRunState(updated);
  };

  return (
    <div style={styles.container}>
      {/* JOKER CONTAINER */}
      <div style={styles.jokerContainer}>
        <div style={styles.jokerRow}>
          {inventory.jokers.map((joker, idx) => (
            <CardFactory key={idx} card={joker} />
          ))}
        </div>

        <div style={styles.jokerCounter}>{inventory.jokers.length}/4</div>
      </div>

      {/* LEFT‑ALIGNED BLIND PANEL */}
      <div style={styles.blindRow}>
        <div style={styles.blindPanel}>
          <h2 style={styles.blindTitle}>
            {blind.blind_type.toUpperCase()} BLIND
          </h2>

          <p style={styles.blindText}>Target: {blind.target_score}</p>
          <p style={styles.blindText}>Score: {blind.accumulated_score}</p>

          <p style={styles.blindText}>
            Base × Mult: {blind.accumulated_score} × {run.permanentMultiplier}
          </p>

          <p style={styles.fragile}>Fragile: {run.fragileStacks}</p>
        </div>
      </div>

      {/* VELVET TABLE */}
      <div style={styles.table}>
        {hands.map((hand, i) => (
          <div key={i} style={styles.handSlot}>
            <div style={styles.cardRow}>
              {hand.cards.map((cardObj, idx) => (
                <CardFactory key={idx} card={cardObj} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* FLOATING ACTION PANEL */}
      <div style={styles.actionPanel}>
        <button style={styles.hitBtn} onClick={handleHit} />
        <button style={styles.stayBtn} onClick={handleStay} />
        <button style={styles.splitBtn} onClick={handleSplit} />
        <button style={styles.doubleBtn} onClick={handleDoubleDown} />
        <button style={styles.nextHandBtn} onClick={handleNextHand} />

        <button
          style={{
            ...styles.nextBlindBtn,
            opacity: inActiveBlind ? 0.4 : 1,
            pointerEvents: inActiveBlind ? "none" : "auto",
          }}
          onClick={handleNextBlind}
        />

        <button
          style={{
            ...styles.shopBtn,
            opacity: inActiveBlind ? 0.4 : 1,
            pointerEvents: inActiveBlind ? "none" : "auto",
          }}
          onClick={onShop}
        />
      </div>

      {/* RELICS — 2 GREY SQUARES */}
      <div style={styles.relicBar}>
        {[0, 1].map((slot) => {
          const relic = inventory.relics[slot];
          return relic ? (
            <CardFactory key={slot} card={relic} />
          ) : (
            <div key={slot} style={styles.relicPlaceholder} />
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "url('/stone-texture.png'), #0d0d0d",
    backgroundSize: "cover",
    padding: "20px",
    color: "#e6e6e6",
    fontFamily: "Cinzel, serif",
  },

  loading: {
    color: "white",
    fontSize: "2rem",
    textAlign: "center",
    marginTop: "40vh",
  },

  /* JOKERS */
  jokerContainer: {
    width: "100%",
    maxWidth: "500px",
    margin: "0 auto 20px auto",
    border: "2px solid #8b0000",
    borderRadius: "10px",
    padding: "10px",
    position: "relative",
    background: "rgba(0,0,0,0.3)",
  },

  jokerRow: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },

  jokerCounter: {
    position: "absolute",
    bottom: "6px",
    right: "10px",
    fontSize: "0.9rem",
    color: "#ff4444",
    opacity: 0.9,
  },

  /* BLIND PANEL */
  blindRow: {
    display: "flex",
    justifyContent: "flex-start",
    marginBottom: "20px",
  },

  blindPanel: {
    background: "rgba(20,20,20,0.85)",
    border: "2px solid #8b0000",
    borderRadius: "10px",
    padding: "15px 20px",
    width: "fit-content",
    textAlign: "left",
  },

  blindTitle: {
    margin: 0,
    fontSize: "1.8rem",
    color: "#ff4444",
  },

  blindText: {
    margin: "4px 0",
    fontSize: "1.1rem",
  },

  fragile: {
    marginTop: "8px",
    color: "#ff6666",
    fontWeight: "bold",
  },

  /* TABLE */
  table: {
    width: "100%",
    minHeight: "300px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px",
    background: "radial-gradient(circle, #2b0f0f, #1a0000 70%)",
    borderRadius: "20px",
    border: "3px solid #4a0000",
    marginBottom: "20px",
  },

  handSlot: {
    background: "rgba(0,0,0,0.4)",
    border: "2px solid #663300",
    borderRadius: "12px",
    padding: "10px",
    minWidth: "260px",
  },

  cardRow: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },

  /* FLOATING ACTION PANEL */
  actionPanel: {
    display: "flex",
    justifyContent: "center",
    gap: "14px",
    marginBottom: "20px",
    padding: "15px",
    background: "rgba(0,0,0,0.4)",
    borderRadius: "12px",
    border: "2px solid #660000",
    width: "fit-content",
    marginLeft: "auto",
    marginRight: "auto",
  },

  /* BUTTON IMAGES */
  hitBtn: {
    width: 120,
    height: 50,
    backgroundImage: "url('http://localhost:3000/actions/hit_button.png')",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
  },

  stayBtn: {
    width: 120,
    height: 50,
    backgroundImage: "url('http://localhost:3000/actions/stay_button.png')",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
  },

  splitBtn: {
    width: 120,
    height: 50,
    backgroundImage: "url('http://localhost:3000/actions/split_button.png')",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
  },

  doubleBtn: {
    width: 120,
    height: 50,
    backgroundImage: "url('http://localhost:3000/actions/double_down.png')",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
  },

  nextHandBtn: {
    width: 140,
    height: 50,
    backgroundImage: "url('http://localhost:3000/actions/next_hand.png')",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
  },

  nextBlindBtn: {
    width: 140,
    height: 50,
    backgroundImage: "url('http://localhost:3000/actions/next_blind.png')",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
  },

  shopBtn: {
    width: 140,
    height: 50,
    backgroundImage: "url('http://localhost:3000/actions/shop_button.png')",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
  },

  /* RELICS */
  relicBar: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    marginTop: "25px",
  },

  relicPlaceholder: {
    width: 80,
    height: 80,
    background: "rgba(255,255,255,0.1)",
    border: "2px dashed rgba(255,255,255,0.2)",
    borderRadius: "10px",
  },
};
