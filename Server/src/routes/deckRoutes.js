const express = require("express");
const router = express.Router();
const { createDeckRun } = require("../services/deckService");

router.get("/", (req, res) => {
  const seedParam = req.query.seed;
  const seed = seedParam ? Number(seedParam) : Date.now();

  if (Number.isNaN(seed)) {
    return res.status(400).json({ error: "Invalid seed" });
  }

  const deckRun = createDeckRun(seed);
  res.json(deckRun);
});

module.exports = router;
