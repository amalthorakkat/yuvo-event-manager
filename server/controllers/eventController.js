const Event = require("../models/eventModel");
const Booking = require("../models/bookingModel");

// Create Event
const createEvent = async (req, res) => {
  try {
    const { eventName, auditorium, eventType, dateTime, location } = req.body;

    const createdBy = "60d5ecbb9f1b2c001f8e4c7a"; //mock user id  admin authentication (to be implemented later)

    const event = new Event({
      eventName,
      auditorium,
      eventType,
      dateTime,
      location,
      createdBy: req.user.id,
    });

    await event.save();
    res.status(201).json({ message: "Event created successfully", event });
  } catch (error) {
    res.status(500).json({
      message: "Server error (from createEvents) ",
      error: error.message,
    });
  }
};

// Get Event
const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ dateTime: 1 }); //sort by dateTime ascending

    // If user is authenticated, include booking status
    let eventsWithBookingStatus = events;
    if (req.user) {
      const bookings = await Booking.find({ user: req.user.id });
      const bookedEventsIds = bookings.map((b) => b.event.toString());
      eventsWithBookingStatus = events.map((event) => ({
        ...event._doc,
        isBooked: bookedEventsIds.includes(event._id.toString()),
      }));
    }

    res
      .status(200)
      .json({
        message: "Events retrieved successfully",
        events: eventsWithBookingStatus,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error (from getEvents)", error: error.message });
  }
};

module.exports = { createEvent, getEvents };
