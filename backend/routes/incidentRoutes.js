const express = require('express');
const router = express.Router();
const incidentController = require('../controllers/incidentController');
const { verifyToken } = require('../middleware/authMiddleware');
const allowRoles = require("../middleware/roleMiddleware");
const { upload, uploadToCloudinary } = require("../middleware/upload");

// --- 1. SPECIFIC ROUTES FIRST (The Fix for 404) ---
router.get('/my-reports', verifyToken, incidentController.getMyReports);

router.get('/clusters', async (req, res) => {
    try {
        const clusters = await Incident.aggregate([
            { $group: { _id: "$cluster_id", incidents: { $push: "$$ROOT" }, count: { $sum: 1 } } }
        ]);
        res.json(clusters);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- 2. GENERAL ROUTES ---
router.get('/', incidentController.getAllIncidents);
router.post('/', verifyToken, upload.single("image"), uploadToCloudinary, incidentController.createIncident);

// --- 3. PARAMETERIZED ROUTES LAST ---
router.post('/:id/feedback', verifyToken, incidentController.addIncidentFeedback);
router.put('/:id/status', verifyToken, allowRoles("Admin", "Authority"), incidentController.updateIncidentStatus);

module.exports = router;
