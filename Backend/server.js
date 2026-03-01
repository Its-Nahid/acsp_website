// 1️⃣ Import packages
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

const User = require("./models/user");
const RescueReport = require("./models/RescueReport");

// 2️⃣ Initialize Express
const app = express();

// 3️⃣ Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // serve uploaded photos

// 4️⃣ Connect MongoDB
mongoose.connect("mongodb://localhost:27017/acspAuth")
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// 5️⃣ Test route
app.get("/", (req, res) => {
    res.send("Backend running");
});

// 6️⃣ User Authentication Routes

// REGISTER
app.post("/signup", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ name, email, password: hashedPassword, role: role || "general" });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// LOGIN
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid password" });

        const token = jwt.sign({ id: user._id }, "mySecretKey", { expiresIn: "1d" });

        res.json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// 7️⃣ Multer setup for photo uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// 8️⃣ Rescue Report Route
app.post('/report', upload.array('photos', 5), async (req, res) => {
    try {
        // Ensure req.files exists before mapping
        const photoPaths = req.files ? req.files.map(file => file.path) : [];

        const newReport = new RescueReport({
            fullName: req.body.fullName,
            phone: req.body.phone,
            animalType: req.body.animalType,
            category: req.body.category,
            urgency: req.body.urgency,
            caseSummary: req.body.caseSummary,
            description: req.body.description,
            location: req.body.location,
            photos: photoPaths
        });

        await newReport.save();
        res.status(201).json({ message: "Rescue report submitted successfully!" });
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ message: "Server error while submitting report" });
    }
});

// GET all reports with pagination
app.get('/reports', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 6;
        const skip = (page - 1) * limit;

        const reports = await RescueReport.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await RescueReport.countDocuments();

        res.json({
            reports,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            totalReports: total
        });
    } catch (error) {
        res.status(500).json({ message: "Server error while fetching reports" });
    }
});

// 9️⃣ Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));