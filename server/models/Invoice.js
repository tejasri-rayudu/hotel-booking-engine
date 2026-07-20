const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
    {
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            required: true,
        },
        guest: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        roomCharges: {
            type: Number,
            required: true,
            min: 0,
        },
        serviceCharges: {
            type: Number,
            default: 0,
        },
        taxAmount: {
            type: Number,
            default: 0,
        },
        discount: {
            type: Number,
            default: 0,
        },
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "refunded"],
            default: "pending",
        },
        pdfPath: {
            type: String, // path to generated PDF-Kit file
            default: null,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Invoice", invoiceSchema);