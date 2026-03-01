const mongoose = require('mongoose');

const RescueReportSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  caseSummary: String,
  description: String,
  location: String,
  animalType: String,
  category: String,
  urgency: String,
  photos: [String], // store filenames
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RescueReport', RescueReportSchema);