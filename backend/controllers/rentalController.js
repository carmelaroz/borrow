const Rental = require('../models/Rental.js');

const uploadNewRental = async (req, res) => {
const { title, description, category, pricePerDay, images, phone, status } = req.body;

// Check if the user is attached to the request (e.g. from auth middleware)
if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized. User data missing.' });
}

try {
    const newRental = await Rental.create({
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    email: req.user.email,
    title,
    description,
    category,
    pricePerDay,
    images,
    phone,
    status,
    });

    res.status(201).json(newRental);
} catch (error) {
    res.status(400).json({ error: error.message });
}
};

// Get all rentals
const getRentals = async (req, res) => {
    try {
    const rentals = await Rental.find().sort({ createdAt: -1 });
    res.status(200).json(rentals);
    } catch (err) {
    res.status(500).json({ error: 'Failed to fetch rentals' });
    }
};

// Get rentals for a specific user
const getUserRentals = async (req, res) => {
    const { email } = req.user; // set by auth middleware
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit); // optionally support a custom limit

    try {
    let query = Rental.find({ email }).sort({ createdAt: -1 });

    // Only apply pagination if `page` and `limit` are provided
    if (!isNaN(page) && !isNaN(limit)) {
        query = query.skip((page - 1) * limit).limit(limit);
    }

    const rentals = await query;
    res.status(200).json(rentals);
    } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user rentals' });
    }
};

// Edit a rental
const editRental = async (req, res) => {
    const { id } = req.params;
    const { title, description, category, pricePerDay, images, phone } = req.body;

    try {
    const updated = await Rental.findByIdAndUpdate(
        id,
        { title, description, category, pricePerDay, images, phone },
        { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Rental not found' });

    res.status(200).json(updated);
    } catch (err) {
    res.status(500).json({ error: 'Failed to update rental' });
    }
};

// Delete a rental
const deleteRental = async (req, res) => {
    const { id } = req.params;

    try {
    const deleted = await Rental.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Rental not found' });

    res.status(200).json({ message: 'Rental deleted' });
    } catch (err) {
    res.status(500).json({ error: 'Failed to delete rental' });
    }
};

module.exports = { 
    uploadNewRental,
    getRentals,
    getUserRentals,
    editRental,
    deleteRental,
};