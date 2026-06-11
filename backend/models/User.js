const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ['Citizen', 'Admin', 'Authority', 'Responder'], // Unified capitalization
    default: 'Citizen'
  },

  district: {
    type: String,
    required: function () {
      return this.role === 'Authority' || this.role === 'Responder';
    }
  },

  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },

  organization: {
    type: String,
    required: function () {
      return this.role === 'Authority' || this.role === 'Responder';
    }
  },

  contact_number: {
    type: String,
    required: true
  },

  registered_date: {
    type: Date,
    default: Date.now
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Active', 'Suspended'], // Included 'Pending'
    default: 'Pending'
  },

  documents: {
    officialIdPath: String,
    authLetterPath: String,
    certCardsPath: String
  },

  resetOTP: String,
  otpExpire: Date
}, {
  timestamps: true
});

UserSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', UserSchema);
