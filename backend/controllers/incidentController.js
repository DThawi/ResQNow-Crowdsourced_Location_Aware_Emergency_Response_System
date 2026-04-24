const mongoose = require("mongoose");
const { findCluster } = require("../utils/clustering");
const User = require('../models/User');
// Handles creating reports with GPS data and manages the lifecycle status.

const Incident = require('../models/Incident');

// Create new incident report
exports.createIncident = async (req, res) => {
  try {
    let { type, description, longitude, latitude } = req.body;

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res.status(400).json({ message: "Invalid GPS coordinates" });
    }

    // 🔍 Find cluster
    
const existingCluster = await findCluster(lat, lng);

let clusterId;

if (existingCluster) {
  // If existing incident already has cluster_id, reuse it
  clusterId = existingCluster.cluster_id || existingCluster._id;
} else {
  // 🔥 No cluster found → this becomes new cluster
  clusterId = new mongoose.Types.ObjectId();
}
    

    const newIncident = new Incident({
  user_id: req.user.id,
  type,
  description,
 
  location: {
    type: 'Point',
    coordinates: [parseFloat(longitude), parseFloat(latitude)]
  },
  image: req.file ? req.file.cloudinaryUrl : null,
  cluster_id: clusterId
});

    const savedIncident = await newIncident.save();

    console.log("🆕 Saved Incident:", savedIncident._id, "Cluster:", clusterId);

    res.status(201).json(savedIncident);

  } catch (err) {
    console.error("❌ ERROR:", err);
    res.status(500).json({
      message: "Error creating incident",
      error: err.message
    });
  }
};

// Get all incidents (used for live map display)
exports.getAllIncidents = async (req, res) => {
  try {
    const incidents = await Incident.find().sort({ timestamp: -1 });

    res.status(200).json(incidents);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching incidents",
      error: err.message
    });
  }
};


// Update incident status (admin / responders)
exports.updateIncidentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['Pending', 'Verified', 'Assigned', 'Resolved'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // GET INCIDENT FIRST
    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({ message: "Incident not found" });
    }

    // DEFAULT: just update status
    let newStatus = status;

    // IF VERIFIED → FIND AUTHORITY
    if (status === "Verified") {
      // Find all authorities (organizations + responders) in that district
      const authorities = await User.find({
        role: "Authority",
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: incident.location.coordinates
            },
            $maxDistance: 10000 // 10km radius (adjust if needed)
          }
        }
      }).limit(3);

      console.log("FOUND AUTHORITIES:", authorities);

      if (authorities.length > 0) {
        incident.assignedAuthorities = authorities.map(a => a._id);
        newStatus = "Assigned";
      }
      console.log("INCIDENT LOCATION:", incident.location.coordinates);
      console.log("AUTHORITIES FOUND:", authorities.length);
    }

    // UPDATE INCIDENT
    incident.status = newStatus;

    incident.status_history.push({
      status: newStatus,
      changed_by: req.user ? req.user.id : null
    });

    await incident.save();

    res.status(200).json({
      message: "Status updated",
      incident
    });

  } catch (err) {
    res.status(500).json({
      message: "Error updating status",
      error: err.message
    });
  }
};