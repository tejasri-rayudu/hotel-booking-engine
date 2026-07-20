const express = require("express");
const router = express.Router();
const {
    createBooking,
    getMyBookings,
    getAllBookings,
    getBookingById,
    updateBookingStatus,
    cancelBooking,
} = require("../controllers/bookingController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// Guest routes
router.post("/", protect, authorizeRoles("guest"), createBooking);
router.get("/my", protect, authorizeRoles("guest"), getMyBookings);
router.put("/:id/cancel", protect, authorizeRoles("guest"), cancelBooking);

// Manager/Admin routes
router.get("/", protect, authorizeRoles("manager", "admin"), getAllBookings);
router.put("/:id/status", protect, authorizeRoles("manager", "admin"), updateBookingStatus);

// Shared (guest sees own, manager/admin sees any — logic handled inside controller)
router.get("/:id", protect, getBookingById);

module.exports = router;