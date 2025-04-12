const express = require('express');
const { uploadNewRental } = require('../controllers/rentalController.js');
const requireAuth = require('../middleware/authMiddleware.js');

const router = express.Router();

// Protected route
router.post('/', requireAuth, uploadNewRental);

module.exports = router;