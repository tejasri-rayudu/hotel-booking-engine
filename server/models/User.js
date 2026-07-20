const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        role: {
            type: String,
            enum: ["guest", "manager", "admin"],
            default: "guest",
        },
        phone: {
            type: String,
            trim: true,
        },
        diningPreferences: {
            type: [String], // e.g. ["vegetarian", "no-seafood"]
            default: [],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);