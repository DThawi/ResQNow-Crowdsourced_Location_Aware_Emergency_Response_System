const express = require('express');
const router = express.Router();
const incidentController = require('../controllers/incidentController');
const { verifyToken } = require('../middleware/authMiddleware');
const allowRoles = require("../middleware/roleMiddleware"); // <-- ADD THIS
const upload = require('../middleware/uploadMiddleware'); 
const Incident = require('../models/Incident');

router.get('/', incidentController.getAllIncidents);

router.post(
  '/',
  verifyToken,
  upload.single("image"),   // only accepts 'image'
  incidentController.createIncident
);

router.put('/:id/status', verifyToken, allowRoles("Admin"), incidentController.updateIncidentStatus);

router.get('/clusters', async (req, res) => {
  try {
    const clusters = await Incident.aggregate([
      {
        $group: {
          _id: "$cluster_id",
          incidents: { $push: "$$ROOT" },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(clusters);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;