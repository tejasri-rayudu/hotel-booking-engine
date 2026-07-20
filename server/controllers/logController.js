const Log = require("../models/Log");

// @desc   Create a log entry (used internally by other controllers, and manually if needed)
// @route  POST /api/logs
const createLog = async (req, res) => {
    try {
        const { action, details } = req.body;

        if (!action) {
            return res.status(400).json({ message: "Action is required" });
        }

        const log = await Log.create({
            user: req.user._id,
            action,
            details,
            ipAddress: req.ip,
        });

        res.status(201).json(log);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Get all logs (Admin only)
// @route  GET /api/logs
const getLogs = async (req, res) => {
    try {
        const logs = await Log.find()
            .populate("user", "name email role")
            .sort({ createdAt: -1 })
            .limit(200); // avoid dumping unlimited logs at once

        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createLog, getLogs };