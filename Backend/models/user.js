const mongoose = require("mongoose");
//user handled
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "general" }
});

module.exports = mongoose.model("User", userSchema);