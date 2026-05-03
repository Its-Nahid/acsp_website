const mongoose = require('mongoose');
//report allow
const ReportSchema = new mongoose.Schema({
  fullName: String,
  phone: String,
  animalType: String,
  category: String,
  urgency: String,
  caseSummary: String,
  description: String,
  photos: [String],   // store uploaded filenames
  location: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', ReportSchema);