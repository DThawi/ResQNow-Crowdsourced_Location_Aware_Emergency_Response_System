const Incident = require("../models/Incident");

// 1. Total Incidents
exports.getTotalIncidents = async (req, res) => {
  try {
    const total = await Incident.countDocuments();
    res.json({ totalIncidents: total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. Incident Category Count
exports.getIncidentCategoryCount = async (req, res) => {
  try {
    const categories = await Incident.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 3. Resolved vs Pending
exports.getStatusDistribution = async (req, res) => {
  try {
    const statusData = await Incident.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(statusData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 4. Average Response Time
exports.getAverageResponseTime = async (req, res) => {
  try {
    const incidents = await Incident.find({
      status: "Resolved",
      status_history: { $exists: true, $ne: [] }
    });

    let totalTime = 0;
    let count = 0;

    incidents.forEach(incident => {
      const history = incident.status_history;

      const assigned = history.find(h => h.status === "Assigned");
      const resolved = history.find(h => h.status === "Resolved");

      if (assigned && resolved) {
        const timeDiff = new Date(resolved.timestamp) - new Date(assigned.timestamp);
        totalTime += timeDiff;
        count++;
      }
    });

    const avgTime = count > 0 ? totalTime / count : 0;

    res.json({
      averageResponseTime_ms: avgTime,
      averageResponseTime_minutes: avgTime / (1000 * 60)
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 5. Monthly Incident Trend (for charts)
exports.getMonthlyIncidents = async (req, res) => {
  try {
    const data = await Incident.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$timestamp" },
            month: { $month: "$timestamp" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Top Incident Locations (Heatmap)
exports.getTopLocations = async (req, res) => {
  try {
    const data = await Incident.aggregate([
      {
        $group: {
          _id: "$location.coordinates",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};