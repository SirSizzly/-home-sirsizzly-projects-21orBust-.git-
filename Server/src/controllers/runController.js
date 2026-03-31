const runstateService = require("../services/runstateService");
const runService = require("../services/runService");
const roundService = require("../services/roundServices");
const handService = require("../services/roundServices");
const deckService = require("../services/deckService");

// ------------------------------------------------------------
// POST /api/run/start
// ------------------------------------------------------------
exports.startRun = async (req, res) => {
  try {
    const result = await runService.startRun();
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

// ------------------------------------------------------------
// GET /api/run/:id
// ------------------------------------------------------------
exports.getRun = async (req, res) => {
  try {
    const runId = Number(req.params.id);
    const result = await runstateService.getRunState(runId);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

// ------------------------------------------------------------
// POST /api/run/:id/action/hit
// ------------------------------------------------------------
exports.hit = async (req, res) => {
  try {
    const runId = Number(req.params.id);
    const result = await handService.hit(runId);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

// ------------------------------------------------------------
// POST /api/run/:id/action/stay
// ------------------------------------------------------------
exports.stay = async (req, res) => {
  try {
    const runId = Number(req.params.id);
    const result = await handService.stay(runId);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

// ------------------------------------------------------------
// POST /api/run/:id/action/next-hand
// ------------------------------------------------------------
exports.nextHand = async (req, res) => {
  try {
    const runId = Number(req.params.id);
    const result = await roundService.nextHand(runId);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

// ------------------------------------------------------------
// POST /api/run/:id/action/next-blind
// ------------------------------------------------------------
exports.nextBlind = async (req, res) => {
  try {
    const runId = Number(req.params.id);
    const result = await roundService.nextBlind(runId);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

// ------------------------------------------------------------
// GET /api/run/:id/deck
// ------------------------------------------------------------
exports.getDeck = async (req, res) => {
  try {
    const runId = Number(req.params.id);
    const result = await deckService.getDeck(runId);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};
