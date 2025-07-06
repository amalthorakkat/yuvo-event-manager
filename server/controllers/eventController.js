const Event = require("../models/eventModel");
const Booking = require("../models/bookingModel");

// Create Event
const createEvent = async (req, res) => {
  try {
    const { eventName, auditorium, eventType, dateTime, location } = req.body;

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
    console.error("Error in createEvent:", error);
    res.status(500).json({
      message: "Server error (from createEvents) ",
      error: error.message,
    });
  }
};

// Get Event
const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ dateTime: 1 });

    // Initialize events with default booking status
    let eventsWithBookingStatus = events.map((event) => ({
      ...event._doc,
      isBooked: false,
      bookingId: null,
    }));

    // If user is authenticated, include booking status and bookingId
    if (req.user && req.user.id) {
      const bookings = await Booking.find({ user: req.user.id });
      const bookedEventIds = bookings.map((b) => b.event.toString());
      eventsWithBookingStatus = events.map((event) => {
        const booking = bookings.find(
          (b) => b.event.toString() === event._id.toString()
        );
        return {
          ...event._doc,
          isBooked: bookedEventIds.includes(event._id.toString()),
          bookingId: booking ? booking._id : null,
        };
      });
    }

    res.status(200).json({
      message: "Events retrieved successfully",
      events: eventsWithBookingStatus,
    });
  } catch (error) {
    console.error("Error in getEvents:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//get event by ID
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ message: "Event retrieved successfully", event });
  } catch (error) {
    console.error("Error in getEventById:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//Update the event
const updateEvent = async (req, res) => {
  try {
    const { eventName, auditorium, eventType, dateTime, location } = req.body;
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    if (event.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this event" });
    }

    event.eventName = eventName || event.eventName;
    event.auditorium = auditorium || event.auditorium;
    event.eventType = eventType || event.eventType;
    event.dateTime = dateTime || event.dateTime;
    event.location = location || event.location;
    await event.save();
    res.status(200).json({ message: "Event updated successfully", event });
  } catch (error) {
    console.error("Error in updateEvent:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// delete the event
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this event" });
    }
    await Booking.deleteMany({ event: event._id });
    await event.deleteOne();
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error in deleteEvent:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  getEventById,
};
