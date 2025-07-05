const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");
const { protect, restrictTo } = require("../middlewares/authMiddleware");

// Register a new user (admin-only for now)
router.post("/register", protect, restrictTo("admin"), registerUser);

// router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

module.exports = router;
