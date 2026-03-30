import { useEffect, useState } from "react";
import { createRun, fetchRunState, applyHandAction } from "../api/runApi";
import Hand from "../components/Hand.jsx";

export default function GamePage() {
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);

  // ------------------------------------------------------------
  // Boot a new run and fetch authoritative state
  // ------------------------------------------------------------
  useEffect(() => {
    async function boot() {
      try {
        const newRun = await createRun();
        const snapshot = await fetchRunState(newRun.id);
        setState(snapshot);
      } catch (err) {
        console.error("Failed to boot run:", err);
      } finally {
        setLoading(false);
      }
    }

    boot();
  }, []);

  // ------------------------------------------------------------
  // Apply a hand action and refresh state
  // ------------------------------------------------------------
  async function handleHandAction(handIndex, action) {
    try {
      const updated = await applyHandAction(state.run.id, handIndex, action);
      setState(updated);
    } catch (err) {
      console.error("Action failed:", err);
    }
  }

  if (loading || !state) {
    return <div style={{ color: "black" }}>Loading run…</div>;
  }

  return (
    <div className="game-page">
      <header>
        <div>Gold: {state.run.gold}</div>
        <div>Ante: {state.run.anteIndex}</div>
      </header>

      <main>
        {state.hands.map((hand) => (
          <Hand key={hand.hand_index} hand={hand} onAction={handleHandAction} />
        ))}
      </main>
    </div>
  );
}
