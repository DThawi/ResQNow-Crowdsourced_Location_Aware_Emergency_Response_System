const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['Citizen', 'Admin', 'Authority'], // Matches your Role Modeling 
    default: 'Citizen' 
  },
  
  district: { 
    type: String, 
    required: function () {
      return this.role === "Authority"; // only required for authorities
    }
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
  organization: { 
    type: String, 
    required: function () {
      return this.role === "Authority"; // only required for authorities
    }
  },
  contact_number: { type: String, required: true },
  registered_date: { type: Date, default: Date.now }
});
UserSchema.index({ location: "2dsphere" });

module.exports = mongoose.model('User', UserSchema);