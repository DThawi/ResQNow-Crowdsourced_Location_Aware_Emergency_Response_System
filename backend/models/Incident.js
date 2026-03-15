const mongoose = require('mongoose');

const IncidentSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true }, // e.g., Accident, Fire, Flood [cite: 247]
  description: { type: String, required: true },
  image:{
    type: String
  },
 location: {
    type: {
      type: String, 
      enum: ['Point'], 
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Verified', 'Assigned', 'Resolved'], // Matches your Lifecycle Logic [cite: 273]
    default: 'Pending' 
  },
  timestamp: { type: Date, default: Date.now }
});
IncidentSchema.index({ location: '2dsphere' }); //find nearby queries

module.exports = mongoose.model('Incident', IncidentSchema);
