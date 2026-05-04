const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController'); // Import the controller
const { verifyToken } = require('../middleware/authMiddleware');

// Existing routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// NEW ROUTE: This fixes the 404
router.get('/profile-stats', verifyToken, userController.getProfileStats);
router.get('/profile', verifyToken, userController.getProfile);
router.put('/profile-update', verifyToken, userController.updateProfile);

module.exports = router;
