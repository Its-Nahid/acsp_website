const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "general" },
    resetCode: { type: String }, // Temporary 6-digit code for password reset
    resetCodeExpiry: { type: Date }, // Code expiration time
    isVerified: { type: Boolean, default: false },
    signupCode: { type: String },
    signupCodeExpiry: { type: Date }
});

module.exports = mongoose.model("User", userSchema);