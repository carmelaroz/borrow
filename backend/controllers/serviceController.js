const Service = require('../models/Service.js');

console.log('Loading serviceController.js');

const uploadNewService = async (req, res) => {
    const { title, description, category, pricePerHour, phone } = req.body;

    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized. User data missing.' });
    }

    try {
        const newService = await Service.create({
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            title,
            description,
            category,
            pricePerHour,
            phone,
        });

        res.status(201).json(newService);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getServices = async (req, res) => {
    try {
        const services = await Service.find().sort({ createdAt: -1 });
        res.status(200).json(services);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch services' });
    }
};

const getUserServices = async (req, res) => {
    const { email } = req.user;
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    try {
        let query = Service.find({ email }).sort({ createdAt: -1 });

        if (!isNaN(page) && !isNaN(limit)) {
            query = query.skip((page - 1) * limit).limit(limit);
        }

        const services = await query;
        res.status(200).json(services);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user services' });
    }
};

const editService = async (req, res) => {
    const { id } = req.params;
    const { title, description, category, pricePerHour, phone } = req.body;

    try {
        const updated = await Service.findByIdAndUpdate(
            id,
            { title, description, category, pricePerHour, phone },
            { new: true }
        );

        if (!updated) return res.status(404).json({ error: 'Service not found' });

        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update service' });
    }
};

const deleteService = async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await Service.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ error: 'Service not found' });

        res.status(200).json({ message: 'Service deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete service' });
    }
};

module.exports = { 
    uploadNewService,
    getServices,
    getUserServices,
    editService,
    deleteService,
};