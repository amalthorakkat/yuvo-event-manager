const express = require("express");
const router = express.Router();
const { createEvent, getEvents, getEventById, updateEvent, deleteEvent } = require("../controllers/eventController");
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

router.get("/:id", protect, restrictTo("admin"), getEventById);
router.put("/:id", protect, restrictTo("admin"), validateEvent, updateEvent);
router.delete("/:id", protect, restrictTo("admin"), deleteEvent);

module.exports = router;
