const Invoice = require("../models/Invoice");
const Booking = require("../models/Booking");
const Service = require("../models/Service");
const Room = require("../models/Room");
const generateInvoicePDF = require("../utils/generateInvoicePDF");
const path = require("path");

// @desc   Generate invoice for a booking (Guest who owns it, or Manager/Admin)
// @route  POST /api/invoices/:bookingId
const generateInvoice = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.bookingId)
            .populate("room")
            .populate("services");

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (
            req.user.role === "guest" &&
            booking.guest.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({ message: "Access denied" });
        }

        const existingInvoice = await Invoice.findOne({ booking: booking._id });
        if (existingInvoice) {
            return res.status(200).json(existingInvoice);
        }

        const roomCharges = booking.totalAmount + booking.discountApplied;
        const serviceCharges = booking.services.reduce((sum, s) => sum + s.price, 0);
        const taxRate = 0.12;
        const subtotal = roomCharges + serviceCharges - booking.discountApplied;
        const taxAmount = subtotal * taxRate;
        const totalAmount = subtotal + taxAmount;

        const invoice = await Invoice.create({
            booking: booking._id,
            guest: booking.guest,
            roomCharges,
            serviceCharges,
            taxAmount,
            discount: booking.discountApplied,
            totalAmount,
            paymentStatus: "pending",
        });

        // Generate PDF and save its path
        const pdfPath = await generateInvoicePDF(invoice, booking, booking.room, req.user);
        invoice.pdfPath = pdfPath;
        await invoice.save();

        res.status(201).json(invoice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Get invoice by booking ID
// @route  GET /api/invoices/:bookingId
const getInvoiceByBooking = async (req, res) => {
    try {
        const invoice = await Invoice.findOne({ booking: req.params.bookingId })
            .populate("booking")
            .populate("guest", "name email phone");

        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found for this booking" });
        }

        if (
            req.user.role === "guest" &&
            invoice.guest._id.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({ message: "Access denied" });
        }

        res.status(200).json(invoice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Get all invoices (Manager/Admin only)
// @route  GET /api/invoices
const getAllInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find()
            .populate("booking")
            .populate("guest", "name email phone")
            .sort({ createdAt: -1 });
        res.status(200).json(invoices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Update payment status (Manager/Admin only)
// @route  PUT /api/invoices/:id/payment
const updatePaymentStatus = async (req, res) => {
    try {
        const { paymentStatus } = req.body;
        const validStatuses = ["pending", "paid", "refunded"];

        if (!validStatuses.includes(paymentStatus)) {
            return res.status(400).json({ message: "Invalid payment status" });
        }

        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }

        invoice.paymentStatus = paymentStatus;
        await invoice.save();

        res.status(200).json(invoice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Download invoice PDF
// @route  GET /api/invoices/:id/download
const downloadInvoicePDF = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice || !invoice.pdfPath) {
            return res.status(404).json({ message: "Invoice PDF not found" });
        }

        if (
            req.user.role === "guest" &&
            invoice.guest.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({ message: "Access denied" });
        }

        const filePath = path.join(__dirname, "..", invoice.pdfPath);
        res.download(filePath);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    generateInvoice,
    getInvoiceByBooking,
    getAllInvoices,
    updatePaymentStatus,
    downloadInvoicePDF,
};