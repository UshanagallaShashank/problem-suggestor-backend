const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');

// Admin Routes with Auth Middleware
router.post('/users', adminController.createUser);
// Get all users (requires admin authentication)
router.get('/users', adminController.getAllUsers);

// Get a user by ID (requires admin authentication)
router.get('/users/:id', adminController.getUserById);

// Update a user by ID (requires admin authentication)
router.put('/users/:id', adminController.updateUser);

// Delete a user by ID (requires admin authentication)
router.delete('/users/:id', adminController.deleteUser);

module.exports = router;
