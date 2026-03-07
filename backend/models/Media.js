const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
  incident_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident', required: true },
  file_url: { type: String, required: true }, // URL from Cloud Storage (S3/Firebase) 
  file_type: { type: String, enum: ['image', 'video'], required: true },
  uploaded_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Media', MediaSchema);