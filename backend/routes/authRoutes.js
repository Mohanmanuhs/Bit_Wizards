const express = require("express");
const router = express.Router();

// Example route
router.get("/login", (req, res) => {
  res.send("Login route working");
});

module.exports = router;
