// Client/src/screens/GameplayScreen.jsx
import React, { useEffect, useState } from "react";
import {
  startRun,
  getRun,
  hit,
  stay,
  splitHand,
  doubleDown,
} from "../api/runApi";
import CardFactory from "../components/cards/CardFactory";
import { useNavigate } from "react-router-dom";

export default function GameplayScreen() {
  const navigate = useNavigate();

  const [runId, setRunId] = useState(null);
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const data = await startRun();
        setRunId(data.runId);
        setState(data);
      } catch (e) {
        console.error("Error starting run:", e);
      }
    };
    init();
  }, []);

  const doHit = async () => {
    if (!runId) return;
    setLoading(true);
    try {
      const data = await hit(runId);
      setState(data);
    } catch (e) {
      console.error("Hit error:", e);
    } finally {
      setLoading(false);
    }
  };

  const doStay = async () => {
    if (!runId) return;
    setLoading(true);
    try {
      const data = await stay(runId);
      setState(data);
    } catch (e) {
      console.error("Stay error:", e);
    } finally {
      setLoading(false);
    }
  };

  const doSplit = async () => {
    if (!runId) return;
    setLoading(true);
    try {
      const data = await splitHand(runId);
      setState(data);
    } catch (e) {
      console.error("Split error:", e);
    } finally {
      setLoading(false);
    }
  };

  const doDouble = async () => {
    if (!runId) return;
    setLoading(true);
    try {
      const data = await doubleDown(runId);
      setState(data);
    } catch (e) {
      console.error("Double down error:", e);
    } finally {
      setLoading(false);
    }
  };

  if (!state) return <div>Loading run...</div>;

  const blind = state.blind;
  const remainingHands = blind ? 3 - blind.hands_played : 3;

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundImage: "url('/casino_bg_main.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "20px",
        color: "white",
        boxSizing: "border-box",
      }}
    >
      <h2>Run: {runId}</h2>
      <h3>Gold: {state.gold}</h3>

      {blind && (
        <>
          <h3>
            Blind: {blind.blind_type} (Target: {blind.target_score})
          </h3>
          <h3>
            Score: {blind.accumulated_score} / {blind.target_score}
          </h3>
          <h3>Hands Remaining: {remainingHands}</h3>
        </>
      )}

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "20px",
          flexWrap: "wrap",
        }}
      >
        {state.hands?.map((hand, i) => (
          <div
            key={i}
            style={{
              padding: "10px",
              border: "1px solid white",
              borderRadius: "6px",
              minWidth: "260px",
            }}
          >
            <h4>Hand {i + 1}</h4>
            <div style={{ display: "flex", gap: "10px" }}>
              {hand.cards.map((card) => (
                <CardFactory key={card.id} card={card} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "30px", display: "flex", gap: "20px" }}>
        <button onClick={doHit} disabled={loading}>
          Hit
        </button>
        <button onClick={doStay} disabled={loading}>
          Stay
        </button>
        <button onClick={doSplit} disabled={loading}>
          Split
        </button>
        <button onClick={doDouble} disabled={loading}>
          Double Down
        </button>
      </div>

      <div style={{ marginTop: "40px" }}>
        <button onClick={() => navigate(`/shop?runId=${runId}`)}>
          Go To Shop
        </button>
      </div>
    </div>
  );
}
