const express = require('express');
const router = express.Router();
const { uploadNewService, getServices, getUserServices, editService, deleteService } = require('../controllers/serviceController');
const requireAuth = require('../middleware/authMiddleware'); // Changed from 'auth' to 'authMiddleware'

console.log('Loading serviceRoutes.js');

router.post('/', requireAuth, uploadNewService); // POST /api/services
router.get('/', getServices); // GET /api/services
router.get('/user', requireAuth, getUserServices); // GET /api/services/user
router.put('/:id', requireAuth, editService); // PUT /api/services/:id
router.delete('/:id', requireAuth, deleteService); // DELETE /api/services/:id

module.exports = router;