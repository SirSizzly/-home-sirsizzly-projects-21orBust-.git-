import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRunState, postHandAction, getShopState } from "../services/api";
import HandArea from "../components/game/HandArea";
import BlindPanel from "../components/game/BlindPanel";
import ShopPanel from "../components/game/ShopPanel";

export default function RunView() {
  const { runId } = useParams();
  const [runState, setRunState] = useState(null);
  const [shopState, setShopState] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refreshAll() {
    if (!runId) return;
    const rs = await getRunState(runId);
    setRunState(rs);
    const ss = await getShopState(runId);
    setShopState(ss);
    setLoading(false);
  }

  useEffect(() => {
    refreshAll();
  }, [runId]);

  async function handleAction(handIndex, action) {
    await postHandAction(runId, handIndex, action);
    await refreshAll();
  }

  if (loading || !runState) {
    return <div className="p-4 text-white">Loading run…</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <header className="p-4 border-b border-slate-700 flex justify-between items-center">
        <div>
          <div className="text-sm uppercase tracking-wide text-slate-400">
            Run #{runState.run.id}
          </div>
          <div className="text-lg font-semibold">
            Ante {runState.run.anteIndex}
          </div>
        </div>

        <div className="flex gap-6 text-sm">
          <div>
            Gold: <span className="font-semibold">{runState.run.gold}</span>
          </div>
          <div>
            Fragile:{" "}
            <span className="font-semibold">{runState.run.fragileStacks}</span>
          </div>
          <div>
            Mult:{" "}
            <span className="font-semibold">
              {runState.run.permanentMultiplier}x
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-[2fr_1fr] gap-4 p-4">
        <section className="flex flex-col gap-4">
          <BlindPanel blind={runState.blind} />
          <HandArea hands={runState.hands} onAction={handleAction} />
        </section>

        <aside className="flex flex-col gap-4">
          <ShopPanel run={runState.run} shop={shopState?.shop} />
        </aside>
      </main>
    </div>
  );
}
