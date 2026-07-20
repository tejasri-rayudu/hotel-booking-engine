const express = require("express");
const router = express.Router();
const {
    generateInvoice,
    getInvoiceByBooking,
    getAllInvoices,
    updatePaymentStatus,
    downloadInvoicePDF,
} = require("../controllers/invoiceController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

router.post("/:bookingId", protect, generateInvoice);
router.get("/:bookingId", protect, getInvoiceByBooking);
router.get("/", protect, authorizeRoles("manager", "admin"), getAllInvoices);
router.put("/:id/payment", protect, authorizeRoles("manager", "admin"), updatePaymentStatus);
router.get("/:id/download", protect, downloadInvoicePDF);

module.exports = router;