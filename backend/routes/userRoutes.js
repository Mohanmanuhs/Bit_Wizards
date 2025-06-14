const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const clubController = require("../controllers/clubController");
const { protect } = require("../middleware/authMiddleware");



//router.get("/dashboard",protect, userController.getUserDashboard);
router.put("/update", protect,userController.updateUserProfile);
router.post("/follow/:clubId", protect, clubController.followClub);
router.post("/unfollow/:clubId", protect, clubController.unfollowClub);
router.get("/:id",protect, userController.getUserById);
router.get("/", protect,userController.getAllUsers);
router.delete("/:id",protect, userController.deleteUser);

module.exports = router;
