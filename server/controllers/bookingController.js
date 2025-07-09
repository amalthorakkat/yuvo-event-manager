const Booking = require("../models/bookingModel");
const Event = require("../models/eventModel");
const User = require("../models/userModel");
const WageConfig = require("../models/wageConfigModel");
const PaymentHistory = require("../models/paymentHistoryModel");

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
    });
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
    console.log("New booking created:", booking);
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
    console.log("Booking deleted on cancellation approval:", bookingId);

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

    // Validate eventId format
    if (!eventId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid event ID format" });
    }

    // Validate event exists
    const event = await Event.findById(eventId);
    console.log("Event check in getBookingsByEvent:", { eventId, event });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Only admins and supervisors can view bookings
    if (!["admin", "supervisor"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const bookings = await Booking.find({ event: eventId })
      .populate("user", "name email")
      .select("user status cancellationRequested attendance fine");
    console.log("Bookings for event:", { eventId, bookings });
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

const markAttendance = async (req, res) => {
  try {
    const { bookingId, attendance } = req.body;
    const { eventId } = req.params;

    if (!["attended", "absent"].includes(attendance)) {
      return res.status(400).json({ message: "Invalid attendance status" });
    }

    const booking = await Booking.findById(bookingId).populate("user event");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.event._id.toString() !== eventId) {
      return res
        .status(400)
        .json({ message: "Booking does not belong to this event" });
    }

    const user = await User.findById(booking.user._id);
    const existingEntry = user.workHistory.find(
      (entry) => entry.eventId.toString() === eventId
    );

    booking.attendance = attendance;
    await booking.save();

    if (attendance === "attended") {
      const wageConfig = await WageConfig.findOne({ role: booking.user.role });
      const wage = wageConfig
        ? wageConfig.wage
        : booking.user.role === "supervisor"
        ? 750
        : 450;
      const fine = booking.fine || 0;

      const workHistoryEntry = {
        eventId: booking.event._id,
        eventName: booking.event.eventName,
        date: booking.event.dateTime,
        attendance,
        wage,
        fine,
      };

      if (existingEntry) {
        await User.findByIdAndUpdate(
          booking.user._id,
          {
            $set: { "workHistory.$[elem]": workHistoryEntry },
            $inc: {
              totalWages:
                -existingEntry.wage + existingEntry.fine + wage - fine,
              balance: -existingEntry.wage + existingEntry.fine + wage - fine,
            },
          },
          {
            arrayFilters: [{ "elem.eventId": booking.event._id }],
            new: true,
          }
        );
      } else {
        await User.findByIdAndUpdate(
          booking.user._id,
          {
            $push: { workHistory: workHistoryEntry },
            $inc: { totalWages: wage - fine, balance: wage - fine },
          },
          { new: true }
        );
      }
    } else if (attendance === "absent" && existingEntry) {
      await User.findByIdAndUpdate(
        booking.user._id,
        {
          $pull: { workHistory: { eventId: booking.event._id } },
          $inc: {
            totalWages: -existingEntry.wage + existingEntry.fine,
            balance: -existingEntry.wage + existingEntry.fine,
          },
        },
        { new: true }
      );
    }

    const updatedUser = await User.findById(booking.user._id);
    console.log("Attendance marked:", {
      bookingId,
      attendance,
      userId: booking.user._id,
      workHistory: updatedUser.workHistory,
      totalWages: updatedUser.totalWages,
      balance: updatedUser.balance,
    });
    res.status(200).json({ message: "Attendance marked successfully" });
  } catch (error) {
    console.error("Mark attendance error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const assignFine = async (req, res) => {
  try {
    const { bookingId, fine } = req.body;
    const { eventId } = req.params;

    if (typeof fine !== "number" || fine < 0) {
      return res.status(400).json({ message: "Invalid fine amount" });
    }

    const booking = await Booking.findById(bookingId).populate("user event");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.event._id.toString() !== eventId) {
      return res
        .status(400)
        .json({ message: "Booking does not belong to this event" });
    }

    const prevFine = booking.fine || 0;
    booking.fine = fine;
    await booking.save();

    if (booking.attendance === "attended") {
      const updatedUser = await User.findByIdAndUpdate(
        booking.user._id,
        {
          $set: { "workHistory.$[elem].fine": fine },
          $inc: { totalWages: prevFine - fine, balance: prevFine - fine },
        },
        {
          arrayFilters: [{ "elem.eventId": booking.event._id }],
          new: true,
        }
      );
      console.log("Fine assigned:", {
        bookingId,
        fine,
        userId: booking.user._id,
        workHistory: updatedUser.workHistory,
        totalWages: updatedUser.totalWages,
        balance: updatedUser.balance,
      });
    }

    res.status(200).json({ message: "Fine assigned successfully" });
  } catch (error) {
    console.error("Assign fine error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const setWageConfig = async (req, res) => {
  try {
    const { role, wage } = req.body;

    // Only admins can set wage config
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Validate inputs
    if (!["employee", "supervisor"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    if (typeof wage !== "number" || wage < 0) {
      return res
        .status(400)
        .json({ message: "Wage must be a non-negative number" });
    }

    // Update or create wage config
    const wageConfig = await WageConfig.findOneAndUpdate(
      { role },
      { wage },
      { upsert: true, new: true }
    );

    console.log("Wage config updated:", { role, wage });

    res
      .status(200)
      .json({ message: "Wage config updated successfully", wageConfig });
  } catch (error) {
    console.error("Error in setWageConfig:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getWorkHistory = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select(
      "workHistory totalWages balance amountPaid"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("Work history fetched:", {
      userId: req.params.userId,
      workHistory: user.workHistory,
      totalWages: user.totalWages,
      balance: user.balance,
      amountPaid: user.amountPaid,
    });
    res.status(200).json({ user });
  } catch (error) {
    console.error("Get work history error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const searchEmployeeEarnings = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const user = await User.findOne({ email }).select(
      "name email workHistory totalWages balance amountPaid"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("Employee earnings fetched:", {
      userId: user._id,
      workHistory: user.workHistory,
      totalWages: user.totalWages,
      balance: user.balance,
      amountPaid: user.amountPaid,
    });
    res.status(200).json({ user });
  } catch (error) {
    console.error("Search employee earnings error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const processPayment = async (req, res) => {
  try {
    const { employeeId, amountPaid } = req.body;
    const adminId = req.user.id;

    if (!employeeId || typeof amountPaid !== "number" || amountPaid < 0) {
      return res
        .status(400)
        .json({ message: "Employee ID and valid amount paid are required" });
    }

    const user = await User.findById(employeeId);
    if (!user) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (amountPaid > user.balance) {
      return res
        .status(400)
        .json({ message: "Payment amount exceeds balance" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      employeeId,
      {
        $inc: { amountPaid: amountPaid, balance: -amountPaid },
      },
      { new: true }
    );

    const payment = new PaymentHistory({
      adminId,
      employeeId,
      amountPaid,
    });
    await payment.save();

    console.log("Payment processed:", {
      adminId,
      employeeId,
      amountPaid,
      balance: updatedUser.balance,
      amountPaid: updatedUser.amountPaid,
    });
    res.status(200).json({
      message: "Payment processed successfully",
      balance: updatedUser.balance,
    });
  } catch (error) {
    console.error("Process payment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getPaymentHistory = async (req, res) => {
  try {
    const adminId = req.user.id;
    const payments = await PaymentHistory.find({ adminId }).populate(
      "employeeId",
      "name email"
    );
    console.log("Payment history fetched:", { adminId, payments });
    res.status(200).json({ payments });
  } catch (error) {
    console.error("Get payment history error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getWageConfig = async (req, res) => {
  try {
    // Only admins can view wage config
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const wageConfigs = await WageConfig.find({
      role: { $in: ["employee", "supervisor"] },
    });
    const employeeWage =
      wageConfigs.find((config) => config.role === "employee")?.wage || 450;
    const supervisorWage =
      wageConfigs.find((config) => config.role === "supervisor")?.wage || 750;

    console.log("Wage config fetched:", { employeeWage, supervisorWage });

    res.status(200).json({ employeeWage, supervisorWage });
  } catch (error) {
    console.error("Error in getWageConfig:", error);
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
  markAttendance,
  assignFine,
  setWageConfig,
  getWorkHistory,
  searchEmployeeEarnings,
  processPayment,
  getPaymentHistory,
  getWageConfig,
};
