require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const eventRoutes = require("./routes/eventRoutes");
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const userRoutes = require("./routes/userRoutes");
const auditoriumRoutes = require("./routes/auditoriumRoutes");

const app = express();

// configure CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Debug: Log MONGO_URI
console.log("MONGO_URI:", process.env.MONGO_URI);

// middlewares
// Middleware for JSON parsing (skip for multipart/form-data)
app.use((req, res, next) => {
  if (req.headers["content-type"]?.startsWith("multipart/form-data")) {
    return next(); // Skip express.json() for multipart/form-data
  }
  express.json()(req, res, next); // Apply JSON parsing for other requests
});
// app.use(express.json());

// connect to mongoDB
connectDB();

// routes
app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auditoriums", auditoriumRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on PORT :${PORT}`));
