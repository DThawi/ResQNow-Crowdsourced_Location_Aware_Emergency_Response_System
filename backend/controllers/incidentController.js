const mongoose = require("mongoose");
const { findCluster } = require("../utils/clustering");
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

    let clusterId = null;

    if (existingCluster) {
      clusterId = existingCluster.cluster_id || existingCluster._id;
    }

    const newIncident = new Incident({
      user_id: req.user.id,
      type,
      description,
      location: {
        type: 'Point',
        coordinates: [lng, lat]
      },
      image: req.file ? req.file.path : null,
      cluster_id: new mongoose.Types.ObjectId()
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

    const updatedIncident = await Incident.findByIdAndUpdate(
      req.params.id,
      { 
        $set: { status },
        $push: { 
          status_history: { 
            status, 
            changed_by: req.user ? req.user.id : null 
          } 
        } 
      },
      { new: true, runValidators: true }
    );

    if (!updatedIncident) {
      return res.status(404).json({
        message: "Incident not found"
      });
    }

    res.status(200).json({
    message: "Status updated successfully",
    incident: updatedIncident
  });

  } catch (err) {
    res.status(500).json({
      message: "Error updating status",
      error: err.message
    });
  }
};