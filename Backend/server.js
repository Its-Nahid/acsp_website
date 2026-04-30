
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

const User = require("./models/user");
const RescueReport = require("./models/RescueReport");
const Donation = require("./models/Donation");
const Adoption = require("./models/Adoption");
const NGO = require("./models/NGO");
const RescuedAnimal = require("./models/RescuedAnimal");
const SSLCommerzPayment = require("sslcommerz-lts");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads')); // serve uploaded photos
app.use(express.static(path.join(__dirname, '../Frontend'))); // serve frontend files

//Connect MongoDB
mongoose.connect("mongodb://localhost:27017/acspAuth")
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

//Test route
app.get("/", (req, res) => {
    res.send("Backend running");
});

// User Authentication Routes

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

// Rescue Management: Update Status
app.put('/api/reports/:id/status', async (req, res) => {
    try {
        const { status, note, ngoId } = req.body;
        const updateData = { status };
        if (ngoId) updateData.assignedNGO = ngoId;

        const report = await RescueReport.findByIdAndUpdate(
            req.params.id,
            { 
                $set: updateData,
                $push: { statusUpdates: { status, note } }
            },
            { new: true }
        );

        if (!report) return res.status(404).json({ message: "Report not found" });
        res.json({ message: "Status updated successfully", report });
    } catch (error) {
        res.status(500).json({ message: "Server error while updating status" });
    }
});

// Rescue Management: Get cases for a specific NGO
app.get('/api/reports/ngo/:ngoId', async (req, res) => {
    try {
        const reports = await RescueReport.find({ assignedNGO: req.params.ngoId }).sort({ createdAt: -1 });
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: "Server error while fetching NGO reports" });
    }
});

// 10 Adoption Routes
app.post('/adoption', upload.array('photos', 5), async (req, res) => {
    try {
        const photoPaths = req.files ? req.files.map(file => file.path) : [];

        let socialComp = [];
        if (req.body.socialCompatibility) {
            socialComp = Array.isArray(req.body.socialCompatibility)
                ? req.body.socialCompatibility
                : [req.body.socialCompatibility];
        }

        const newAdoption = new Adoption({
            name: req.body.name,
            type: req.body.type,
            breed: req.body.breed,
            age: req.body.age,
            gender: req.body.gender,
            vaccinationStatus: req.body.vaccinationStatus,
            spayedNeutered: req.body.spayedNeutered,
            socialCompatibility: socialComp,
            temperament: req.body.temperament,
            headline: req.body.headline,
            story: req.body.story,
            photos: photoPaths,
            contactName: req.body.contactName,
            phone: req.body.phone,
            location: req.body.location
        });

        await newAdoption.save();
        res.status(201).json({ message: "Adoption post submitted successfully!" });
    } catch (error) {
        console.error("Adoption Submit Error:", error);
        res.status(500).json({ message: "Server error while submitting adoption post" });
    }
});

app.get('/adoptions', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 6;
        const skip = (page - 1) * limit;

        const adoptions = await Adoption.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Adoption.countDocuments();

        res.json({
            adoptions,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            totalReports: total
        });
    } catch (error) {
        res.status(500).json({ message: "Server error while fetching adoptions" });
    }
});

// 9️⃣ SSL COMMERZ INTEGRATION
const store_id = "fluff69d2431081877";
const store_passwd = "fluff69d2431081877@ssl";
const is_live = false;

