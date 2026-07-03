const mongoose = require("mongoose");

const MyBookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },
    // Ride - Driver relationship: many rides can be assigned to one driver (many-to-one).
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      default: null,
    },
    pickupState: { type: String, required: true },
    pickupCity: { type: String, required: true },
    dropState: { type: String, required: true },
    dropCity: { type: String, required: true },
    pickupDate: { type: Date, required: true },
    pickupTime: { type: String, required: true },
    dropDate: { type: Date },
    dropTime: { type: String },
    fare: {
      type: Number,
      required: true,
    },
    // Overall ride lifecycle status (admin/system view)
    status: {
      type: String,
      enum: ["Pending", "On the Way", "Completed", "Cancelled"],
      default: "Pending",
    },
    // Driver's own response to the assigned ride request
    driverRequestStatus: {
      type: String,
      enum: ["Awaiting", "Accepted", "Rejected", "N/A"],
      default: "N/A",
    },
    isScheduled: {
      type: Boolean,
      default: false,
    },
    rescheduleHistory: [
      {
        previousPickupDate: Date,
        previousPickupTime: String,
        changedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("MyBooking", MyBookingSchema);
