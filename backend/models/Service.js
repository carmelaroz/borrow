const mongoose = require('mongoose');

console.log('Loading Service.js');

const serviceSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    pricePerHour: { type: Number, required: true },
    phone: { type: String, required: true },
    city: { type: String },
    street: { type: String },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Service', serviceSchema);