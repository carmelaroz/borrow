const express = require('express');
const { uploadNewRental, getRentals, getUserRentals, editRental, deleteRental } = require('../controllers/rentalController.js');
const requireAuth = require('../middleware/authMiddleware.js');

const router = express.Router();

// Protected route
router.post('/', requireAuth, uploadNewRental);
router.get('/', getRentals);
router.get('/user', requireAuth, getUserRentals);
router.put('/:id', requireAuth, editRental);
router.delete('/:id', requireAuth, deleteRental);

module.exports = router;