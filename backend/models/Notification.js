const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['alert', 'update', 'assignment'], 
    default: 'alert' 
  },
  incident_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Incident' 
  },
  is_read: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', NotificationSchema);