const Log = require("../models/Log");

const logAction = async (userId, action, details = "", ipAddress = "") => {
    try {
        await Log.create({ user: userId, action, details, ipAddress });
    } catch (error) {
        console.error("Failed to create log:", error.message);
    }
};

module.exports = logAction;