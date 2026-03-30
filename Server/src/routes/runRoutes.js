// src/routes/runRoutes.js
const express = require("express");
const router = express.Router();

const runService = require("../services/runService");

// POST /api/runs — start a new run
router.post("/", async (req, res) => {
  try {
    const run = await runService.startRun();
    res.json(run);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to start run" });
  }
});

// GET /api/runs/:id — get run metadata + stats
router.get("/:id", async (req, res) => {
  try {
    const runId = Number(req.params.id);
    const run = await runService.getRun(runId);
    if (!run) return res.status(404).json({ error: "Run not found" });
    res.json(run);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch run" });
  }
});

// POST /api/runs/:id/complete — mark run complete
router.post("/:id/complete", async (req, res) => {
  try {
    const runId = Number(req.params.id);
    await runService.completeRun(runId);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
