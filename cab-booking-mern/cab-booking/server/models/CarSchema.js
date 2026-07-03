const mongoose = require("mongoose");

const CarSchema = new mongoose.Schema(
  {
    driverName: {
      type: String,
      required: true,
      trim: true,
    },
    carModel: {
      type: String,
      required: true,
      trim: true,
    },
    carType: {
      type: String, // e.g. Hatchback, Sedan, SUV, Bike
      required: true,
      trim: true,
    },
    carNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    price: {
      type: Number, // price per km
      required: true,
    },
    carImage: {
      type: String, // file path stored by multer
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Car", CarSchema);
