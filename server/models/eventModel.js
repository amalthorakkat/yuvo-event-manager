const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: [true, "Event name is required"],
  },
  auditorium: {
    type: String,
    required: [true, "Auditorium name is required"],
  },
  eventType: {
    type: String,
    required: [true, "Event type is required"],
  },
  dateTime: {
    type: Date,
    required: [true, "Event date and time are required"],
  },
  location: {
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Creator is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Event", eventSchema);
