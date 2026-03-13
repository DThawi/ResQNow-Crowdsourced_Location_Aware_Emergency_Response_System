const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    latitude: Number,
    longitude: Number
  }
});

module.exports = mongoose.model("Report", reportSchema);