app.post("/api/donate/init", async (req, res) => {
    const { amount, donorName, phone, location, cause } = req.body;
    const tran_id = "REF" + Date.now();

    const data = {
        total_amount: amount || 2000,
        currency: "BDT",
        tran_id: tran_id, // unique for each payment

        success_url: `http://localhost:5000/api/donate/success`,
        fail_url: `http://localhost:5000/api/donate/fail`,
        cancel_url: `http://localhost:5000/api/donate/cancel`,
        ipn_url: `http://localhost:5000/api/donate/ipn`,

        shipping_method: "No",
        product_name: cause || "Donation",
        product_category: "Charity",
        product_profile: "general",

        cus_name: donorName || "Donor",
        cus_email: "donor@example.com", // Assuming email is optional for now or add to form later
        cus_add1: location || "Bangladesh",
        cus_city: "Dhaka",
        cus_country: "Bangladesh",
        cus_phone: phone || "01711111111",
    };

    try {
        const donation = new Donation({
            amount: data.total_amount,
            transactionId: tran_id,
            donorName: data.cus_name,
            phone: data.cus_phone,
            location: location || "",
            cause: cause || "General Fund"
        });
        await donation.save();

        const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
        sslcz.init(data).then(apiResponse => {
            let GatewayPageURL = apiResponse.GatewayPageURL;
            res.json({ url: GatewayPageURL });
        });
    } catch (err) {
        console.error("Init Error", err);
        res.status(500).json({ message: "Failed to init payment" });
    }
});

app.post("/api/donate/success", async (req, res) => {
    try {
        const val_id = req.body.val_id;
        const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

        // Note: validation returns result as an object
        const response = await sslcz.validate({ val_id });

        if (response && (response.status === 'VALID' || response.status === 'VALIDATED')) {
            await Donation.findOneAndUpdate(
                { transactionId: req.body.tran_id },
                { status: 'VALID', valId: val_id, paymentMethod: response.card_type }
            );
            // Replace with your frontend URL port (assuming 5500 Live Server defaults)
            res.redirect("http://localhost:5500/success.html");
        } else {
            await Donation.findOneAndUpdate({ transactionId: req.body.tran_id }, { status: 'FAILED' });
            res.redirect("http://localhost:5500/fail.html");
        }
    } catch (e) {
        res.redirect("http://localhost:5500/fail.html");
    }
});

app.post("/api/donate/fail", async (req, res) => {
    await Donation.findOneAndUpdate({ transactionId: req.body.tran_id }, { status: 'FAILED' });
    res.redirect("http://localhost:5500/fail.html");
});

app.post("/api/donate/cancel", async (req, res) => {
    await Donation.findOneAndUpdate({ transactionId: req.body.tran_id }, { status: 'CANCELLED' });
    res.redirect("http://localhost:5500/cancel.html");
});

// Gemini AI Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "YOUR_GEMINI_API_KEY");
const aiModel = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: "You are the ACSP AI Assistant, a helpful expert in animal care. You can answer basic questions about pet nutrition, grooming, and common minor symptoms. However, for any complex medical problems, emergencies, or serious symptoms (like severe bleeding, breathing difficulties, or sudden collapse), you MUST advise the user to consult a professional veterinarian or visit the nearest animal clinic immediately. Be concise and friendly."
});

// AI Chat Route
app.post("/api/ai-chat", async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ message: "Message is required" });

        const result = await aiModel.generateContent(message);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({ message: "AI Assistant is currently unavailable" });
    }
});

// NGO Management Routes
app.post('/api/ngo', upload.array('gallery', 10), async (req, res) => {
    try {
        const galleryPaths = req.files ? req.files.map(file => file.path) : [];
        
        // Parse complex objects if sent as strings (common with multipart/form-data)
        const location = typeof req.body.location === 'string' ? JSON.parse(req.body.location) : req.body.location;
        const contact = typeof req.body.contact === 'string' ? JSON.parse(req.body.contact) : req.body.contact;
        const impact = typeof req.body.impact === 'string' ? JSON.parse(req.body.impact) : req.body.impact;
        const services = Array.isArray(req.body.services) ? req.body.services : [req.body.services].filter(Boolean);

        const newNGO = new NGO({
            name: req.body.name,
            registrationId: req.body.registrationId,
            establishedDate: req.body.establishedDate,
            location: location,
            contact: contact,
            services: services,
            impact: impact,
            gallery: galleryPaths
        });

        await newNGO.save();
        res.status(201).json({ message: "NGO Profile created successfully!", ngo: newNGO });
    } catch (error) {
        console.error("NGO Create Error:", error);
        res.status(500).json({ message: "Server error while creating NGO profile" });
    }
});

