const mongoose = require("mongoose");

const AdoptionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    breed: { type: String },
    age: { type: String },
    gender: { type: String },
    vaccinationStatus: { type: String },
    spayedNeutered: { type: String },
    socialCompatibility: [{ type: String }],
    temperament: { type: String },
    headline: { type: String, required: true },
    story: { type: String },
    photos: [{ type: String }],
    contactName: { type: String, required: true },
    phone: { type: String, required: true },
    location: { type: String },
    status: { type: String, default: "Active" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Adoption", AdoptionSchema);
