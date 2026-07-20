const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
    {
        roomNumber: {
            type: String,
            required: true,
            unique: true,
        },
        category: {
            type: String,
            enum: ["standard", "deluxe", "suite", "presidential"],
            required: true,
        },
        pricePerNight: {
            type: Number,
            required: true,
            min: 0,
        },
        capacity: {
            type: Number,
            required: true,
            min: 1,
        },
        features: {
            type: [String],
            default: [],
        },
        images: {
            type: [String],
            default: [],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        rating: {
            type: Number,
            min: 0,
            max: 5,
            default: 0,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
