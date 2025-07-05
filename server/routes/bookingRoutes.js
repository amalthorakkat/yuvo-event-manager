const express = require("express");
const router = express.Router();
const { createBooking } = require("../controllers/bookingController");
const { protect, restrictTo } = require("../middlewares/authMiddleware");

//  Book an event (employee-only)
router.post("/", protect, restrictTo("employee"), createBooking);

module.exports = router;
