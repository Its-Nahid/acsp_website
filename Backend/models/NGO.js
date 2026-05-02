const mongoose = require('mongoose');
//ngo dashboard 
const NGOSchema = new mongoose.Schema({
  name: { type: String, required: true },
  registrationId: { type: String },
  establishedDate: { type: Date },
  location: {
    address: { type: String },
    city: { type: String },
    country: { type: String },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  contact: {
    phone: { type: String },
    email: { type: String },
    website: { type: String }
  },
  services: [{ type: String }],
  impact: {
    animalsRescued: { type: Number, default: 0 },
    successfulAdoptions: { type: Number, default: 0 },
    activeVolunteers: { type: Number, default: 0 }
  },
  gallery: [{ type: String }], // Array of photo paths/filenames
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('NGO', NGOSchema);
