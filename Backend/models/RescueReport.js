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
  status: { 
    type: String, 
    enum: ['Pending', 'Accepted', 'Rejected', 'In Progress', 'Under Treatment', 'Recovered', 'Adopted'], 
    default: 'Pending' 
  },
  assignedNGO: { type: mongoose.Schema.Types.ObjectId, ref: 'NGO' },
  statusUpdates: [{
    status: String,
    note: String,
    updatedAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RescueReport', RescueReportSchema);