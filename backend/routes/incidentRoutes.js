const express = require('express');
const router = express.Router();
const incidentController = require('../controllers/incidentController');
const { verifyToken } = require('../middleware/authMiddleware');
const allowRoles = require("../middleware/roleMiddleware"); // <-- ADD THIS
const { upload, uploadToCloudinary } = require("../middleware/upload"); 

router.get('/', incidentController.getAllIncidents);

router.post(
  "/",
  upload.single("image"),
  uploadToCloudinary,
  async (req, res) => {
    // your logic here
  }
);

router.put('/:id/status', verifyToken, allowRoles("Admin"), incidentController.updateIncidentStatus);

module.exports = router;