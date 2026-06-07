const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');

const { upload } = require('../middleware/uploadMiddleware');

// ── Multi-part registration handler ─────────────────────────────────────────
router.post(
  '/register', 
  upload.fields([
    { name: 'officialId', maxCount: 1 },
    { name: 'authLetter', maxCount: 1 },
    { name: 'certCards', maxCount: 1 }
  ]), 
  authController.register
);

// ── Authentication Management Endpoints ─────────────────────────────────────
router.post('/login', authController.login);
router.post('/setup-approved-password', authController.setupApprovedPassword);

// Administrative Approvals 
router.put(
  "/approve-responder/:userId",
  authController.approveResponder
);

// ── Profile Management Metrics ──────────────────────────────────────────────
router.get('/profile-stats', verifyToken, userController.getProfileStats);
router.get('/profile', verifyToken, userController.getProfile);
router.put('/profile-update', verifyToken, userController.updateProfile);

module.exports = router;
