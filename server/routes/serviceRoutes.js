const express = require("express");
const router = express.Router();
const {
    createService,
    getServices,
    getServiceById,
    updateService,
    deleteService,
} = require("../controllers/serviceController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// Public routes
router.get("/", getServices);
router.get("/:id", getServiceById);

// Manager/Admin only
router.post("/", protect, authorizeRoles("manager", "admin"), createService);
router.put("/:id", protect, authorizeRoles("manager", "admin"), updateService);
router.delete("/:id", protect, authorizeRoles("manager", "admin"), deleteService);

module.exports = router;