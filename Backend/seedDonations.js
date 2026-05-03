const mongoose = require('mongoose');
const Donation = require('./models/Donation');

const MONGODB_URI = "mongodb://localhost:27017/acspAuth";

const donations = [
    {
        transactionId: "REF1714480001",
        donorName: "Rahat Khan",
        cause: "Hope Animal Clinic",
        amount: 5000,
        status: "VALID",
        createdAt: new Date("2024-04-30")
    },
    {
        transactionId: "REF1714480002",
        donorName: "Nusrat Jahan",
        cause: "Save The Paws",
        amount: 2500,
        status: "VALID",
        createdAt: new Date("2024-04-29")
    },
    {
        transactionId: "REF1714480003",
        donorName: "Anonymous",
        cause: "ACSP General Fund",
        amount: 10000,
        status: "VALID",
        createdAt: new Date("2024-04-29")
    },
    {
        transactionId: "REF1714480004",
        donorName: "Karim Ahmed",
        cause: "Winged Friends",
        amount: 1200,
        status: "VALID",
        createdAt: new Date("2024-04-28")
    },
    {
        transactionId: "REF1714480005",
        donorName: "Saira Banu",
        cause: "Happy Paws Foster",
        amount: 3000,
        status: "VALID",
        createdAt: new Date("2024-04-27")
    },
    {
        transactionId: "REF1714480006",
        donorName: "Tanvir Hossain",
        cause: "Hope Animal Clinic",
        amount: 15000,
        status: "VALID",
        createdAt: new Date("2024-04-27")
    },
    {
        transactionId: "REF1714480007",
        donorName: "Anonymous",
        cause: "Save The Paws",
        amount: 500,
        status: "PENDING",
        createdAt: new Date("2024-04-26")
    },
    {
        transactionId: "REF1714480008",
        donorName: "Mehedi Hasan",
        cause: "ACSP General Fund",
        amount: 2000,
        status: "FAILED",
        createdAt: new Date("2024-04-25")
    },
    // Adding bulk entries to match the summary totals in donation_tracking.md
    {
        transactionId: "BULK_STP_01",
        donorName: "Monthly Pledges",
        cause: "Save The Paws",
        amount: 347000,
        status: "VALID",
        createdAt: new Date("2024-04-01")
    },
    {
        transactionId: "BULK_HOPE_01",
        donorName: "Corporate Sponsors",
        cause: "Hope Animal Clinic",
        amount: 400500,
        status: "VALID",
        createdAt: new Date("2024-04-01")
    },
    {
        transactionId: "BULK_HAPPY_01",
        donorName: "Foster Network",
        cause: "Happy Paws Foster",
        amount: 212000,
        status: "VALID",
        createdAt: new Date("2024-04-01")
    },
    {
        transactionId: "BULK_WINGED_01",
        donorName: "Bird Lovers Group",
        cause: "Winged Friends",
        amount: 123800,
        status: "VALID",
        createdAt: new Date("2024-04-01")
    },
    {
        transactionId: "BULK_ACSP_01",
        donorName: "Founding Members",
        cause: "ACSP General Fund",
        amount: 123000,
        status: "VALID",
        createdAt: new Date("2024-04-01")
    }
];

async function seedDonations() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB for donation seeding...");

        // Clear existing donations to avoid transactionId conflicts
        await Donation.deleteMany({});
        console.log("Cleared existing donations.");

        await Donation.insertMany(donations);
        console.log("Database seeded with donation records successfully!");

        mongoose.connection.close();
    } catch (error) {
        console.error("Seeding error:", error);
        process.exit(1);
    }
}

seedDonations();
