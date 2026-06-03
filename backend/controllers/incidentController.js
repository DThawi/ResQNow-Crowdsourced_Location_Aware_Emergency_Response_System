const mongoose = require("mongoose");
const { findCluster } = require("../utils/clustering");
const User = require('../models/User');
const Incident = require('../models/Incident');
const { notifyAssignment, notifyStatusChange } = require('../utils/notificationHelper');

// Fetch user-specific reports
exports.getMyReports = async (req, res) => {
    try {
        // req.user.id is populated by the verifyToken middleware 
        const reports = await Incident.find({ user_id: req.user.id }).sort({ timestamp: -1 });
        res.status(200).json({ reports });
    } catch (err) {
        res.status(500).json({ message: "Error fetching reports", error: err.message });
    }
};

// Create new incident report
exports.createIncident = async (req, res) => {
    try {
        console.log("BODY:", req.body);

        let { type, description, longitude, latitude, severity } = req.body;

        console.log("SEVERITY:", severity);

        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);

        const existingCluster = await findCluster(lat, lng);

        let clusterId = existingCluster
            ? (existingCluster.cluster_id || existingCluster._id)
            : new mongoose.Types.ObjectId();

        const newIncident = new Incident({
            user_id: req.user.id,
            type,
            description,
            severity,
            location: {
                type: 'Point',
                coordinates: [lng, lat]
            },
            image: req.file ? req.file.cloudinaryUrl : null,
            cluster_id: clusterId,
            status: 'Pending'
        });

        console.log("NEW INCIDENT:", newIncident);

        const savedIncident = await newIncident.save();

        console.log("SAVED INCIDENT:", savedIncident);

        res.status(201).json(savedIncident);

    } catch (err) {
        console.log("ERROR:", err);

        res.status(500).json({
            message: "Error creating incident",
            error: err.message
        });
    }
};

// Add citizen feedback
exports.addIncidentFeedback = async (req, res) => {
    try {
        const { feedback_type } = req.body;
        const userId = req.user.id;
        const incident = await Incident.findById(req.params.id);

        if (!incident) return res.status(404).json({ message: "Incident not found" });

        if (incident.verified_by.includes(userId) || incident.reported_inaccurate_by.includes(userId)) {
            return res.status(400).json({ message: "You have already provided feedback." });
        }

        if (feedback_type === 'verify') incident.verified_by.push(userId);
        else if (feedback_type === 'inaccurate') incident.reported_inaccurate_by.push(userId);

        const updatedIncident = await incident.save();
        res.status(200).json({ message: "Feedback recorded successfully", incident: updatedIncident });
    } catch (err) {
        res.status(500).json({ message: "Error adding feedback", error: err.message });
    }
};

const NEARBY_CLUSTER_RADIUS_METERS = 10 * 1000; // 10 km

// Cluster incidents near the user's live GPS location
exports.getNearbyClusters = async (req, res) => {
    try {
        const latitude = parseFloat(req.query.latitude);
        const longitude = parseFloat(req.query.longitude);

        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
            return res.status(400).json({
                message: "Query parameters latitude and longitude are required",
            });
        }

        const radiusKm = parseFloat(req.query.radiusKm);
        const maxDistanceMeters = Number.isFinite(radiusKm) && radiusKm > 0
            ? radiusKm * 1000
            : NEARBY_CLUSTER_RADIUS_METERS;

        const clusters = await Incident.aggregate([
            {
                $geoNear: {
                    near: { type: "Point", coordinates: [longitude, latitude] },
                    distanceField: "distanceFromUser",
                    maxDistance: maxDistanceMeters,
                    spherical: true,
                },
            },
            {
                $group: {
                    _id: { $ifNull: ["$cluster_id", "$_id"] },
                    incidents: { $push: "$$ROOT" },
                    count: { $sum: 1 },
                },
            },
        ]);

        res.status(200).json(clusters);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all incidents with pagination
exports.getAllIncidents = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const incidents = await Incident.find()
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit);
            
        res.status(200).json(incidents);
    } catch (err) {
        res.status(500).json({ message: "Error fetching incidents" });
    }
};


// Get incidents assigned to this responder
exports.getAssignedIncidents = async (req, res) => {
  try {
    const incidents = await Incident.find({
      assignedAuthorities: req.user.id
    }).sort({ timestamp: -1 });

    res.status(200).json(incidents);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching assigned incidents",
      error: err.message
    });
  }
};

// Responder updates response status
exports.updateResponseStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Assigned', 'Resolved'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({ message: "Incident not found" });
    }

    if (!incident.assignedAuthorities.includes(req.user.id)) {
      return res.status(403).json({ message: "Not authorized to update this incident" });
    }

    incident.status = status;
    incident.status_history.push({
      status,
      changed_by: req.user.id
    });

    await incident.save();

    // 🔔 Notify the citizen who reported the incident
    await notifyStatusChange(incident);
 
    // 🔔 Notify assigned authorities if status is Assigned
    if (status === 'Assigned') {
      await notifyAssignment(incident);
    }

    res.status(200).json({ message: "Response status updated", incident });

  } catch (err) {
    res.status(500).json({
      message: "Error updating response status",
      error: err.message
    });
  }
};

// Track response progress - get incident history
exports.getResponseProgress = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({ message: "Incident not found" });
    }

    res.status(200).json({
      status: incident.status,
      status_history: incident.status_history,
      assignedAuthorities: incident.assignedAuthorities
    });

  } catch (err) {
    res.status(500).json({
      message: "Error fetching progress",
      error: err.message
    });
  }
};

exports.adminVerifyIncident = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);
    if (!incident) return res.status(404).json({ message: "Incident not found" });
 
    incident.status = 'Verified';
    incident.status_history.push({
      status: 'Verified',
      changed_by: req.user.id,
    });
 
    await incident.save();
    await notifyStatusChange(incident);
 
    res.status(200).json({ message: "Incident verified", incident });
  } catch (err) {
    res.status(500).json({ message: "Error verifying incident", error: err.message });
  }
};
 
// Admin rejects (deletes) an incident as spam
exports.adminRejectIncident = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);
    if (!incident) return res.status(404).json({ message: "Incident not found" });
 
    await Incident.findByIdAndDelete(req.params.id);
 
    res.status(200).json({ message: "Incident rejected and removed" });
  } catch (err) {
    res.status(500).json({ message: "Error rejecting incident", error: err.message });
  }
};
// Admin assigns responder to an incident
exports.assignResponder = async (req, res) => {
  try {
    const { responderId } = req.body;
    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({ message: "Incident not found" });
    }

    const responder = await User.findById(responderId);
    if (!responder || responder.role !== "Authority") {
      return res.status(400).json({ message: "Invalid responder" });
    }

    // Add responder to assignedAuthorities if not already there
    if (!incident.assignedAuthorities.includes(responderId)) {
      incident.assignedAuthorities.push(responderId);
    }

    // Transition status to Assigned if currently Pending or Verified
    if (incident.status === 'Pending' || incident.status === 'Verified') {
      incident.status = 'Assigned';
    }

    // Log status history
    incident.status_history.push({
      status: incident.status,
      changed_by: req.user.id
    });

    await incident.save();
    res.status(200).json({ message: "Responder assigned successfully", incident });
  } catch (err) {
    res.status(500).json({ message: "Error assigning responder", error: err.message });
  }
};

