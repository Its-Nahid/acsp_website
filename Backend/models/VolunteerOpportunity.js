const mongoose = require("mongoose");

const volunteerOpportunitySchema = new mongoose.Schema({
    ngoName: { type: String, required: true },
    requiredRole: { type: String, required: true },
    commitment: { type: String, required: true },
    urgency: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    location: { type: String },
    contactEmail: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("VolunteerOpportunity", volunteerOpportunitySchema);
