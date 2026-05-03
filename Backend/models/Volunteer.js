const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema({
    volunteerId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    assignedNGO: { type: String, required: true },
    role: { type: String, required: true },
    status: { type: String, enum: ["Active", "Inactive", "On-boarding"], default: "On-boarding" },
    joinDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Volunteer", volunteerSchema);
