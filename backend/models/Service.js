const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: String,
  location: String,
  price: Number,
  lat: Number,
  lng: Number,
});

module.exports = mongoose.model('Service', serviceSchema);