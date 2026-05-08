const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analyticsController");

const { verifyToken } = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

// Admin only analytics
router.get("/total", verifyToken, allowRoles("Admin"), analyticsController.getTotalIncidents);

router.get("/categories", verifyToken, allowRoles("Admin"), analyticsController.getIncidentCategoryCount);

router.get("/status", verifyToken, allowRoles("Admin"), analyticsController.getStatusDistribution);

router.get("/response-time", verifyToken, allowRoles("Admin"), analyticsController.getAverageResponseTime);

router.get("/monthly", verifyToken, allowRoles("Admin"), analyticsController.getMonthlyIncidents);

router.get("/top-locations", verifyToken, allowRoles("Admin"), analyticsController.getTopLocations);

module.exports = router;