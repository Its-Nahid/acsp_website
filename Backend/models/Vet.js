const mongoose = require('mongoose');

const vetSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    license: { type: String, required: true },
    clinicName: { type: String },
    location: { type: String, required: true },
    specialization: [{ type: String }],
    workingHours: { type: String },
    bio: { type: String },
    photo: { type: String },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vet', vetSchema);
