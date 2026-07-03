const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Driver = require("../models/DriverSchema");
const MyBooking = require("../models/MyBookingSchema");
const Car = require("../models/CarSchema");

// @route POST /api/drivers/register  (Dregister)
const registerDriver = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existingDriver = await Driver.findOne({ email });
    if (existingDriver) {
      return res.status(400).json({ message: "Driver already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const driver = await Driver.create({ name, email, password: hashedPassword, phone });

    res.status(201).json({
      message: "Driver registered successfully. An admin will assign you a vehicle.",
      driver: { id: driver._id, name: driver.name, email: driver.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route POST /api/drivers/login  (Dlogin)
const loginDriver = async (req, res) => {
  try {
    const { email, password } = req.body;

    const driver = await Driver.findOne({ email });
    if (!driver) {
      return res.status(404).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, driver.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: driver._id, role: "driver" },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      driver: { id: driver._id, name: driver.name, email: driver.email, car: driver.car },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route GET /api/drivers/profile
const getDriverProfile = async (req, res) => {
  try {
    const driver = await Driver.findById(req.user.id).select("-password").populate("car");
    if (!driver) return res.status(404).json({ message: "Driver not found" });
    res.status(200).json(driver);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route GET /api/drivers/rides  (Dhome - assigned rides, "view assigned rides")
const getAssignedRides = async (req, res) => {
  try {
    const rides = await MyBooking.find({ driver: req.user.id })
      .populate("user", "name email")
      .populate("car", "carModel carType carNo price")
      .sort({ createdAt: -1 });

    res.status(200).json(rides);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route PUT /api/drivers/rides/:id/respond  (accept/reject ride request)
const respondToRide = async (req, res) => {
  try {
    const { response } = req.body; // "Accepted" | "Rejected"

    if (!["Accepted", "Rejected"].includes(response)) {
      return res.status(400).json({ message: "Response must be Accepted or Rejected" });
    }

    const ride = await MyBooking.findOne({ _id: req.params.id, driver: req.user.id });
    if (!ride) return res.status(404).json({ message: "Ride not found for this driver" });

    ride.driverRequestStatus = response;
    // If the driver rejects, unassign so admin can reassign and reopen the ride
    if (response === "Rejected") {
      ride.driver = null;
      ride.status = "Pending";
    } else {
      ride.status = "On the Way";
    }

    await ride.save();
    res.status(200).json({ message: `Ride ${response.toLowerCase()}`, ride });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route PUT /api/drivers/rides/:id/status  (update ride status: started, completed)
const updateRideStatus = async (req, res) => {
  try {
    const { status } = req.body; // "On the Way" | "Completed"
    const validStatuses = ["On the Way", "Completed"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status for driver update" });
    }

    const ride = await MyBooking.findOne({ _id: req.params.id, driver: req.user.id });
    if (!ride) return res.status(404).json({ message: "Ride not found for this driver" });

    ride.status = status;
    await ride.save();

    // Credit driver earnings once a ride is marked completed
    if (status === "Completed") {
      await Driver.findByIdAndUpdate(req.user.id, { $inc: { totalEarnings: ride.fare } });
    }

    res.status(200).json({ message: "Ride status updated", ride });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route GET /api/drivers/earnings  (view earnings and ride history)
const getEarnings = async (req, res) => {
  try {
    const driver = await Driver.findById(req.user.id).select("totalEarnings name");
    const completedRides = await MyBooking.find({ driver: req.user.id, status: "Completed" })
      .populate("user", "name")
      .populate("car", "carModel carNo")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      totalEarnings: driver.totalEarnings,
      ridesCompleted: completedRides.length,
      history: completedRides,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route GET /api/drivers  (admin - list all drivers)
const getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find().select("-password").populate("car");
    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route PUT /api/drivers/:id/assign-car  (admin assigns a vehicle to a driver)
const assignCarToDriver = async (req, res) => {
  try {
    const { carId } = req.body;

    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ message: "Car not found" });

    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      { car: carId },
      { new: true }
    ).populate("car");

    if (!driver) return res.status(404).json({ message: "Driver not found" });
    res.status(200).json({ message: "Car assigned to driver", driver });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route DELETE /api/drivers/:id  (admin removes a driver)
const deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);
    if (!driver) return res.status(404).json({ message: "Driver not found" });
    res.status(200).json({ message: "Driver deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  registerDriver,
  loginDriver,
  getDriverProfile,
  getAssignedRides,
  respondToRide,
  updateRideStatus,
  getEarnings,
  getAllDrivers,
  assignCarToDriver,
  deleteDriver,
};
