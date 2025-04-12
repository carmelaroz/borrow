const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    images: [{ type: String }], // URLs or paths
    phone: { type: String, required: true },
    status: { type: String, default: 'available' }
}, { timestamps: true });

const Rental = mongoose.model('Rental', rentalSchema);
module.exports = Rental;