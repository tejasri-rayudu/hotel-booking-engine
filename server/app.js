const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files (room images, invoice PDFs) statically
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/rooms", require("./routes/roomRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/services", require("./routes/serviceRoutes"));
app.use("/api/invoices", require("./routes/invoiceRoutes"));
app.use("/api/logs", require("./routes/logRoutes"));

// Test Route
app.get("/", (req, res) => {
    res.send("Welcome to Hotel Booking Engine API 🚀");
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
    });
});

module.exports = app;