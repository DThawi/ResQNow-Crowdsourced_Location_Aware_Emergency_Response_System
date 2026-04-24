const mongoose = require('mongoose');

const IncidentSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },

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
  assignedAuthorities: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  ],
  status: {
    type: String,
    enum: ['Pending', 'Verified', 'Assigned', 'Resolved'],
    default: 'Pending'
  },

  assignedAuthority: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  status_history: [{
    status: {
      type: String,
      enum: ['Pending', 'Verified', 'Assigned', 'Resolved']
    },
    timestamp: { type: Date, default: Date.now },
    changed_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  timestamp: { type: Date, default: Date.now },

  cluster_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Incident',
    default: null
  },
});

IncidentSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Incident', IncidentSchema);
// module.exports = mongoose.models.Incident || mongoose.model('Incident', IncidentSchema);