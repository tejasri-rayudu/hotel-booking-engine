const express = require("express");
const router = express.Router();
const { createLog, getLogs } = require("../controllers/logController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

router.post("/", protect, createLog);
router.get("/", protect, authorizeRoles("admin"), getLogs);

module.exports = router;

