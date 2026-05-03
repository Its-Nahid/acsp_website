const mongoose = require("mongoose");
//rescued animals
const RescuedAnimalSchema = new mongoose.Schema({
    animalId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: {
        type: String,
        required: true,
        enum: ["Dogs", "Cats", "Birds", "Others"]
    },
    breed: { type: String },
    species: { type: String },
    age: { type: String },
    rescueDate: { type: Date },
    status: {
        type: String,
        required: true,
        enum: ["Ready for Adoption", "Under Treatment", "Rehabilitation", "Critical Care", "Recovered", "Adopted"],
        default: "Under Treatment"
    },
    currentLocation: { type: String },
    photos: [{ type: String }],
    story: { type: String },
    assignedNGO: { type: mongoose.Schema.Types.ObjectId, ref: "NGO" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("RescuedAnimal", RescuedAnimalSchema);
