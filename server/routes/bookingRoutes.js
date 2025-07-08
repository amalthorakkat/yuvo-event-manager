const express = require("express");
const router = express.Router();
const {
  createBooking,
  requestCancellation,
  approveCancellation,
  getBookings,
  undoCancellation,
  getBookingsByEvent,
  deleteBooking,
  markAttendance,
  assignFine,
  setWageConfig,
  getWorkHistory,
} = require("../controllers/bookingController");
const { protect, restrictTo } = require("../middlewares/authMiddleware");

// Book an event (employee-only)
router.post("/", protect, restrictTo("employee"), createBooking);

// Request cancellation (employee-only)
router.post("/cancel", protect, restrictTo("employee"), requestCancellation);

// Approve cancellation (admin-only)
router.put(
  "/:bookingId/approve-cancel",
  protect,
  restrictTo("admin"),
  approveCancellation
);

// Get all bookings (admin-only)
router.get("/", protect, restrictTo("admin"), getBookings);

// Undo the cancellation request
router.post("/undo-cancel", protect, restrictTo("employee"), undoCancellation);

// Fetching event-specific bookings
router.get(
  "/event/:eventId",
  protect,
  restrictTo("admin", "supervisor"),
  getBookingsByEvent
);

// Deleting a booking
router.delete("/:bookingId", protect, restrictTo("admin"), deleteBooking);

router.post(
  "/event/:eventId/attendance",
  protect,
  restrictTo("admin", "supervisor"),
  markAttendance
);
router.post(
  "/event/:eventId/fines",
  protect,
  restrictTo("admin", "supervisor"),
  assignFine
);
router.post("/wages/config", protect, restrictTo("admin"), setWageConfig);
router.get("/user/:userId/work-history", protect, getWorkHistory);

module.exports = router;
