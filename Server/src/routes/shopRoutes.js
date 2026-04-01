// Server/src/routes/shopRoutes.js
const express = require("express");
const router = express.Router();

const shopService = require("../services/shopService");

// GET /api/runs/:runId/shop
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

// POST /api/runs/:runId/shop/buy
router.post("/runs/:runId/shop/buy", async (req, res) => {
  try {
    const runId = Number(req.params.runId);
    const { type, index } = req.body || {};
    const shop = await shopService.buyShopItem(runId, type, index);
    res.json(shop);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// POST /api/runs/:runId/shop/reroll
router.post("/runs/:runId/shop/reroll", async (req, res) => {
  try {
    const runId = Number(req.params.runId);
    const shop = await shopService.rerollShop(runId);
    res.json(shop);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
