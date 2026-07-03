const Car = require("../models/CarSchema");
const Driver = require("../models/DriverSchema");
const bcrypt = require("bcryptjs");

// @route POST /api/cars (Admin Add Car form)
const addCar = async (req, res) => {
  try {
    const {
      driverName,
      email,
      phone,
      carModel,
      carType,
      carNo,
      price,
    } = req.body;

    if (
      !driverName ||
      !email ||
      !phone ||
      !carModel ||
      !carType ||
      !carNo ||
      !price
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingCar = await Car.findOne({ carNo });

    if (existingCar) {
      return res.status(400).json({
        message: "A car with this number already exists",
      });
    }

    const carImage = req.file ? `/uploads/${req.file.filename}` : "";

    const car = await Car.create({
      driverName,
      carModel,
      carType,
      carNo,
      price,
      carImage,
    });

    let driver = await Driver.findOne({ email });

    if (!driver) {
      const password = await bcrypt.hash("123456", 10);

      driver = await Driver.create({
        name: driverName,
        email,
        phone,
        password,
        car: car._id,
      });
    } else {
      driver.name = driverName;
      driver.phone = phone;
      driver.car = car._id;
      await driver.save();
    }

    res.status(201).json({
      message: "Car and Driver added successfully",
      car,
      driver,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @route GET /api/cars
const getAllCars = async (req, res) => {
  try {
    const { search, type, sort } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        { driverName: { $regex: search, $options: "i" } },
        { carModel: { $regex: search, $options: "i" } },
      ];
    }

    if (type) {
      filter.carType = {
        $regex: type,
        $options: "i",
      };
    }

    let query = Car.find(filter);

    if (sort === "asc") query = query.sort({ price: 1 });
    if (sort === "desc") query = query.sort({ price: -1 });

    const cars = await query.exec();

    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @route GET /api/cars/:id
const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        message: "Car not found",
      });
    }

    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @route PUT /api/cars/:id
const updateCar = async (req, res) => {
  try {
    const {
      driverName,
      carModel,
      carType,
      carNo,
      price,
    } = req.body;

    const updateData = {
      driverName,
      carModel,
      carType,
      carNo,
      price,
    };

    if (req.file) {
      updateData.carImage = `/uploads/${req.file.filename}`;
    }

    const car = await Car.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!car) {
      return res.status(404).json({
        message: "Car not found",
      });
    }

    res.status(200).json({
      message: "Car updated successfully",
      car,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @route DELETE /api/cars/:id
const deleteCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);

    if (!car) {
      return res.status(404).json({
        message: "Car not found",
      });
    }

    await Driver.findOneAndUpdate(
      { car: car._id },
      { car: null }
    );

    res.status(200).json({
      message: "Car deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @route GET /api/cars/categories
const getCarCategories = async (req, res) => {
  try {
    const categories = await Car.distinct("carType");

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  addCar,
  getAllCars,
  getCarById,
  updateCar,
  deleteCar,
  getCarCategories,
};