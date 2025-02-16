// backend/routes/users.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.get('/daily', userController.getDailyQuestion);
module.exports = router;
