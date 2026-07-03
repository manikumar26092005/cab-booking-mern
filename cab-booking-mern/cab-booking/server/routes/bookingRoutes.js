const express = require("express");
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getBookingById,
  getAllBookings,
  updateBookingStatus,
  assignDriverToBooking,
  rescheduleBooking,
  cancelBooking,
  getBookingReceipt,
} = require("../controllers/bookingController");
const { authMiddleware, adminMiddleware } = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, createBooking);
router.get("/my", authMiddleware, getMyBookings);
router.get("/", authMiddleware, adminMiddleware, getAllBookings);
router.get("/:id", authMiddleware, getBookingById);
router.get("/:id/receipt", authMiddleware, getBookingReceipt);
router.put("/:id/status", authMiddleware, adminMiddleware, updateBookingStatus);
router.put("/:id/assign-driver", authMiddleware, adminMiddleware, assignDriverToBooking);
router.put("/:id/reschedule", authMiddleware, rescheduleBooking);
router.delete("/:id", authMiddleware, cancelBooking);

module.exports = router;
