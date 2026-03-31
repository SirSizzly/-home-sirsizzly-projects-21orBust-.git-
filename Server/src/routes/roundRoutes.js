// ------------------------------------------------------------
// roundRoutes.js — HTTP API for round / run lifecycle
// ------------------------------------------------------------

const express = require("express");
const router = express.Router();

const roundServices = require("../services/roundServices");

// POST /api/run/start
// Starts a new run: creates run, first blind, first round, returns snapshot
router.post("/run/start", async (req, res) => {
  try {
    const state = await roundServices.startRun();
    res.json(state);
  } catch (err) {
    console.error("Error in POST /api/run/start:", err);
    res.status(500).json({ error: "Failed to start run" });
  }
});

// GET /api/run/:runId
// Returns full run snapshot (run, blind, hands, deck)
router.get("/run/:runId", async (req, res) => {
  try {
    const runId = parseInt(req.params.runId, 10);
    const state = await roundServices.getRunState(runId);

    if (!state.run) {
      return res.status(404).json({ error: "Run not found" });
    }

    res.json(state);
  } catch (err) {
    console.error("Error in GET /api/run/:runId:", err);
    res.status(500).json({ error: "Failed to load run state" });
  }
});

// POST /api/run/:runId/round/action
// Body: { handIndex, action } where action ∈ ["hit","stay","double","split"]
router.post("/run/:runId/round/action", async (req, res) => {
  try {
    const runId = parseInt(req.params.runId, 10);
    const { handIndex, action } = req.body;

    if (typeof handIndex !== "number" || !action) {
      return res
        .status(400)
        .json({ error: "handIndex and action are required" });
    }

    const state = await roundServices.applyHandAction(runId, handIndex, action);
    res.json(state);
  } catch (err) {
    console.error("Error in POST /api/run/:runId/round/action:", err);
    res.status(500).json({ error: "Failed to apply hand action" });
  }
});

module.exports = router;
