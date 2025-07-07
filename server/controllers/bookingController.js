const Booking = require("../models/bookingModel");
const Event = require("../models/eventModel");
const User = require("../models/userModel");

const createBooking = async (req, res) => {
  try {
    const { eventId } = req.body;

    // Validate event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if user already has an active booking for this event
    const existingBooking = await Booking.findOne({
      event: eventId,
      user: req.user.id,
      status: "booked",
    });
    console.log("Existing booking check:", {
      eventId,
      userId: req.user.id,
      existingBooking,
    }); // Debug log
    if (existingBooking) {
      return res
        .status(400)
        .json({ message: "You have already booked this event" });
    }

    // Create booking
    const booking = new Booking({
      event: eventId,
      user: req.user.id,
      status: "booked",
    });

    await booking.save();
    console.log("New booking created:", booking); // Debug log
    res.status(201).json({ message: "Event booked successfully", booking });
  } catch (error) {
    console.error("Error in createBooking:", error);
    res.status(500).json({
      message: "Server error (from createBooking)",
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
    console.error("Error in requestCancellation:", error);
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

    // Delete the booking
    await booking.deleteOne();
    console.log("Booking deleted on cancellation approval:", bookingId); // Debug log

    res.status(200).json({ message: "Cancellation approved successfully" });
  } catch (error) {
    console.error("Error in approveCancellation:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const undoCancellation = async (req, res) => {
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
        .json({ message: "Not authorized to undo this cancellation" });
    }

    // Check if cancellation was requested
    if (!booking.cancellationRequested) {
      return res
        .status(400)
        .json({ message: "No cancellation request exists" });
    }

    // Reset cancellation request
    booking.cancellationRequested = false;
    await booking.save();

    res
      .status(200)
      .json({ message: "Cancellation request undone successfully", booking });
  } catch (error) {
    console.error("Error in undoCancellation:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getBookings = async (req, res) => {
  try {
    // Only admins can view all bookings
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("event", "eventName");
    res
      .status(200)
      .json({ message: "Bookings retrieved successfully", bookings });
  } catch (error) {
    console.error("Error in getBookings:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getBookingsByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Validate event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Only admins can view bookings
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const bookings = await Booking.find({ event: eventId })
      .populate("user", "name email")
      .select("user status cancellationRequested");
    res
      .status(200)
      .json({ message: "Bookings retrieved successfully", bookings });
  } catch (error) {
    console.error("Error in getBookingsByEvent:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Find booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Only admins can delete bookings
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    await booking.deleteOne();
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error in deleteBooking:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createBooking,
  requestCancellation,
  approveCancellation,
  undoCancellation,
  getBookings,
  getBookingsByEvent,
  deleteBooking,
};
