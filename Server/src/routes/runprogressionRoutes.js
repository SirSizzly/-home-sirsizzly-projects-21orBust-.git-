const express = require("express");
const router = express.Router();
const runProgression = require("../services/runProgressionService");

// complete current round and open shop
router.post("/runs/:runId/next", async (req, res) => {
  try {
    const { runId } = req.params;
    const result = await runProgression.nextRound(Number(runId));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// end run explicitly
router.post("/runs/:runId/end", async (req, res) => {
  try {
    const { runId } = req.params;
    const result = await runProgression.endRun(Number(runId));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
