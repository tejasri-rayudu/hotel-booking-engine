const express = require("express");
const router = express.Router();
const {
    createRoom,
    getRooms,
    getRoomById,
    updateRoom,
    deleteRoom,
    uploadRoomImages,
} = require("../controllers/roomController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Public routes (anyone can browse/search rooms)
router.get("/", getRooms);
router.get("/:id", getRoomById);

// Protected routes (Manager/Admin only)
router.post("/", protect, authorizeRoles("manager", "admin"), createRoom);
router.put("/:id", protect, authorizeRoles("manager", "admin"), updateRoom);
router.delete("/:id", protect, authorizeRoles("manager", "admin"), deleteRoom);

// Image upload (Manager/Admin only)
router.post(
    "/:id/images",
    protect,
    authorizeRoles("manager", "admin"),
    upload.array("images", 5),
    uploadRoomImages
);

module.exports = router;