const express = require("express");
const router = express.Router();
const shopController = require("../controllers/shopController");

router.get("/shop/:runId", shopController.getShop);
router.post("/shop/:runId/buy", shopController.buy);

module.exports = router;
