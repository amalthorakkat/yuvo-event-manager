const mongoose = require("mongoose");

const auditoriumSchema = new mongoose.Schema(
  {
    name: { type: String },
    description: { type: String },
    location: {
      address: { type: String },
      city: { type: String },
      district: { type: String },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
      mapUrl: { type: String },
    },
    capacity: { type: String }, 
    pricePerDay: { type: Number },
    facilities: {
      ac: { type: Boolean },
      stageAvailable: { type: Boolean },
      projector: { type: Boolean },
      soundSystem: { type: Boolean },
      wifi: { type: Boolean },
      parking: { type: Boolean },
    },
    contact: {
      phone: { type: String },
      email: { type: String },
    },
    rules: {
      smokingAllowed: { type: Boolean },
      alcoholAllowed: { type: Boolean },
    },
    images: [
      {
        src: { type: String },
        alt: { type: String }, 
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Auditorium", auditoriumSchema);