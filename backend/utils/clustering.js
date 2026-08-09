const Incident = require("../models/Incident");

// 📍 CLS-004: Location Radius Threshold (200 meters)
const MAX_DISTANCE = 200; 

// ⏰ CLS-003: Time Window Threshold (30 Minutes)
const TIME_WINDOW = 30 * 60 * 1000; 

// ── CLS-001 to CLS-007: SEARCH & CLUSTER LOGIC ─────────────────────────────
exports.findCluster = async (latitude, longitude) => {
  const now = new Date();
  const timeLimit = new Date(now.getTime() - TIME_WINDOW);

  console.log("🔍 Searching cluster for:", latitude, longitude);

  // CLS-003 & CLS-004: Geospatial query within 200m radius and 30-min window
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

  // CLS-001 & CLS-005: Existing cluster found
  if (nearbyIncidents.length > 0) {
    // 🔑 Look for any nearby incident that already has a non-null cluster_id
    const existingClusteredIncident = nearbyIncidents.find(
      (inc) => inc.cluster_id !== null && inc.cluster_id !== undefined
    );

    // Prioritize existing cluster_id; fall back to the first nearby incident's _id
    const targetClusterId = existingClusteredIncident 
      ? existingClusteredIncident.cluster_id 
      : (nearbyIncidents[0].cluster_id || nearbyIncidents[0]._id);

    console.log("✅ Cluster found (CLS-005):", targetClusterId);
    return {
      clusterId: targetClusterId,
      isNewCluster: false,
      incident: nearbyIncidents[0]
    };
  }

  // CLS-002 & CLS-006: No cluster found within bounds
  console.log("❌ No cluster found. Creating new cluster (CLS-006)");
  return {
    clusterId: null,
    isNewCluster: true
  };
};

// ── CLS-008: CLUSTER STATISTICS AGGREGATION ─────────────────────────────────
exports.getClusterStatistics = async () => {
  const stats = await Incident.aggregate([
    {
      $group: {
        _id: { $ifNull: ["$cluster_id", "$_id"] },
        type: { $first: "$type" },
        totalReports: { $sum: 1 },
        firstReported: { $min: "$timestamp" },
        lastReported: { $max: "$timestamp" },
        statuses: { $addToSet: "$status" }
      }
    }
  ]);
  return stats;
};
