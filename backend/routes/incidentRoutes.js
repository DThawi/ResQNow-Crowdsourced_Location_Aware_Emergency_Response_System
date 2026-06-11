const express = require('express');
const router = express.Router();
const incidentController = require('../controllers/incidentController');
const { verifyToken } = require('../middleware/authMiddleware');
const allowRoles = require("../middleware/roleMiddleware");
const { upload, uploadToCloudinary } = require("../middleware/upload");

// --- 1. SPECIFIC ROUTES FIRST (The Fix for 404) ---
router.get('/my-reports', verifyToken, incidentController.getMyReports);
router.get('/assigned', verifyToken, allowRoles("Admin", "Authority", "Responder"), incidentController.getAssignedIncidents);


router.get('/clusters', incidentController.getNearbyClusters);
router.get('/all', incidentController.getAllIncidents);

// --- 2. GENERAL ROUTES ---
router.get('/', incidentController.getAllIncidents);
router.post('/', verifyToken, upload.single("image"), uploadToCloudinary, incidentController.createIncident);

// --- 3. PARAMETERIZED ROUTES LAST ---
router.post('/:id/feedback', verifyToken, incidentController.addIncidentFeedback);
router.put('/:id/status', verifyToken, allowRoles("Admin", "Authority", "Responder"), incidentController.updateResponseStatus);
router.get('/:id/progress', verifyToken, incidentController.getResponseProgress);
router.put('/:id/assign', verifyToken, allowRoles("Admin"), incidentController.assignResponder);
router.patch('/:id/admin-verify', verifyToken, allowRoles("Admin"), incidentController.adminVerifyIncident);
router.delete('/:id/admin-reject', verifyToken, allowRoles("Admin"), incidentController.adminRejectIncident);

module.exports = router;