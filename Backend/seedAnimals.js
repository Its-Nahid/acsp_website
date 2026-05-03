const mongoose = require('mongoose');
const RescuedAnimal = require('./models/RescuedAnimal');

const MONGODB_URI = "mongodb://localhost:27017/acspAuth";

const animals = [
    // Dogs
    {
        animalId: "DG-001",
        name: "Buddy",
        category: "Dogs",
        breed: "Golden Retriever",
        age: "3 yrs",
        rescueDate: new Date("2024-03-12"),
        status: "Ready for Adoption",
        currentLocation: "ACSP Main Shelter",
        story: "A friendly Golden Retriever rescued from the streets, now healthy and ready for a home."
    },
    {
        animalId: "DG-002",
        name: "Luna",
        category: "Dogs",
        breed: "Mixed Street Dog",
        age: "1 yr",
        rescueDate: new Date("2024-04-05"),
        status: "Under Treatment",
        currentLocation: "Hope Animal Clinic",
        story: "Luna was found with a leg injury. She is recovering well under medical supervision."
    },
    {
        animalId: "DG-003",
        name: "Rocky",
        category: "Dogs",
        breed: "German Shepherd",
        age: "5 yrs",
        rescueDate: new Date("2024-02-28"),
        status: "Rehabilitation",
        currentLocation: "Foster Care (Sarah)",
        story: "Rocky is undergoing behavioral rehabilitation to help him overcome past trauma."
    },
    {
        animalId: "DG-004",
        name: "Bella",
        category: "Dogs",
        breed: "Labrador",
        age: "8 mos",
        rescueDate: new Date("2024-04-10"),
        status: "Ready for Adoption",
        currentLocation: "ACSP North Branch",
        story: "A playful puppy full of energy, looking for an active family."
    },
    // Cats
    {
        animalId: "CT-001",
        name: "Milo",
        category: "Cats",
        breed: "Persian",
        age: "2 yrs",
        rescueDate: new Date("2024-03-20"),
        status: "Ready for Adoption",
        currentLocation: "Happy Paws Foster",
        story: "A beautiful Persian cat with a calm temperament."
    },
    {
        animalId: "CT-002",
        name: "Nala",
        category: "Cats",
        breed: "Domestic Shorthair",
        age: "6 mos",
        rescueDate: new Date("2024-04-15"),
        status: "Under Treatment",
        currentLocation: "ACSP Main Shelter",
        story: "Rescued from a construction site, currently being treated for malnutrition."
    },
    {
        animalId: "CT-003",
        name: "Simba",
        category: "Cats",
        breed: "Siamese",
        age: "4 yrs",
        rescueDate: new Date("2024-01-10"),
        status: "Ready for Adoption",
        currentLocation: "ACSP Main Shelter",
        story: "A very vocal and affectionate Siamese cat."
    },
    {
        animalId: "CT-004",
        name: "Whiskers",
        category: "Cats",
        breed: "Calico",
        age: "1 yr",
        rescueDate: new Date("2024-04-22"),
        status: "Critical Care",
        currentLocation: "Vet Central",
        story: "In critical condition after a road accident. We are doing everything possible."
    },
    // Birds
    {
        animalId: "BD-001",
        name: "Sky",
        category: "Birds",
        species: "Parakeet",
        age: "1 yr",
        rescueDate: new Date("2024-03-15"),
        status: "Ready for Adoption",
        currentLocation: "Winged Friends Aviary",
        story: "A vibrant parakeet found lost in a park."
    },
    {
        animalId: "BD-002",
        name: "Zazu",
        category: "Birds",
        species: "African Grey",
        age: "2 yrs",
        rescueDate: new Date("2024-04-01"),
        status: "Rehabilitation",
        currentLocation: "Bird Sanctuary",
        story: "Rescued from an illegal trade, now learning to trust humans again."
    },
    {
        animalId: "BD-003",
        name: "Pip",
        category: "Birds",
        species: "Sparrow (Injury)",
        age: "Juvenile",
        rescueDate: new Date("2024-04-25"),
        status: "Recovery",
        currentLocation: "ACSP Main Shelter",
        story: "A young sparrow recovering from a wing injury."
    },
    // Others
    {
        animalId: "OT-001",
        name: "Thumper",
        category: "Others",
        species: "Rabbit (Dutch)",
        age: "2 yrs",
        rescueDate: new Date("2024-03-05"),
        status: "Ready for Adoption",
        currentLocation: "ACSP Main Shelter",
        story: "A gentle rabbit abandoned in a box."
    },
    {
        animalId: "OT-002",
        name: "Shelly",
        category: "Others",
        species: "Box Turtle",
        age: "Unknown",
        rescueDate: new Date("2024-02-15"),
        status: "Hibernation/Observation",
        currentLocation: "Nature Park",
        story: "Rescued from a dry well, currently being observed during hibernation period."
    },
    {
        animalId: "OT-003",
        name: "Hammy",
        category: "Others",
        species: "Hamster",
        age: "1 yr",
        rescueDate: new Date("2024-04-18"),
        status: "Ready for Adoption",
        currentLocation: "Happy Paws Foster",
        story: "A small, active hamster rescued from a pet store closure."
    }
];

async function seedAnimals() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB for animal inventory seeding...");

        // Clear existing animals to avoid duplicate animalId errors
        await RescuedAnimal.deleteMany({});
        console.log("Cleared existing rescued animal records.");

        await RescuedAnimal.insertMany(animals);
        console.log(`Successfully seeded ${animals.length} animals into the inventory!`);

        mongoose.connection.close();
        console.log("Database connection closed.");
    } catch (error) {
        console.error("Seeding error:", error);
        process.exit(1);
    }
}

seedAnimals();
