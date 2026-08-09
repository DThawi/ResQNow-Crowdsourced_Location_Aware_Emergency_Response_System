const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator'); // Import express-validator
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');
const { uploadDocumentsToCloudinary } = require("../middleware/upload");
const { upload } = require('../middleware/uploadMiddleware');

// ── Validation Middleware Callback ──────────────────────────────────────────
const validateRegistration = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }
    next();
  }
];

// ── Multi-part Registration Handler ─────────────────────────────────────────
router.post(
  '/register', 
  upload.fields([
    { name: 'officialId', maxCount: 1 },
    { name: 'authLetter', maxCount: 1 },
    { name: 'certCards', maxCount: 1 }
  ]), 
  uploadDocumentsToCloudinary,
  validateRegistration, // Placed after body parsing, before controller execution
  authController.register
);

// ── Authentication Management Endpoints ─────────────────────────────────────
router.post('/login', authController.login);

// 🔒 Logout Endpoint (Added to satisfy ADM-002 audit logs)
router.post('/logout', (req, res) => {
  console.log('🔒 User logged out successfully');
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

router.post('/setup-approved-password', authController.setupApprovedPassword);

// ── Citizen & Standard OTP Recovery ─────────────────────────────────────────
router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-otp', authController.verifyOTP);
router.post('/reset-password', authController.resetPassword);

// ── Secure Admin Recovery Endpoint ──────────────────────────────────────────
router.post('/admin-forgot-password', authController.adminForgotPassword);

// ── Administrative Approvals ────────────────────────────────────────────────
router.put(
  "/approve-responder/:userId",
  authController.approveResponder
);

// ── Profile Management Metrics ──────────────────────────────────────────────
router.get('/profile-stats', verifyToken, userController.getProfileStats);
router.get('/profile', verifyToken, userController.getProfile);
router.put('/profile-update', verifyToken, userController.updateProfile);
router.get('/notification-settings', verifyToken, userController.getNotificationSettings);
router.put('/notification-settings', verifyToken, userController.updateNotificationSettings);
router.get('/download-data', verifyToken, userController.downloadUserData);
router.delete('/account', verifyToken, userController.deleteAccount);

// ── Responder Document Registration ─────────────────────────────────────────
router.post(
  "/register-documents",
  verifyToken,
  upload.fields([
    { name: "officialId", maxCount: 1 },
    { name: "authLetter", maxCount: 1 },
    { name: "certCards", maxCount: 1 },
  ]),
  uploadDocumentsToCloudinary,
  async (req, res) => {
    try {
      const { officialId, authLetter, certCards } = req.documentUrls || {};
      
      const user = await require("../models/User").findByIdAndUpdate(
        req.user.id,
        {
          documents: {
            officialId: officialId || null,
            authLetter: authLetter || null,
            certCards: certCards || null,
          },
          documentStatus: "pending"
        },
        { new: true }
      );

      res.status(200).json({ 
        message: "Documents uploaded successfully",
        documents: user.documents
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;