const express = require("express");
const router = express.Router();
const engagementController = require("../controllers/engagementController");
const {protect}  = require("../middleware/authMiddleware");

router.post("/", protect,engagementController.createEngagement);
router.get("/event/:eventId", engagementController.getEventEngagements);
router.get("/club-likes", engagementController.getAverageLikesPerClub);

module.exports = router;
