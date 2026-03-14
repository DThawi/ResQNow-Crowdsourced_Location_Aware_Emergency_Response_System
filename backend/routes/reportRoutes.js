const express = require("express");
const router = express.Router();

const {
  createReport,
  getReports,
  getReportById,
  deleteReport
} = require("../controllers/reportController");

const upload = require("../middleware/uploadMiddleware");

// Create report with image
router.post("/", upload.single("image"), createReport);

// Get all reports
router.get("/", getReports);

// Get report by ID
router.get("/:id", getReportById);

// Delete report
router.delete("/:id", deleteReport);

module.exports = router;