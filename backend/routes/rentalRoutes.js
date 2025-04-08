const express = require('express');
const router = express.Router();
const { getAllRentals } = require('../controllers/rentalController');

router.get('/', getAllRentals);

module.exports = router;