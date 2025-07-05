const Event = require("../models/eventModel");

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
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Event
const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ dateTime: 1 }); //sort by dateTime ascending
    res.status(200).json({ message: "Events retrieved successfully", events });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createEvent, getEvents };
