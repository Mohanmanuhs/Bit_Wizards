const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const { protect } = require("../middleware/authMiddleware");

router.post("/",protect, eventController.createEvent);
router.get("/", eventController.getAllEvents);
router.get("/:id", eventController.getEventById);
router.put("/:id",protect, eventController.updateEvent);
router.delete("/:id",protect, eventController.deleteEvent);

module.exports = router;

