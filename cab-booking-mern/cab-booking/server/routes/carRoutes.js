const express = require("express");
const router = express.Router();
const { addCar, getAllCars, getCarById, updateCar, deleteCar, getCarCategories } = require("../controllers/carController");
const { authMiddleware, adminMiddleware } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/multer");

router.get("/", getAllCars); // public - users browse available cabs
router.get("/categories", getCarCategories); // must come before /:id
router.get("/:id", getCarById);

// Admin only
router.post("/", authMiddleware, adminMiddleware, upload.single("carImage"), addCar);
router.put("/:id", authMiddleware, adminMiddleware, upload.single("carImage"), updateCar);
router.delete("/:id", authMiddleware, adminMiddleware, deleteCar);

module.exports = router;
