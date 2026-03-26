const express = require("express");
const router = express.Router();
const runStateService = require("../services/runStateService");

router.get("/runs/:runId/state", async (req, res) => {
  try {
    const { runId } = req.params;
    const state = await runStateService.getRunState(Number(runId));

    if (!state) {
      return res.status(404).json({ error: "Run not found" });
    }

    res.json(state);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
