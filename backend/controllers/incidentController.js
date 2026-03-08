//Handles creating reports with GPS data and manages the lifecycle status.
const Incident = require('../models/Incident.js');

//create new incident report
exports.createIncident = async (req, res) => { 
  try{
    const{ type, description, location} = req.body;
    const newIncident = new Incident({
      user_id: req.user.id,
      type,
      description,
      location
    });

  const savedIncident = await newIncident.save();
  res.status(201).json(savedIncident);
}
  catch(err) {
    res.status(500).json({ message: "Error creating incident", error: err.message });
  } 
};


//get all incidents - for live map
exports.getAllIncidents = async (req, res) => {
  try{
    const incidents = await Incident.find().sort({ timestamp: -1 });
    res.status(200).json(incidents);
  } 
  catch(err) {
    res.status(500).json({ message: "Error fetching incidents", error: err.message });
  }
};


//update incident status - admin, responder
exports.updateIncidentStatus = async (req, res) => {
  try{
    const {status} = req.body;
    const updateIncident = await Incident.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
      );
    res.status(200).json(updateIncident);
  }
  catch(err) {
    res.status(500).json({ messaage: "Error updating status", error: err.message });
  }
};
