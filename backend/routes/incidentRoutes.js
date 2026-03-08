// act as a entry point for all requests related to emergencies 

const express = require('express');
const router = express.Router();
const incidentController = require('../controllers/incidentController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', incidentController.getAllIncidents);
router.post('/', authMiddleware, incidentController.createIncident);
router.put('/:id/status', authMiddleware, incidentController.updateIncidentStatus);

module.exports = router;
