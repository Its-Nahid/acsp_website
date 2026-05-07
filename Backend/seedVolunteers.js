const mongoose = require("mongoose");
const Volunteer = require("./models/Volunteer");
const VolunteerOpportunity = require("./models/VolunteerOpportunity");

mongoose.connect("mongodb://localhost:27017/acspAuth")
    .then(() => console.log("MongoDB Connected for Seeding"))
    .catch(err => console.log(err));

const volunteers = [
    { volunteerId: "VOL-2024-001", name: "Arif Hossain", assignedNGO: "Save The Paws", role: "Rescue Assist", status: "Active" },
    { volunteerId: "VOL-2024-002", name: "Sumaiya Akter", assignedNGO: "Hope Animal Clinic", role: "Medical Aid", status: "Active" },
    { volunteerId: "VOL-2024-003", name: "Imtiaz Ahmed", assignedNGO: "ACSP Central", role: "Photography", status: "Active" },
    { volunteerId: "VOL-2024-004", name: "Farhana Ritu", assignedNGO: "Happy Paws Foster", role: "Foster Management", status: "On-boarding" },
    { volunteerId: "VOL-2024-005", name: "Sajid Khan", assignedNGO: "Winged Friends", role: "Bird Handling", status: "Active" },
    { volunteerId: "VOL-2024-006", name: "Maliha Kabir", assignedNGO: "Save The Paws", role: "Social Media", status: "Inactive" },
    { volunteerId: "VOL-2024-007", name: "Tanvir Sifat", assignedNGO: "Hope Animal Clinic", role: "Transport", status: "Active" }
];

const opportunities = [
    { ngoName: "Save The Paws", requiredRole: "Night Rescue Driver", commitment: "10pm - 2am", urgency: "High" },
    { ngoName: "Hope Animal Clinic", requiredRole: "Pharmacy Inventory", commitment: "Weekend Mornings", urgency: "Medium" },
    { ngoName: "Winged Friends", requiredRole: "Aviary Cleaner", commitment: "4 hrs/week", urgency: "Low" },
    { ngoName: "Happy Paws Foster", requiredRole: "Puppy Socializer", commitment: "Flexible", urgency: "Medium" },
    { ngoName: "ACSP Tech Team", requiredRole: "UI/UX Designer", commitment: "Project Based", urgency: "Medium" }
];

const seedDB = async () => {
    try {
        await Volunteer.deleteMany({});
        await VolunteerOpportunity.deleteMany({});
        
        await Volunteer.insertMany(volunteers);
        await VolunteerOpportunity.insertMany(opportunities);
        
        console.log("Database Seeded successfully!");
        process.exit();
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedDB();
