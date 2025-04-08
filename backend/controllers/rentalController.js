const Rental = require('../models/Rental');

const getAllRentals = async (req, res) => {
    try {
        const rentals = await Rental.find();
        console.log('Fetched rentals:', rentals);
        res.json(rentals);
    } catch (err) {
        console.error('Error fetching rentals:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { getAllRentals };