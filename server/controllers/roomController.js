const Room = require("../models/Room");

// @desc   Create a new room (Manager/Admin only)
// @route  POST /api/rooms
const createRoom = async (req, res) => {
    try {
        const { roomNumber, category, pricePerNight, capacity, features, rating } = req.body;

        if (!roomNumber || !category || !pricePerNight || !capacity) {
            return res.status(400).json({ message: "Please fill all required fields" });
        }

        const roomExists = await Room.findOne({ roomNumber });
        if (roomExists) {
            return res.status(400).json({ message: "Room with this number already exists" });
        }

        const room = await Room.create({
            roomNumber,
            category,
            pricePerNight,
            capacity,
            features,
            rating: rating || 0,
        });

        res.status(201).json(room);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Get all rooms (with optional search/filter)
// @route  GET /api/rooms
const getRooms = async (req, res) => {
    try {
        const { minPrice, maxPrice, capacity, category } = req.query;

        let filter = { isActive: true };

        if (minPrice || maxPrice) {
            filter.pricePerNight = {};
            if (minPrice) filter.pricePerNight.$gte = Number(minPrice);
            if (maxPrice) filter.pricePerNight.$lte = Number(maxPrice);
        }

        if (capacity) {
            filter.capacity = { $gte: Number(capacity) };
        }

        if (category) {
            filter.category = category;
        }

        const rooms = await Room.find(filter);
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Get single room by ID
// @route  GET /api/rooms/:id
const getRoomById = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        res.status(200).json(room);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Update a room (Manager/Admin only)
// @route  PUT /api/rooms/:id
const updateRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json(updatedRoom);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Delete a room (Manager/Admin only)
// @route  DELETE /api/rooms/:id
const deleteRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        await room.deleteOne();
        res.status(200).json({ message: "Room deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Upload room images (Manager/Admin only)
// @route  POST /api/rooms/:id/images
const uploadRoomImages = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "Please upload at least one image" });
        }

        const imagePaths = req.files.map((file) => `/uploads/rooms/${file.filename}`);
        room.images.push(...imagePaths);
        await room.save();

        res.status(200).json(room);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createRoom, getRooms, getRoomById, updateRoom, deleteRoom, uploadRoomImages };