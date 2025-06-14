const express = require("express");
const router = express.Router();
const clubController = require("../controllers/clubController");
const { protect } = require("../middleware/authMiddleware");

router.post("/",protect, clubController.createClub);
router.get("/", clubController.getAllClubs);
router.get("/:id", clubController.getClubById);
router.put("/:id",protect, clubController.updateClub);
router.delete("/:id",protect, clubController.deleteClub);

module.exports = router;
