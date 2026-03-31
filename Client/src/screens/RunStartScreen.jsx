import React from "react";
import StartScreen from "./StartScreen";
import { startRun } from "../api/runApi";

export default function RunStartScreen({ onStart }) {
  const handleStart = async () => {
    const res = await startRun();
    console.log("startRun response:", res);

    const id = res.runId ?? res.run?.id;
    if (!id || Number.isNaN(Number(id))) {
      console.error("Invalid runId:", res);
      return;
    }

    onStart(Number(id));
  };

  return <StartScreen onStart={handleStart} />;
}
