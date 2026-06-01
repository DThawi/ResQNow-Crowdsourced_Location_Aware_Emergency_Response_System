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

exports.getResolvedToday = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const incidents = await Incident.find({
      status: "Resolved"
    });

    const count = incidents.filter((incident) => {
      const resolvedRecord = incident.status_history
        ?.filter(h => h.status === "Resolved")
        ?.sort((a, b) =>
          new Date(b.timestamp) - new Date(a.timestamp)
        )[0];

      if (!resolvedRecord) return false;

      const resolvedTime = new Date(
        resolvedRecord.timestamp
      );

      return resolvedTime >= start &&
             resolvedTime < end;
    }).length;

    res.json({ count });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.getResponseTime = async (req, res) => {
  try {

    const incidents = await Incident.find({
      assigned_at: { $ne: null }
    });

    if (!incidents.length) {
      return res.json({
        averageResponseTime_minutes: 0
      });
    }

    let total = 0;

    incidents.forEach((incident) => {

      const reported =
        new Date(incident.timestamp);

      const assigned =
        new Date(incident.assigned_at);

      total += assigned - reported;
    });

    const avgMs = total / incidents.length;

    res.json({
      averageResponseTime_ms: avgMs,
      averageResponseTime_minutes:
        Number((avgMs / 60000).toFixed(1))
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.getStatusAnalytics = async (req, res) => {

  const data = await Incident.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 }
      }
    }
  ]);

  res.json(data);
};