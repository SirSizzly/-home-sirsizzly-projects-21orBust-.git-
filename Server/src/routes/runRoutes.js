const express = require("express");
const router = express.Router();

const runService = require("../services/runService");
const runstateService = require("../services/runstateService");

// START A NEW RUN
router.post("/start", async (req, res) => {
  try {
    // Create the run
    const run = await runService.startRun();

    // Build initial state
    const state = await runstateService.getRunState(run.id);

    // IMPORTANT: return runId explicitly
    res.json({
      runId: run.id,
      ...state,
    });
  } catch (err) {
    console.error("Error starting run:", err);
    res.status(500).json({ error: "Failed to start run" });
  }
});

// GET RUN STATE
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid run ID" });
    }

    const state = await runstateService.getRunState(id);
    if (!state) {
      return res.status(404).json({ error: "Run not found" });
    }

    res.json(state);
  } catch (err) {
    console.error("Error fetching run:", err);
    res.status(500).json({ error: "Failed to fetch run" });
  }
});

module.exports = router;
