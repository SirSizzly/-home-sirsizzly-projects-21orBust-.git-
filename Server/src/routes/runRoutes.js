const express = require("express");
const router = express.Router();
const runService = require("../services/runService");

// ------------------------------------------------------------
// POST /api/runs — Start a new run
// ------------------------------------------------------------
router.post("/", async (req, res) => {
  try {
    const run = await runService.startRun();
    res.json(run);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to start run" });
  }
});

// ------------------------------------------------------------
// GET /api/runs/:id — Get run + deck + round state
// ------------------------------------------------------------
router.get("/:id", async (req, res) => {
  try {
    const run = await runService.getRun(req.params.id);
    if (!run) return res.status(404).json({ error: "Run not found" });
    res.json(run);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch run" });
  }
});

module.exports = router;
