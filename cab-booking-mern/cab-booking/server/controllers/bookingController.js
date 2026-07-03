const MyBooking = require("../models/MyBookingSchema");
const Car = require("../models/CarSchema");
const Driver = require("../models/DriverSchema");

// Simple fare calculator placeholder — replace with real distance/time logic if needed
const calculateFare = (pricePerKm, estimatedKm = 10) => {
  return Math.round(pricePerKm * estimatedKm);
};

// Finds a driver currently linked to this car (Driver-Vehicle is one-to-one in this app).
// If none is linked, the ride is created unassigned and admin can assign one later.
const findDriverForCar = async (carId) => {
  const driver = await Driver.findOne({ car: carId });
  return driver ? driver._id : null;
};

// @route POST /api/bookings  (BookCab form submit)
const createBooking = async (req, res) => {
  try {
    const {
      carId,
      pickupState,
      pickupCity,
      dropState,
      dropCity,
      pickupDate,
      pickupTime,
      dropDate,
      dropTime,
      estimatedKm,
      isScheduled,
    } = req.body;

    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ message: "Car not found" });

    const fare = calculateFare(car.price, estimatedKm);
    const driverId = await findDriverForCar(carId);

    const booking = await MyBooking.create({
      user: req.user.id,
      car: carId,
      driver: driverId,
      pickupState,
      pickupCity,
      dropState,
      dropCity,
      pickupDate,
      pickupTime,
      dropDate,
      dropTime,
      fare,
      status: "Pending",
      driverRequestStatus: driverId ? "Awaiting" : "N/A",
      isScheduled: Boolean(isScheduled),
    });

    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route GET /api/bookings/my  (User My Bookings page)
const getMyBookings = async (req, res) => {
  try {
    const bookings = await MyBooking.find({ user: req.user.id })
      .populate("car", "driverName carModel carType carNo price carImage")
      .populate("driver", "name phone")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route GET /api/bookings/:id  (single booking - used for receipt view)
const getBookingById = async (req, res) => {
  try {
    const booking = await MyBooking.findById(req.params.id)
      .populate("user", "name email")
      .populate("car", "driverName carModel carType carNo price")
      .populate("driver", "name phone");

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (req.user.role !== "admin" && String(booking.user._id) !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route GET /api/bookings  (Admin Bookings page - all bookings)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await MyBooking.find()
      .populate("user", "name email")
      .populate("car", "driverName carModel carType carNo price")
      .populate("driver", "name phone")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route PUT /api/bookings/:id/status  (Admin updates ride status)
// @route PUT /api/bookings/:id/status  (Admin updates ride status)
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["Pending", "On the Way", "Completed", "Cancelled"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const booking = await MyBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = status;
    await booking.save();

    // Update driver's earnings when booking is completed
    if (status === "Completed" && booking.driver) {
      await Driver.findByIdAndUpdate(
        booking.driver,
        { $inc: { totalEarnings: booking.fare } },
        { new: true }
      );
    }

    res.status(200).json({
      message: "Booking status updated",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @route PUT /api/bookings/:id/assign-driver  (Admin manually assigns/reassigns a driver)
const assignDriverToBooking = async (req, res) => {
  try {
    const { driverId } = req.body;

    const driver = await Driver.findById(driverId);
    if (!driver) return res.status(404).json({ message: "Driver not found" });

    const booking = await MyBooking.findByIdAndUpdate(
      req.params.id,
      { driver: driverId, driverRequestStatus: "Awaiting" },
      { new: true }
    );

    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json({ message: "Driver assigned to booking", booking });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route PUT /api/bookings/:id/reschedule  (User reschedules a pending booking)
const rescheduleBooking = async (req, res) => {
  try {
    const { pickupDate, pickupTime } = req.body;

    const booking = await MyBooking.findOne({ _id: req.params.id, user: req.user.id });
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.status !== "Pending") {
      return res.status(400).json({ message: "Only pending bookings can be rescheduled" });
    }

    booking.rescheduleHistory.push({
      previousPickupDate: booking.pickupDate,
      previousPickupTime: booking.pickupTime,
    });
    booking.pickupDate = pickupDate;
    booking.pickupTime = pickupTime;
    booking.isScheduled = true;

    await booking.save();
    res.status(200).json({ message: "Booking rescheduled successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route DELETE /api/bookings/:id  (cancel booking — by user or admin)
const cancelBooking = async (req, res) => {
  try {
    const filter =
      req.user.role === "admin" ? { _id: req.params.id } : { _id: req.params.id, user: req.user.id };

    const booking = await MyBooking.findOneAndUpdate(
      filter,
      { status: "Cancelled" },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json({ message: "Booking cancelled", booking });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route GET /api/bookings/:id/receipt  (returns receipt data for download/print on the client)
const getBookingReceipt = async (req, res) => {
  try {
    const booking = await MyBooking.findById(req.params.id)
      .populate("user", "name email")
      .populate("car", "driverName carModel carType carNo price")
      .populate("driver", "name phone");

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (req.user.role !== "admin" && String(booking.user._id) !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    const receipt = {
      receiptId: `RCPT-${booking._id.toString().slice(-8).toUpperCase()}`,
      issuedAt: new Date(),
      rider: booking.user.name,
      driver: booking.driver ? booking.driver.name : "Unassigned",
      car: `${booking.car.carModel} (${booking.car.carNo})`,
      trip: `${booking.pickupCity} -> ${booking.dropCity}`,
      pickup: `${booking.pickupDate.toDateString()} ${booking.pickupTime}`,
      fare: booking.fare,
      status: booking.status,
    };

    res.status(200).json(receipt);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  getAllBookings,
  updateBookingStatus,
  assignDriverToBooking,
  rescheduleBooking,
  cancelBooking,
  getBookingReceipt,
};
