const express = require("express");
const router = express.Router();
const {
  createBooking,
  requestCancellation,
  approveCancellation,
  getBookings,
  
} = require("../controllers/bookingController");
const { protect, restrictTo } = require("../middlewares/authMiddleware");

//  Book an event (employee-only)
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
router.get('/',protect,restrictTo( 'admin'),getBookings)

module.exports = router;
