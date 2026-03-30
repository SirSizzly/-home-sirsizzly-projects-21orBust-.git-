// src/routes/runstateRoutes.js
// Public API for run state inspection and hand actions.

const express = require("express");
const router = express.Router();

const runstateService = require("../services/runstateService");

// ------------------------------------------------------------
// GET /api/runs/:runId/state
// Returns authoritative run + blind + hands snapshot
// ------------------------------------------------------------
router.get("/runs/:runId/state", async (req, res) => {
  try {
    const runId = Number(req.params.runId);
    const state = await runstateService.getRunState(runId);

    if (!state) {
      return res.status(404).json({ error: "Run not found" });
    }

    res.json(state);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// ------------------------------------------------------------
// POST /api/runs/:runId/hands/:handIndex/action
// Body: { action: "hit" | "stay" | "double" | "split" }
// Applies exactly one hand action and returns updated state
// ------------------------------------------------------------
router.post("/runs/:runId/hands/:handIndex/action", async (req, res) => {
  try {
    const runId = Number(req.params.runId);
    const handIndex = Number(req.params.handIndex);
    const { action } = req.body || {};

    const state = await runstateService.applyHandAction(
      runId,
      handIndex,
      action,
    );

    res.json(state);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
