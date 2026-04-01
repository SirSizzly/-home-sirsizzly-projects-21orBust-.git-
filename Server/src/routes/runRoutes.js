// Server/src/routes/runRoutes.js
const express = require("express");
const router = express.Router();

const runstateService = require("../services/runstateService");

// Shape snapshot for the client
function toClientState(snapshot) {
  if (!snapshot) return null;

  return {
    runId: snapshot.run.id,
    gold: snapshot.run.gold,
    blind: snapshot.blind,
    hands: snapshot.hands,
  };
}

// START RUN
router.post("/start", async (req, res) => {
  try {
    const snapshot = await runstateService.getRunState(
      (await require("../services/runService").startRun()).id,
    );
    return res.json(toClientState(snapshot));
  } catch (err) {
    console.error("Error in START RUN:", err);
    return res.status(500).json({ error: "Failed to start run" });
  }
});

// GET RUN STATE
router.get("/:runId", async (req, res) => {
  try {
    const runId = parseInt(req.params.runId, 10);
    const snapshot = await runstateService.getRunState(runId);
    return res.json(toClientState(snapshot));
  } catch (err) {
    console.error("Error in GET RUN:", err);
    return res.status(500).json({ error: "Failed to fetch run" });
  }
});

// HIT
router.post("/:runId/hit", async (req, res) => {
  try {
    const runId = parseInt(req.params.runId, 10);
    const snapshot = await runstateService.applyHandAction(runId, 0, "hit");
    return res.json(toClientState(snapshot));
  } catch (err) {
    console.error("Error in HIT:", err);
    return res.status(500).json({ error: "Failed to apply hit" });
  }
});

// STAY
router.post("/:runId/stay", async (req, res) => {
  try {
    const runId = parseInt(req.params.runId, 10);
    const snapshot = await runstateService.applyHandAction(runId, 0, "stay");
    return res.json(toClientState(snapshot));
  } catch (err) {
    console.error("Error in STAY:", err);
    return res.status(500).json({ error: "Failed to apply stay" });
  }
});

// DOUBLE DOWN
router.post("/:runId/double-down", async (req, res) => {
  try {
    const runId = parseInt(req.params.runId, 10);
    const snapshot = await runstateService.applyHandAction(runId, 0, "double");
    return res.json(toClientState(snapshot));
  } catch (err) {
    console.error("Error in DOUBLE DOWN:", err);
    return res.status(500).json({ error: "Failed to apply double down" });
  }
});

// SPLIT
router.post("/:runId/split", async (req, res) => {
  try {
    const runId = parseInt(req.params.runId, 10);
    const snapshot = await runstateService.applyHandAction(runId, 0, "split");
    return res.json(toClientState(snapshot));
  } catch (err) {
    console.error("Error in SPLIT:", err);
    return res.status(500).json({ error: "Failed to apply split" });
  }
});

module.exports = router;
