const mongoose = require("mongoose");
const { findCluster } = require("../utils/clustering");
const User = require('../models/User');
const Incident = require('../models/Incident');

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
        let { type, description, longitude, latitude } = req.body;
        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);

        const existingCluster = await findCluster(lat, lng);
        let clusterId = existingCluster ? (existingCluster.cluster_id || existingCluster._id) : new mongoose.Types.ObjectId();

        const newIncident = new Incident({
            user_id: req.user.id, // 
            type,
            description,
            location: {
                type: 'Point',
                coordinates: [lng, lat]
            },
            image: req.file ? req.file.cloudinaryUrl : null,
            cluster_id: clusterId,
            status: 'Pending'
        });

        const savedIncident = await newIncident.save();
        res.status(201).json(savedIncident);
    } catch (err) {
        res.status(500).json({ message: "Error creating incident", error: err.message });
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

// Get all incidents
exports.getAllIncidents = async (req, res) => {
    try {
        const incidents = await Incident.find().sort({ timestamp: -1 });
        res.status(200).json(incidents);
    } catch (err) {
        res.status(500).json({ message: "Error fetching incidents" });
    }
};

// Update status (Admin)
exports.updateIncidentStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const incident = await Incident.findById(req.params.id);
        if (!incident) return res.status(404).json({ message: "Incident not found" });

        incident.status = status;
        incident.status_history.push({ status, changed_by: req.user.id });
        await incident.save();
        res.status(200).json({ message: "Status updated", incident });
    } catch (err) {
        res.status(500).json({ message: "Error updating status" });
    }
};
