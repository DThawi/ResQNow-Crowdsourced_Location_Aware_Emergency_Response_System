const mongoose = require('mongoose');

const authoritySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String, // Police, Ambulance, Fire
    required: true
  },
  districts: [
    {
      type: String
    }
  ],
  contact: {
    type: String
  }
});

module.exports = mongoose.model('Authority', authoritySchema);