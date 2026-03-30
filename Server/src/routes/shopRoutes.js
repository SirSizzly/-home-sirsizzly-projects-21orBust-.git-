// src/routes/shopRoutes.js
// Public API for shop interactions.

const express = require("express");
const router = express.Router();

const shopService = require("../services/shopService");

// ------------------------------------------------------------
// GET /api/runs/:runId/shop
// Returns current shop state (resume-safe)
// ------------------------------------------------------------
router.get("/runs/:runId/shop", async (req, res) => {
  try {
    const runId = Number(req.params.runId);
    const shop = await shopService.getShopState(runId);
    if (!shop) return res.status(404).json({ error: "Run not found" });
    res.json(shop);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// ------------------------------------------------------------
// POST /api/runs/:runId/shop/buy
// Body: { type: "joker" | "relic" | "enhancement_pack", index?: number }
// ------------------------------------------------------------
router.post("/runs/:runId/shop/buy", async (req, res) => {
  try {
    const runId = Number(req.params.runId);
    const { type, index } = req.body || {};

    const shop = await shopService.buyItem(runId, type, index);
    res.json(shop);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// ------------------------------------------------------------
// POST /api/runs/:runId/shop/reroll
// Rerolls joker row only
// ------------------------------------------------------------
router.post("/runs/:runId/shop/reroll", async (req, res) => {
  try {
    const runId = Number(req.params.runId);
    const shop = await shopService.rerollJokers(runId);
    res.json(shop);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
