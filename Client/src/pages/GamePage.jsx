// Client/src/pages/GamePage.jsx

import { useEffect, useState } from "react";
import { createRun, fetchRunState, applyHandAction } from "../api/runApi";
import Hand from "../components/Hand";

export default function GamePage() {
  const [runId, setRunId] = useState(null);
  const [runState, setRunState] = useState(null);
  const [loading, setLoading] = useState(true);

  async function startRun() {
    setLoading(true);
    const run = await createRun();
    setRunId(run.id);
    const state = await fetchRunState(run.id);
    setRunState(state);
    setLoading(false);
  }

  async function refreshRunState() {
    if (!runId) return;
    const state = await fetchRunState(runId);
    setRunState(state);
  }

  useEffect(() => {
    startRun();
  }, []);

  async function handleHandAction(handIndex, action) {
    try {
      await applyHandAction(runId, handIndex, action);
      await refreshRunState();
    } catch (err) {
      console.error("Action failed:", err);
    }
  }

  if (loading || !runState) {
    return <div className="p-4 text-white">Loading run…</div>;
  }

  const { run, hands } = runState;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <header className="p-4 border-b border-slate-700 flex justify-between items-center">
        <div>
          <div className="text-sm uppercase tracking-wide text-slate-400">
            Run #{run.id}
          </div>
          <div className="text-lg font-semibold">Ante {run.anteIndex}</div>
        </div>

        <div className="flex gap-6 text-sm">
          <div>
            Gold: <span className="font-semibold">{run.gold}</span>
          </div>
          <div>
            Fragile: <span className="font-semibold">{run.fragileStacks}</span>
          </div>
          <div>
            Mult:{" "}
            <span className="font-semibold">{run.permanentMultiplier}x</span>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="bg-slate-800/60 rounded-lg p-4 border border-slate-700">
          <div className="mb-2 text-sm uppercase tracking-wide text-slate-400">
            Hands
          </div>

          <div className="flex flex-col gap-3">
            {hands.map((hand) => (
              <Hand
                key={hand.hand_index}
                hand={hand}
                onAction={handleHandAction}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
