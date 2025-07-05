const express = require("express");
const router = express.Router();
const { createEvent, getEvents } = require("../controllers/eventController");
const validateEvent = require("../middlewares/validateEvent");
const { protect, restrictTo } = require("../middlewares/authMiddleware");

// Create a new event (admin-only)
router.post("/", protect, restrictTo("admin"), validateEvent, createEvent);

// Retrieve all events (optional authentication)
router.get(
  "/",
  (req, res, next) => {
    // Make protect middleware optional
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      protect(req, res, () => next());
    } else {
      next();
    }
  },
  getEvents
);

module.exports = router;
