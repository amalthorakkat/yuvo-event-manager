const mongoose = require("mongoose");

const wageConfigSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["employee", "supervisor"],
      required: true,
      unique: true,
    },
    wage: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WageConfig", wageConfigSchema);
