const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ["admin", "employee", "supervisor"],
    default: "employee",
  },
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  workHistory: [
    {
      eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
      eventName: { type: String },
      date: { type: Date },
      attendance: {
        type: String,
        enum: ["attended", "absent", "pending"],
        default: "pending",
      },
      wage: {
        type: Number,
        default: 0,
        min: 0,
      },
      fine: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
  ],
  totalWages: {
    type: Number,
    default: 0,
    min: 0,
  },
  balance: {
    type: Number,
    default: 0,
  },
  amountPaid: {
    type: Number,
    default: 0,
  },
});

// hash the password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// compare password for login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
