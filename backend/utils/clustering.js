const Incident = require("../models/Incident");

// distance in meters
const MAX_DISTANCE = 200;
const TIME_WINDOW = 30 * 60 * 1000;

exports.findCluster = async (latitude, longitude) => {
  const now = new Date();
  const timeLimit = new Date(now.getTime() - TIME_WINDOW);

  console.log("🔍 Searching cluster for:", latitude, longitude);

  const nearbyIncidents = await Incident.find({
    timestamp: { $gte: timeLimit },
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [longitude, latitude]
        },
        $maxDistance: MAX_DISTANCE
      }
    }
  });

  console.log("📍 Nearby incidents found:", nearbyIncidents.length);

  if (nearbyIncidents.length > 0) {
    console.log("✅ Cluster found:", nearbyIncidents[0]._id);
    return nearbyIncidents[0];
  }

  console.log("❌ No cluster found");
  return null;
};