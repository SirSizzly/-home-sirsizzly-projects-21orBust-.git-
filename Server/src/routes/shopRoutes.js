const express = require("express");
const router = express.Router();
const shopService = require("../services/shopService");

// get current shop for latest completed round of a run
router.get("/runs/:runId/shop", async (req, res) => {
  try {
    const { runId } = req.params;
    const shop = await shopService.getCurrentShopForRun(Number(runId));

    if (!shop) {
      return res.status(404).json({ error: "No shop available for this run" });
    }

    res.json(shop);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// purchase a shop item
router.post("/runs/:runId/shop/purchase/:shopItemId", async (req, res) => {
  try {
    const { runId, shopItemId } = req.params;
    const result = await shopService.purchaseItem(
      Number(runId),
      Number(shopItemId),
    );
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
