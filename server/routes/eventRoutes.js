const express = require("express");
const router = express.Router();
const { createEvent, getEvents } = require("../controllers/eventController");
const validateEvent = require("../middlewares/validateEvent");
const { protect, restrictTo } = require("../middlewares/authMiddleware");

// Create a new event (admin-only)
router.post("/", protect, restrictTo("admin"), validateEvent, createEvent);
// Retrieve all events
router.get("/", getEvents);

module.exports = router;
