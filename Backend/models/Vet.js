const mongoose = require("mongoose");

const vetSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    license: { type: String, required: true }, // BMVC Registration No.
    clinicName: { type: String },
    location: { type: String, required: true },
    specialization: [{ type: String }], // Array of specializations: dogs, cats, birds, exotic
    workingHours: { type: String, required: true },
    bio: { type: String, required: true },
    photo: { type: String }, // Path to uploaded photo
    status: { type: String, default: "pending" }, // pending, approved, rejected
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Vet", vetSchema);