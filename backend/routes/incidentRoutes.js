const express = require('express');
const router = express.Router();
const incidentController = require('../controllers/incidentController');
const { verifyToken } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); 

router.get('/', incidentController.getAllIncidents);

router.post(
  '/',
  verifyToken,
  upload.single("image"),   // only accepts 'image'
  incidentController.createIncident
);

router.put('/:id/status', verifyToken, incidentController.updateIncidentStatus);

module.exports = router;