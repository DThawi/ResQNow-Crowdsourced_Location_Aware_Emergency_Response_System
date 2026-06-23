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

  profileImage: {
    type: String,
    default: null
  },

  notificationSettings: {
    sms: { type: Boolean, default: false },
    vibration: { type: Boolean, default: true },
    sound: { type: Boolean, default: true },
    notification: { type: Boolean, default: true },
    emailNotification: { type: Boolean, default: true },
    criticalAlert: { type: Boolean, default: true },
    fireIncidents: { type: Boolean, default: true },
    trafficAccidents: { type: Boolean, default: true },
    medicalEmergencies: { type: Boolean, default: true },
    crimeReports: { type: Boolean, default: true },
    reportVerification: { type: Boolean, default: true },
    reportUpdates: { type: Boolean, default: true },
    commentReplies: { type: Boolean, default: false }
  },

  privacySettings: {
    twoFactorEnabled: { type: Boolean, default: false },
    shareLocation: { type: Boolean, default: true },
    shareReports: { type: Boolean, default: true },
    profileVisibility: { type: String, enum: ['public', 'private'], default: 'public' }
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
