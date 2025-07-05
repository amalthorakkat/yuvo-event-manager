const Booking = require("../models/bookingModel");
const Event = require("../models/eventModel");

const createBooking = async (req, res) => {
  try {
    const { eventId } = req.body;

    // Validate event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    //check if user already booked this event
    const existingBooking = await Booking.findOne({
      event: eventId,
      user: req.user.id,
    });
    if (existingBooking) {
      return res
        .status(400)
        .json({ message: "You have already booked this event" });
    }

    // create booking
    const booking = new Booking({
      event: eventId,
      user: req.user.id,
      status: "booked",
    });

    await booking.save();
    res.status(201).json({ message: "Event booked successfully", booking });
  } catch (error) {
    res.status(500).json({
      message: "Server error (from createBooking) ",
      error: error.message,
    });
  }
};

const requestCancellation = async (req, res) => {
  try {
    const { bookingId } = req.body;

    // Find booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if user owns the booking
    if (booking.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this booking" });
    }

    // Check if already cancelled or requested
    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking already cancelled" });
    }
    if (booking.cancellationRequested) {
      return res
        .status(400)
        .json({ message: "Cancellation already requested" });
    }

    // Mark cancellation requested
    booking.cancellationRequested = true;
    await booking.save();

    res
      .status(200)
      .json({ message: "Cancellation requested successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const approveCancellation = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Find booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if cancellation was requested
    if (!booking.cancellationRequested) {
      return res
        .status(400)
        .json({ message: "No cancellation requested for this booking" });
    }

    // Update status to cancelled
    booking.status = "cancelled";
    booking.cancellationRequested = false;
    await booking.save();

    res
      .status(200)
      .json({ message: "Cancellation approved successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createBooking, requestCancellation, approveCancellation };
