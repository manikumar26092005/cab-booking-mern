const express = require("express");
const router = express.Router();
const { registerAdmin, loginAdmin, getDashboardStats, getReports } = require("../controllers/adminController");
const { authMiddleware, adminMiddleware } = require("../middlewares/authMiddleware");

router.post("/register", registerAdmin); // use once to seed initial admin
router.post("/login", loginAdmin);
router.get("/dashboard", authMiddleware, adminMiddleware, getDashboardStats);
router.get("/reports", authMiddleware, adminMiddleware, getReports);

module.exports = router;
