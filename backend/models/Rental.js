// /backend/models/Rental.js
const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  category: { type: String, required: true, enum: ['tools', 'electronics', 'apartments', 'all'] },
  description: { type: String },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Rental', rentalSchema);


