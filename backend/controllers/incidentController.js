// Handles creating reports with GPS data and manages the lifecycle status.

const Incident = require('../models/Incident');

// Create new incident report
exports.createIncident = async (req, res) => {
  try {

    const { type, description, longitude, latitude } = req.body;

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
  return res.status(400).json({ message: "Invalid GPS coordinates" });
}

    const newIncident = new Incident({
      user_id: req.user.id,
      type,
      description,
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)] // Location update
      },
      image: req.file ? req.file.path : null
    });

    const savedIncident = await newIncident.save();

    res.status(201).json(savedIncident);
  } catch (err) {
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

    const updatedIncident = await Incident.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedIncident) {
      return res.status(404).json({
        message: "Incident not found"
      });
    }

    res.status(200).json(updatedIncident);

  } catch (err) {
    res.status(500).json({
      message: "Error updating status",
      error: err.message
    });
  }
};