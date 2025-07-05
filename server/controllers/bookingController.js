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

module.exports = { createBooking };
