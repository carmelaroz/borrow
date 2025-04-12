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

module.exports = { uploadNewRental };