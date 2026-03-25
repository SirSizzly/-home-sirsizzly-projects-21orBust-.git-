const express = require("express");
const router = express.Router();
const roundService = require("../services/roundService");

// start a new round for a run
router.post("/runs/:runId/rounds", async (req, res) => {
  try {
    const { runId } = req.params;
    const round = await roundService.startRound(Number(runId));
    res.json(round);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// get current round for a run
router.get("/runs/:runId/rounds/current", async (req, res) => {
  try {
    const { runId } = req.params;
    const round = await roundService.getCurrentRound(Number(runId));
    if (!round) return res.status(404).json({ error: "No round found" });
    res.json(round);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// hit
router.post("/rounds/:roundStateId/hit/:handIndex", async (req, res) => {
  try {
    const { roundStateId, handIndex } = req.params;
    const { runId } = req.body;
    const result = await roundService.hit(
      Number(runId),
      Number(roundStateId),
      Number(handIndex),
    );
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// stay
router.post("/rounds/:roundStateId/stay/:handIndex", async (req, res) => {
  try {
    const { roundStateId, handIndex } = req.params;
    const result = await roundService.stay(
      Number(roundStateId),
      Number(handIndex),
    );
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// split
router.post("/rounds/:roundStateId/split/:handIndex", async (req, res) => {
  try {
    const { roundStateId, handIndex } = req.params;
    const { runId } = req.body;
    const result = await roundService.split(
      Number(runId),
      Number(roundStateId),
      Number(handIndex),
    );
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
