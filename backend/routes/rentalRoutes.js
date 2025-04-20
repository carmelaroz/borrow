const express = require('express');
const { uploadNewRental, getRentals, getUserRentals, editRental, deleteRental, searchRentals } = require('../controllers/rentalController.js');
const requireAuth = require('../middleware/authMiddleware.js');

const router = express.Router();

// Protected route
router.post('/', requireAuth, uploadNewRental);
router.get('/', getRentals);
router.get('/user', requireAuth, getUserRentals);
router.put('/:id', requireAuth, editRental);
router.delete('/:id', requireAuth, deleteRental);
router.get("/search", searchRentals);

module.exports = router;