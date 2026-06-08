const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController'); // Import the controller
const { verifyToken } = require('../middleware/authMiddleware');
const { upload, uploadDocumentsToCloudinary } = require("../middleware/upload");

// Existing routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// NEW ROUTE: This fixes the 404
router.get('/profile-stats', verifyToken, userController.getProfileStats);
router.get('/profile', verifyToken, userController.getProfile);
router.put('/profile-update', verifyToken, userController.updateProfile);


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
