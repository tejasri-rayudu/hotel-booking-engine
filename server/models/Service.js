const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            enum: ["dining", "spa", "transport", "laundry", "other"],
            default: "dining",
        },
        description: {
            type: String,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);