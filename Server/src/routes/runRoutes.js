const express = require("express");
const router = express.Router();
const runController = require("../controllers/runController");

// Run lifecycle
router.post("/start", runController.startRun);
router.get("/:id", runController.getRun);

// Hand actions
router.post("/:id/action/hit", runController.hit);
router.post("/:id/action/stay", runController.stay);

// Round transitions
router.post("/:id/action/next-hand", runController.nextHand);
router.post("/:id/action/next-blind", runController.nextBlind);

// Deck info
router.get("/:id/deck", runController.getDeck);

module.exports = router;
