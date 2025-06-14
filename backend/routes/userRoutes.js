const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");



//router.get("/dashboard",protect, userController.getUserDashboard);
router.put("/update", userController.updateUserProfile);

router.get("/:id", userController.getUserById);
router.get("/", userController.getAllUsers);
router.delete("/:id", userController.deleteUser);

module.exports = router;
