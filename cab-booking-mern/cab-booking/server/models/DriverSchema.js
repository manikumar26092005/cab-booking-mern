const mongoose = require("mongoose");

const DriverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    // Driver - Vehicle relationship: one driver is linked to one car (one-to-one).
    // Optional because a driver can register before being assigned a car by admin.
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      default: null,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      default: "driver",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Driver", DriverSchema);
