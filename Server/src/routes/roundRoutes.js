// src/routes/roundRoutes.js
// Public API for blind lifecycle control.

const express = require("express");
const router = express.Router();

const roundService = require("../services/roundServices");

// ------------------------------------------------------------
// POST /api/runs/:runId/blind/start
// Body: { blindType: "small" | "big" | "boss" }
// ------------------------------------------------------------
router.post("/runs/:runId/blind/start", async (req, res) => {
  try {
    const runId = Number(req.params.runId);
    const { blindType } = req.body || {};

    const result = await roundService.startBlind(runId, blindType);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// ------------------------------------------------------------
// POST /api/runs/:runId/blind/resolve
// Called after a hand resolves to check clear/fail/ongoing
// ------------------------------------------------------------
router.post("/runs/:runId/blind/resolve", async (req, res) => {
  try {
    const runId = Number(req.params.runId);
    const result = await roundService.resolveBlind(runId);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
