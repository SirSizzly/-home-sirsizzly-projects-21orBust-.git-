import { useState } from "react";
import RunStartScreen from "./screens/RunStartScreen";
import GameplayScreen from "./screens/GameplayScreen";
import ShopScreen from "./screens/ShopScreen";

export default function App() {
  const [runId, setRunId] = useState(null);
  const [screen, setScreen] = useState("start");

  if (screen === "start")
    return (
      <RunStartScreen
        onStart={(id) => {
          setRunId(id);
          setScreen("game");
        }}
      />
    );

  if (screen === "shop")
    return <ShopScreen runId={runId} onClose={() => setScreen("game")} />;

  return <GameplayScreen runId={runId} onShop={() => setScreen("shop")} />;
}
