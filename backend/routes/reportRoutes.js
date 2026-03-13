const express = require("express");
const router = express.Router();

const { 
  createReport, 
  getReports, 
  getReportById, 
  deleteReport 
} = require("../controllers/reportController");

// Create report
router.post("/", createReport);

// Get all reports
router.get("/", getReports);

// Get report by ID
router.get("/:id", getReportById);

// Delete report
router.delete("/:id", deleteReport);

module.exports = router;