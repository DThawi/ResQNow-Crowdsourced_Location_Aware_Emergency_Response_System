const mongoose = require("mongoose");
const { findCluster } = require("../utils/clustering");
const User = require('../models/User');
const Incident = require('../models/Incident');
const { notifyAssignment, notifyStatusChange } = require('../utils/notificationHelper');
const { autoAssignResponder } = require('../utils/autoAssignment');

// Fetch user-specific reports
exports.getMyReports = async (req, res) => {
    try {
        // req.user.id is populated by the verifyToken middleware
        const reports = await Incident.find({ user_id: req.user.id })
            .sort({ timestamp: -1 })
            .lean();

        const countUniqueUsers = (feedback = []) =>
            new Set(
                feedback
                    .filter(Boolean)
                    .map((user) => String(user._id || user))
            ).size;

        const reportsWithFeedbackCounts = reports.map((report) => ({
            ...report,
            likes_count: countUniqueUsers(report.verified_by),
            dislikes_count: countUniqueUsers(report.reported_inaccurate_by),
        }));

        res.status(200).json({ reports: reportsWithFeedbackCounts });
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

        // Attempt automated assignment
        await autoAssignResponder(savedIncident);

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

        if (!['verify', 'inaccurate'].includes(feedback_type)) {
            return res.status(400).json({ message: 'Feedback type must be verify or inaccurate.' });
        }

        const incident = await Incident.findById(req.params.id);

        if (!incident) return res.status(404).json({ message: "Incident not found" });

        if (String(incident.user_id?._id || incident.user_id) === String(userId)) {
            return res.status(403).json({
                message: "You can't verify or report inaccuracy because you created this incident report.",
            });
        }

        incident.verified_by = incident.verified_by || [];
        incident.reported_inaccurate_by = incident.reported_inaccurate_by || [];

        const hasAlreadyGivenFeedback = [
            ...incident.verified_by,
            ...incident.reported_inaccurate_by,
        ].some((id) => String(id?._id || id) === String(userId));

        if (hasAlreadyGivenFeedback) {
            return res.status(400).json({ message: "You have already provided feedback." });
        }

        if (feedback_type === 'verify') incident.verified_by.push(userId);
        if (feedback_type === 'inaccurate') incident.reported_inaccurate_by.push(userId);

        const updatedIncident = await incident.save();
        res.status(200).json({
            message: "Feedback recorded successfully",
            incident: updatedIncident,
            likes_count: new Set(updatedIncident.verified_by.map((id) => String(id?._id || id))).size,
            dislikes_count: new Set(updatedIncident.reported_inaccurate_by.map((id) => String(id?._id || id))).size,
        });
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

// Responder declines an assigned dispatch. This removes only the current
// responder, so any other units assigned to the incident remain unaffected.
exports.declineAssignment = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({ message: "Incident not found" });
    }

    const wasAssigned = incident.assignedAuthorities.some(
      (id) => id.toString() === req.user.id.toString()
    );

    if (!wasAssigned) {
      return res.status(403).json({ message: "You are not assigned to this incident" });
    }

    incident.assignedAuthorities = incident.assignedAuthorities.filter(
      (id) => id.toString() !== req.user.id.toString()
    );

    // If this was the only assigned unit, return the incident to the verified
    // queue so it can be assigned to another responder.
    if (incident.assignedAuthorities.length === 0 && incident.status === 'Assigned') {
      incident.status = 'Verified';
      incident.status_history.push({
        status: 'Verified',
        changed_by: req.user.id,
      });
    }

    await incident.save();
    res.status(200).json({ message: "Dispatch declined", incident });
  } catch (err) {
    res.status(500).json({
      message: "Error declining dispatch",
      error: err.message,
    });
  }
};

// Responder updates response status
exports.updateResponseStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Assigned', 'En Route', 'In Progress', 'Resolved'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({ message: "Incident not found" });
    }

    // if (!incident.assignedAuthorities.includes(req.user.id)) {
    //   if (status === 'Assigned') {
    //     incident.assignedAuthorities.push(req.user.id);
    //   } else {
    //     return res.status(403).json({ message: "Not authorized to update this incident" });
    //   }
    // }

    // Check if the current user is an Admin
const isAdmin = req.user.role === "Admin";

// Check if the current user is one of the assigned responders/authorities
const isAssignedResponder = incident.assignedAuthorities.some(
  (id) => id.toString() === req.user.id.toString()
);

// Allow Admin OR assigned responder to update the incident
if (!isAdmin && !isAssignedResponder) {
  if (status === "Assigned") {
    incident.assignedAuthorities.push(req.user.id);
  } else {
    return res.status(403).json({
      message: "Not authorized to update this incident"
    });
  }
}
    incident.status = status;
    if (status === 'Assigned' && !incident.assigned_at) {
      incident.assigned_at = new Date();
    }

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
 
    // Attempt automated assignment
    await autoAssignResponder(incident);

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
    if (!responder || (responder.role !== "Authority" && responder.role !== "Responder")) {
      return res.status(400).json({ message: "Invalid responder" });
    }

    // Add the responder only once. ObjectId instances do not compare reliably
    // with request-body strings when using Array#includes.
    const isAlreadyAssigned = incident.assignedAuthorities.some(
      (id) => id.toString() === responder._id.toString()
    );

    if (!isAlreadyAssigned) {
      incident.assignedAuthorities.push(responder._id);
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

    // The responder dashboard can detect assigned incidents directly, but the
    // alerts screen reads Notification records. Create one for a new manual
    // assignment so both views stay in sync. Limit the recipients to the newly
    // assigned responder to avoid duplicating existing responders' alerts.
    if (!isAlreadyAssigned) {
      await notifyAssignment({
        ...(typeof incident.toObject === 'function' ? incident.toObject() : incident),
        assignedAuthorities: [responder._id],
      });
    }

    res.status(200).json({ message: "Responder assigned successfully", incident });
  } catch (err) {
    res.status(500).json({ message: "Error assigning responder", error: err.message });
  }
};

