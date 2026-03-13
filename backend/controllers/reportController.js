const Report = require("../models/Report");

// Create a new incident report
exports.createReport = async (req, res) => {
  try {
    const { type, description, latitude, longitude } = req.body;

    const newReport = new Report({
      type,
      description,
      location: {
        latitude,
        longitude
      }
    });

    await newReport.save();

    res.status(201).json({
      message: "Report submitted successfully",
      report: newReport
    });

  } catch (error) {
    res.status(500).json({
      message: "Error creating report",
      error: error.message
    });
  }
};


// Get all reports
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find();

    res.status(200).json(reports);

  } catch (error) {
    res.status(500).json({
      message: "Error fetching reports",
      error: error.message
    });
  }
};

exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json(report);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.json({ message: "Report deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};