const Incident = require("../models/Incident");

const getHeatmapData = async (req, res) => {
  try {

    const incidents = await Incident.find({
      status: { $ne: "Resolved" },
      location: { $exists: true },
    });

    const heatmapPoints = incidents
      .filter(
        (incident) =>
          incident.location &&
          Array.isArray(incident.location.coordinates) &&
          incident.location.coordinates.length === 2
      )
      .map((incident) => {

        const longitude = Number(
          incident.location.coordinates[0]
        );

        const latitude = Number(
          incident.location.coordinates[1]
        );

        return {
          latitude,
          longitude,

          weight:
            incident.status === "Verified"
              ? 5
              : incident.status === "Assigned"
              ? 4
              : 2,

          type: incident.type,
          status: incident.status,
        };
      });

    res.status(200).json(heatmapPoints);

  } catch (error) {

    console.error("Heatmap Error:", error);

    res.status(500).json({
      message: "Failed to fetch heatmap data",
      error: error.message,
    });
  }
};

module.exports = {
  getHeatmapData,
};