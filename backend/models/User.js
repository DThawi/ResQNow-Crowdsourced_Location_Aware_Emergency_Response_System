const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: { type: String, required: true, unique: true },

  password: { type: String, required: true },

  role: { 
    type: String, 
    enum: ['Citizen', 'Admin', 'Authority'], 
    default: 'Citizen' 
  },

  district: { 
    type: String, 
    required: function () {
      return this.role === "Authority";
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
      return this.role === "Authority";
    }
  },


  contact_number: { type: String, required: true },

  registered_date: { type: Date, default: Date.now },


  resetOTP: { type: String },
  otpExpire: { type: Date },

  isVerified: {
  type: Boolean,
  default: false
}

});


UserSchema.index({ location: "2dsphere" });

module.exports = mongoose.model('User', UserSchema);
