const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        action: {
            type: String,
            required: true, // e.g. "LOGIN", "BOOKING_CREATED", "ROOM_UPDATED"
        },
        details: {
            type: String,
            trim: true,
        },
        ipAddress: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Log", logSchema);