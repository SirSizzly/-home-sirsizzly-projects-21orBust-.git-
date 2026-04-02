import { useEffect, useState } from "react";
import Hand from "../components/Hand";
import {
  doubleDown,
  hit,
  splitHand,
  startRun,
  stay,
} from "../api/runApi.js";

function toRunState(snapshot, previousRun = null) {
  return {
    run: {
      id: snapshot.runId,
      gold: snapshot.gold,
      anteIndex: previousRun?.anteIndex ?? 1,
      fragileStacks: previousRun?.fragileStacks ?? 0,
      permanentMultiplier: previousRun?.permanentMultiplier ?? 0,
    },
    blind: snapshot.blind,
    hands: snapshot.hands ?? [],
  };
}

export default function GamePage() {
  const [runId, setRunId] = useState(null);
  const [runState, setRunState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        const run = await startRun();
        setRunId(run.runId);
        setRunState(toRunState(run));
      } catch (err) {
        console.error("Failed to start run:", err);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  async function handleHandAction(handIndex, action) {
    if (!runId) return;

    try {
      let updated;

      if (action === "hit") updated = await hit(runId);
      if (action === "stay") updated = await stay(runId);
      if (action === "double") updated = await doubleDown(runId);
      if (action === "split") updated = await splitHand(runId);

      if (!updated) return;

      setRunState((prev) => toRunState(updated, prev?.run));
    } catch (err) {
      console.error("Action failed:", err);
    }
  }

  if (loading || !runState) {
    return <div className="p-4 text-white">Loading run...</div>;
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
            Mult: <span className="font-semibold">{run.permanentMultiplier}x</span>
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
