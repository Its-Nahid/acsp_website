require("dotenv").config();
const mongoose = require("mongoose");
const Vet = require("./models/Vet");

const sampleVets = [
    {
        name: "Dr. Rahat Hasan",
        email: "rahat.hasan@example.com",
        phone: "+880 1712 345678",
        license: "BMVC-12345",
        clinicName: "Central Pet Hospital",
        location: "Dhanmondi, Dhaka",
        specialization: ["dogs"],
        workingHours: "Sat - Thu, 10am - 8pm",
        bio: "Experienced veterinarian specializing in small animal medicine with over 10 years of practice. Committed to providing compassionate care for pets and their families.",
        status: "approved"
    },
    {
        name: "Dr. Sarah Khan",
        email: "sarah.khan@example.com",
        phone: "+880 1812 345678",
        license: "BMVC-23456",
        clinicName: "Elite Vet Care",
        location: "Gulshan 2, Dhaka",
        specialization: ["cats"],
        workingHours: "Daily, 9am - 9pm",
        bio: "Feline medicine specialist with a passion for cats. Extensive experience in feline health, behavior, and surgery.",
        status: "approved"
    },
    {
        name: "Dr. Amit Sen",
        email: "amit.sen@example.com",
        phone: "+880 1912 345678",
        license: "BMVC-34567",
        clinicName: "Metro Animal Clinic",
        location: "Banani, Dhaka",
        specialization: ["dogs", "cats"],
        workingHours: "24/7 Emergency",
        bio: "Emergency and critical care specialist. Available round the clock for emergency surgeries and intensive care.",
        status: "approved"
    },
    {
        name: "Dr. Nadia Islam",
        email: "nadia.islam@example.com",
        phone: "+880 1512 345678",
        license: "BMVC-45678",
        clinicName: "Wildlife & Exotic Care",
        location: "Uttara, Dhaka",
        specialization: ["birds", "exotic"],
        workingHours: "Mon - Fri, 11am - 6pm",
        bio: "Specialist in avian and exotic animal medicine. Dedicated to the care of birds, reptiles, and other exotic pets.",
        status: "approved"
    }
];

async function seedVets() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/acspAuth");
        console.log("MongoDB Connected");
        
        console.log("Seeding vets...");
        
        // Clear existing vets
        await Vet.deleteMany({});
        
        // Insert sample vets
        await Vet.insertMany(sampleVets);
        
        console.log("Vets seeded successfully!");
        
        // Close connection
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error("Error seeding vets:", error);
        process.exit(1);
    }
}

seedVets();