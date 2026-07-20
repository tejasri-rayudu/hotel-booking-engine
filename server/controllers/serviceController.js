const Service = require("../models/Service");

// @desc   Create a new service (Manager/Admin only)
// @route  POST /api/services
const createService = async (req, res) => {
    try {
        const { name, type, description, price } = req.body;

        if (!name || !price) {
            return res.status(400).json({ message: "Please provide name and price" });
        }

        const service = await Service.create({ name, type, description, price });
        res.status(201).json(service);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Get all available services (Public/Guest)
// @route  GET /api/services
const getServices = async (req, res) => {
    try {
        const { type } = req.query;
        let filter = { isAvailable: true };
        if (type) filter.type = type;

        const services = await Service.find(filter);
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Get single service by ID
// @route  GET /api/services/:id
const getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }
        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Update a service (Manager/Admin only)
// @route  PUT /api/services/:id
const updateService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        const updatedService = await Service.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json(updatedService);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Delete a service (Manager/Admin only)
// @route  DELETE /api/services/:id
const deleteService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        await service.deleteOne();
        res.status(200).json({ message: "Service deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createService, getServices, getServiceById, updateService, deleteService };