const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/AdminSchema");
const User = require("../models/UserSchema");
const Car = require("../models/CarSchema");
const Driver = require("../models/DriverSchema");
const MyBooking = require("../models/MyBookingSchema");

// @route POST /api/admin/register  (use once to seed an admin)
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ name, email, password: hashedPassword });

    res.status(201).json({
      message: "Admin registered successfully",
      admin: { id: admin._id, name: admin.name, email: admin.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route POST /api/admin/login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route GET /api/admin/dashboard
// Returns counts for Users / Cabs / Bookings / Drivers (matches Dashboard UI)
const getDashboardStats = async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const cabsCount = await Car.countDocuments();
    const bookingsCount = await MyBooking.countDocuments();
    const driversCount = await Driver.countDocuments();

    res.status(200).json({
      users: usersCount,
      cabs: cabsCount,
      bookings: bookingsCount,
      drivers: driversCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route GET /api/admin/reports
// Basic reports & analytics: booking status breakdown, revenue, top cars
const getReports = async (req, res) => {
  try {
    const statusBreakdown = await MyBooking.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const revenueAgg = await MyBooking.aggregate([
      { $match: { status: "Completed" } },
      { $group: { _id: null, totalRevenue: { $sum: "$fare" } } },
    ]);

    const topCars = await MyBooking.aggregate([
      { $group: { _id: "$car", rides: { $sum: 1 } } },
      { $sort: { rides: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "cars",
          localField: "_id",
          foreignField: "_id",
          as: "carInfo",
        },
      },
      { $unwind: { path: "$carInfo", preserveNullAndEmptyArrays: true } },
    ]);

    res.status(200).json({
      statusBreakdown,
      totalRevenue: revenueAgg[0]?.totalRevenue || 0,
      topCars: topCars.map((c) => ({
        carModel: c.carInfo?.carModel || "Unknown",
        carNo: c.carInfo?.carNo || "-",
        rides: c.rides,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  getDashboardStats,
  getReports,
};