app.get('/api/ngos', async (req, res) => {
    try {
        const ngos = await NGO.find().sort({ name: 1 });
        res.json(ngos);
    } catch (error) {
        res.status(500).json({ message: "Server error while fetching NGOs" });
    }
});

app.get('/api/ngo/:id', async (req, res) => {
    try {
        const ngo = await NGO.findById(req.params.id);
        if (!ngo) return res.status(404).json({ message: "NGO not found" });
        res.json(ngo);
    } catch (error) {
        res.status(500).json({ message: "Server error while fetching NGO details" });
    }
});

// 🔟 Rescued Animal Inventory Routes
// ... (existing routes)

// 11. Donation Tracking Routes
app.get('/api/donations', async (req, res) => {
    try {
        const { ngo, status } = req.query;
        let query = {};
        if (ngo) query.cause = ngo; // In the model, 'cause' is used for NGO/Cause
        if (status) query.status = status;

        const donations = await Donation.find(query).sort({ createdAt: -1 });
        res.json(donations);
    } catch (error) {
        res.status(500).json({ message: "Server error while fetching donations" });
    }
});

app.get('/api/donations/summary', async (req, res) => {
    try {
        const stats = await Donation.aggregate([
            { $match: { status: 'VALID' } },
            {
                $group: {
                    _id: null,
                    totalFunds: { $sum: "$amount" },
                    totalTransactions: { $sum: 1 }
                }
            }
        ]);

        const ngoDistribution = await Donation.aggregate([
            { $match: { status: 'VALID' } },
            {
                $group: {
                    _id: "$cause",
                    total: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { total: -1 } }
        ]);

        res.json({
            summary: stats[0] || { totalFunds: 0, totalTransactions: 0 },
            distribution: ngoDistribution
        });
    } catch (error) {
        res.status(500).json({ message: "Server error while fetching donation summary" });
    }
});

// Start server
app.post('/api/rescued-animals', upload.array('photos', 5), async (req, res) => {
    try {
        const photoPaths = req.files ? req.files.map(file => file.path) : [];
        
        const newAnimal = new RescuedAnimal({
            animalId: req.body.animalId,
            name: req.body.name,
            category: req.body.category,
            breed: req.body.breed,
            species: req.body.species,
            age: req.body.age,
            rescueDate: req.body.rescueDate,
            status: req.body.status,
            currentLocation: req.body.currentLocation,
            story: req.body.story,
            photos: photoPaths,
            assignedNGO: req.body.assignedNGO
        });

        await newAnimal.save();
        res.status(201).json({ message: "Rescued animal added successfully!", animal: newAnimal });
    } catch (error) {
        console.error("Animal Create Error:", error);
        res.status(500).json({ message: "Server error while adding rescued animal" });
    }
});

app.get('/api/rescued-animals', async (req, res) => {
    try {
        const { category, status } = req.query;
        let query = {};
        if (category) query.category = category;
        if (status) query.status = status;

        const animals = await RescuedAnimal.find(query).sort({ rescueDate: -1 });
        res.json(animals);
    } catch (error) {
        res.status(500).json({ message: "Server error while fetching rescued animals" });
    }
});

app.get('/api/rescued-animals/:id', async (req, res) => {
    try {
        const animal = await RescuedAnimal.findById(req.params.id).populate('assignedNGO');
        if (!animal) return res.status(404).json({ message: "Animal not found" });
        res.json(animal);
    } catch (error) {
        res.status(500).json({ message: "Server error while fetching animal details" });
    }
});

app.put('/api/rescued-animals/:id', async (req, res) => {
    try {
        const updatedAnimal = await RescuedAnimal.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        if (!updatedAnimal) return res.status(404).json({ message: "Animal not found" });
        res.json({ message: "Animal updated successfully", animal: updatedAnimal });
    } catch (error) {
        res.status(500).json({ message: "Server error while updating animal" });
    }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));