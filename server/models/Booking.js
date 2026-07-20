const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        guest: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        room: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
            required: true,
        },
        checkInDate: {
            type: Date,
            required: true,
        },
        checkOutDate: {
            type: Date,
            required: true,
        },
        numberOfGuests: {
            type: Number,
            required: true,
            min: 1,
        },
        services: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Service",
            },
        ],
        promoCode: {
            type: String,
            trim: true,
            default: null,
        },
        discountApplied: {
            type: Number, // percentage or flat amount
            default: 0,
        },
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        status: {
            type: String,
            enum: ["pending", "confirmed", "checked-in", "checked-out", "cancelled"],
            default: "pending",
        },
    },
    { timestamps: true }
);

// Validation: checkOutDate must be after checkInDate
bookingSchema.pre("validate", function () {
    if (this.checkOutDate <= this.checkInDate) {
        throw new Error("Check-out date must be after check-in date");
    }
});

module.exports = mongoose.model("Booking", bookingSchema);