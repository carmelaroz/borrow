const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Cleaning', 'Moving', 'Gardening', 'Repair', 'Teaching', 'Other']
    },
    pricePerHour: {
        type: Number,
        required: true,
        min: 0
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['available', 'unavailable'],
        default: 'available'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { collection: 'services' });

module.exports = mongoose.model('Service', serviceSchema);