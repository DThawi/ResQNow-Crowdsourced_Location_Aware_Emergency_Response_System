const express = require('express');
const router = express.Router();
const incidentController = require('../controllers/incidentController');
const { verifyToken } = require('../middleware/authMiddleware');
const allowRoles = require("../middleware/roleMiddleware"); // <-- ADD THIS
<<<<<<< HEAD
const { upload, uploadToCloudinary } = require("../middleware/upload"); 
=======
const upload = require('../middleware/uploadMiddleware'); 
const Incident = require('../models/Incident');
>>>>>>> origin/main

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

// 69c6a4b69df69176e86a036d