const Booking = require("../models/Booking");
const Room = require("../models/Room");

// Helper: check if room is available for given dates (excluding a specific booking, useful for updates)
const isRoomAvailable = async (roomId, checkInDate, checkOutDate, excludeBookingId = null) => {
    const query = {
        room: roomId,
        status: { $in: ["pending", "confirmed", "checked-in"] }, // ignore cancelled/checked-out
        checkInDate: { $lt: checkOutDate },
        checkOutDate: { $gt: checkInDate },
    };

    if (excludeBookingId) {
        query._id = { $ne: excludeBookingId };
    }

    const overlappingBooking = await Booking.findOne(query);
    return !overlappingBooking; // true = available, false = taken
};

// @desc   Create a new booking (Guest only)
// @route  POST /api/bookings
const createBooking = async (req, res) => {
    try {
        const { room, checkInDate, checkOutDate, numberOfGuests, promoCode } = req.body;

        if (!room || !checkInDate || !checkOutDate || !numberOfGuests) {
            return res.status(400).json({ message: "Please fill all required fields" });
        }

        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);

        if (checkOut <= checkIn) {
            return res.status(400).json({ message: "Check-out date must be after check-in date" });
        }

        if (checkIn < new Date().setHours(0, 0, 0, 0)) {
            return res.status(400).json({ message: "Check-in date cannot be in the past" });
        }

        const roomDoc = await Room.findById(room);
        if (!roomDoc || !roomDoc.isActive) {
            return res.status(404).json({ message: "Room not found or unavailable" });
        }

        if (numberOfGuests > roomDoc.capacity) {
            return res.status(400).json({
                message: `Room capacity is ${roomDoc.capacity}, but ${numberOfGuests} guests requested`,
            });
        }

        const available = await isRoomAvailable(room, checkIn, checkOut);
        if (!available) {
            return res.status(409).json({ message: "Room is not available for the selected dates" });
        }

        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        let totalAmount = nights * roomDoc.pricePerNight;

        let discountApplied = 0;
        if (promoCode === "WELCOME10") {
            discountApplied = totalAmount * 0.1;
            totalAmount -= discountApplied;
        }

        const booking = await Booking.create({
            guest: req.user._id,
            room,
            checkInDate: checkIn,
            checkOutDate: checkOut,
            numberOfGuests,
            promoCode: promoCode || null,
            discountApplied,
            totalAmount,
            status: "pending",
        });

        res.status(201).json(booking);
    } catch (error) {
        console.error("CREATE BOOKING ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc   Get logged-in guest's own bookings
// @route  GET /api/bookings/my
const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ guest: req.user._id })
            .populate("room")
            .sort({ checkInDate: -1 });

        res.status(200).json(bookings);
    } catch (error) {
        console.error("GET MY BOOKINGS ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc   Get all bookings for manager/admin
// @route  GET /api/bookings
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("guest", "name email")
            .populate("room")
            .sort({ createdAt: -1 });

        res.status(200).json(bookings);
    } catch (error) {
        console.error("GET ALL BOOKINGS ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc   Get a booking by id
// @route  GET /api/bookings/:id
const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate("guest", "name email")
            .populate("room");

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (req.user.role === "guest" && booking.guest._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to view this booking" });
        }

        res.status(200).json(booking);
    } catch (error) {
        console.error("GET BOOKING BY ID ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc   Update booking status for manager/admin
// @route  PUT /api/bookings/:id/status
const updateBookingStatus = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const { status } = req.body;
        const validStatuses = ["pending", "confirmed", "checked-in", "checked-out", "cancelled"];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid booking status" });
        }

        booking.status = status;
        await booking.save();

        res.status(200).json(booking);
    } catch (error) {
        console.error("UPDATE BOOKING STATUS ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc   Cancel a booking (Guest only)
// @route  PUT /api/bookings/:id/cancel
const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (booking.guest.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to cancel this booking" });
        }

        if (booking.status === "cancelled") {
            return res.status(400).json({ message: "Booking is already cancelled" });
        }

        booking.status = "cancelled";
        await booking.save();

        res.status(200).json(booking);
    } catch (error) {
        console.error("CANCEL BOOKING ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createBooking,
    getMyBookings,
    getAllBookings,
    getBookingById,
    updateBookingStatus,
    cancelBooking,
};
