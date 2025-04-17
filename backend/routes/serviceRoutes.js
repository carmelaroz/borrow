const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const {
    createService,
    getUserServices,
    updateService,
    deleteService
} = require('../controllers/serviceController');

// Create a new service
router.post('/', requireAuth, createService);

// Get all services for a specific user
router.get('/user', requireAuth, getUserServices);

// Update a service
router.put('/:id', requireAuth, updateService);

// Delete a service
router.delete('/:id', requireAuth, deleteService);

module.exports = router; 