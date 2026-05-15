
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const path = require("path");
//server 
const User = require("./models/user");
const RescueReport = require("./models/RescueReport");
const Donation = require("./models/Donation");
const Adoption = require("./models/Adoption");
const NGO = require("./models/NGO");
const RescuedAnimal = require("./models/RescuedAnimal");
const Volunteer = require("./models/Volunteer");
const VolunteerOpportunity = require("./models/VolunteerOpportunity");
const SSLCommerzPayment = require("sslcommerz-lts");
const axios = require("axios");
const nodemailer = require("nodemailer");
const Vet = require("./models/Vet");

console.log("Groq API Key loaded:", process.env.GROQ_API_KEY ? "Yes" : "No");

// Cloudinary Configuration
console.log("Cloudinary Config:", {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "Loaded" : "Missing",
    api_key: process.env.CLOUDINARY_API_KEY ? "Loaded" : "Missing",
    api_secret: process.env.CLOUDINARY_API_SECRET ? "Loaded" : "Missing"
});

console.log("Email Config:", {
    user: process.env.EMAIL_USER ? "Loaded" : "Missing",
    pass: process.env.EMAIL_PASS ? "Loaded" : "Missing"
});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../Frontend'))); // serve frontend files

//Connect MongoDB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/acspAuth")
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
        
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required" });
        }

        let existingUser = await User.findOne({ email });
        
        if (existingUser && existingUser.isVerified !== false) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const signupCode = Math.floor(100000 + Math.random() * 900000).toString();
        const signupCodeExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

        if (existingUser && existingUser.isVerified === false) {
            // Update unverified user
            existingUser.name = name;
            existingUser.password = hashedPassword;
            existingUser.role = role || "general";
            existingUser.signupCode = signupCode;
            existingUser.signupCodeExpiry = signupCodeExpiry;
            await existingUser.save();
        } else {
            const newUser = new User({ 
                name, email, password: hashedPassword, role: role || "general", 
                signupCode, signupCodeExpiry, isVerified: false 
            });
            await newUser.save();
        }

        // Configure Nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Email content
        const mailOptions = {
            from: `"ACSP Team" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "ACSP - Verify Your Account",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #f98c06; text-align: center;">Welcome to ACSP!</h2>
                    <p>Hello ${name},</p>
                    <p>Thank you for registering. Please use the 6-digit code below to verify your account:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333; background: #f4f4f4; padding: 10px 20px; border-radius: 5px;">${signupCode}</span>
                    </div>
                    <p style="color: #555; font-size: 14px;">This code will expire in 15 minutes.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: "Verification code sent to your email", requireVerification: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// VERIFY SIGNUP CODE
app.post("/verify-signup", async (req, res) => {
    try {
        const { email, code } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) return res.status(400).json({ message: "User not found" });
        if (user.isVerified) return res.status(400).json({ message: "User is already verified" });
        if (!user.signupCode || user.signupCode !== code) return res.status(400).json({ message: "Invalid verification code" });
        if (user.signupCodeExpiry < new Date()) return res.status(400).json({ message: "Verification code has expired" });

        user.isVerified = true;
        user.signupCode = undefined;
        user.signupCodeExpiry = undefined;
        await user.save();

        res.json({ message: "Account verified successfully!" });
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

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "mySecretKey", { expiresIn: "1d" });

        res.json({ message: "Login successful", token, role: user.role });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// FORGOT PASSWORD - Send reset code
app.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        // Generate 6-digit code
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        const resetCodeExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        // Save code to user
        user.resetCode = resetCode;
        user.resetCodeExpiry = resetCodeExpiry;
        await user.save();

        // Configure Nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Email content
        const mailOptions = {
            from: `"ACSP Team" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "ACSP - Password Reset Code",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #f98c06; text-align: center;">ACSP Password Reset</h2>
                    <p>Hello ${user.name},</p>
                    <p>We received a request to reset your password. Here is your 6-digit verification code:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333; background: #f4f4f4; padding: 10px 20px; border-radius: 5px;">${resetCode}</span>
                    </div>
                    <p style="color: #555; font-size: 14px;">This code will expire in 15 minutes.</p>
                    <p style="color: #555; font-size: 14px;">If you didn't request this password reset, please ignore this email or contact support if you have concerns.</p>
                    <br>
                    <p>Best regards,<br>The ACSP Team</p>
                </div>
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);
        console.log(`Reset email sent successfully to ${email}`);

        res.json({ message: "Reset code sent to your email" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// VERIFY RESET CODE
app.post("/verify-reset-code", async (req, res) => {
    try {
        const { email, code } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        if (!user.resetCode || user.resetCode !== code) {
            return res.status(400).json({ message: "Invalid reset code" });
        }

        if (user.resetCodeExpiry < new Date()) {
            return res.status(400).json({ message: "Reset code has expired" });
        }

        // Generate temporary reset token
        const resetToken = jwt.sign({ id: user._id, purpose: "password_reset" }, "mySecretKey", { expiresIn: "15m" });

        res.json({ message: "Code verified", resetToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// RESET PASSWORD
app.post("/reset-password", async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;

        // Verify reset token
        const decoded = jwt.verify(resetToken, "mySecretKey");
        if (decoded.purpose !== "password_reset") {
            return res.status(400).json({ message: "Invalid reset token" });
        }

        const user = await User.findById(decoded.id);
        if (!user) return res.status(400).json({ message: "User not found" });

        // Validate password strength
        if (newPassword.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long" });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password and clear reset fields
        user.password = hashedPassword;
        user.resetCode = undefined;
        user.resetCodeExpiry = undefined;
        await user.save();

        res.json({ message: "Password reset successful" });
    } catch (error) {
        console.error(error);
        if (error.name === "JsonWebTokenError") {
            return res.status(400).json({ message: "Invalid reset token" });
        }
        res.status(500).json({ message: "Server error" });
    }
});

// 7️⃣ Cloudinary Storage setup for photo uploads
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'acsp_uploads',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
    },
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});



// 8️⃣ Rescue Report Route
app.post('/report', upload.array('photos', 5), async (req, res) => {
    try {
        let photoPaths = [];
        if (req.files && req.files.length > 0) {
            photoPaths = req.files.map(file => file.path); // Cloudinary returns the URL in file.path
        }


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
        let photoPaths = [];
        if (req.files && req.files.length > 0) {
            photoPaths = req.files.map(file => file.path);
        }


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

// Admin Delete Routes
app.delete('/reports/:id', async (req, res) => {
    try {
        await RescueReport.findByIdAndDelete(req.params.id);
        res.json({ message: "Report deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error deleting report" });
    }
});

app.delete('/adoptions/:id', async (req, res) => {
    try {
        await Adoption.findByIdAndDelete(req.params.id);
        res.json({ message: "Adoption post deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error deleting adoption post" });
    }
});

// Admin NGO Routes
app.get('/admin/ngos', async (req, res) => {
    try {
        const ngos = await User.find({ role: 'ngo' });
        res.json({ ngos });
    } catch (error) {
        res.status(500).json({ message: "Server error fetching NGOs" });
    }
});

app.put('/admin/ngos/:id/status', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { ngoStatus: req.body.status }, { new: true });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error updating NGO status" });
    }
});

// Admin NGO Profile Approval Routes
app.get('/admin/ngo-requests', async (req, res) => {
    try {
        const ngos = await NGO.find({ status: 'pending' }).sort({ createdAt: -1 });
        res.json({ ngos });
    } catch (error) {
        res.status(500).json({ message: "Server error fetching NGO requests" });
    }
});

app.put('/admin/ngo-requests/:id/approve', async (req, res) => {
    try {
        const ngo = await NGO.findByIdAndUpdate(req.params.id, { status: 'active' }, { new: true });
        res.json({ message: "NGO Approved successfully", ngo });
    } catch (error) {
        res.status(500).json({ message: "Error approving NGO" });
    }
});

app.delete('/admin/ngo-requests/:id/reject', async (req, res) => {
    try {
        await NGO.findByIdAndDelete(req.params.id);
        res.json({ message: "NGO Request rejected and deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error rejecting NGO" });
    }
});

// 9️⃣ SSL COMMERZ INTEGRATION
const store_id = process.env.SSLCOMMERZ_STORE_ID || "fluff69d2431081877";
const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD || "fluff69d2431081877@ssl";
const is_live = false;

app.post("/api/donate/init", async (req, res) => {
    const { amount, donorName, phone, location, cause } = req.body;
    const tran_id = "REF" + Date.now();

    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.headers['host'];
    const baseUrl = `${protocol}://${host}`;

    const data = {
        total_amount: amount || 2000,
        currency: "BDT",
        tran_id: tran_id, // unique for each payment

        success_url: `${baseUrl}/api/donate/success`,
        fail_url: `${baseUrl}/api/donate/fail`,
        cancel_url: `${baseUrl}/api/donate/cancel`,
        ipn_url: `${baseUrl}/api/donate/ipn`,

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
            res.redirect("/success.html");
        } else {
            await Donation.findOneAndUpdate({ transactionId: req.body.tran_id }, { status: 'FAILED' });
            res.redirect("/fail.html");
        }
    } catch (e) {
        res.redirect("/fail.html");
    }
});

app.post("/api/donate/fail", async (req, res) => {
    await Donation.findOneAndUpdate({ transactionId: req.body.tran_id }, { status: 'FAILED' });
    res.redirect("/fail.html");
});

app.post("/api/donate/cancel", async (req, res) => {
    await Donation.findOneAndUpdate({ transactionId: req.body.tran_id }, { status: 'CANCELLED' });
    res.redirect("/cancel.html");
});

// Groq AI Setup
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const SYSTEM_PROMPT = "You are the ACSP AI Assistant, a helpful expert in animal care. You can answer basic questions about pet nutrition, grooming, and common minor symptoms. However, for any complex medical problems, emergencies, or serious symptoms (like severe bleeding, breathing difficulties, or sudden collapse), you MUST advise the user to consult a professional veterinarian or visit the nearest animal clinic immediately. Be concise and friendly.";

// AI Chat Route
app.post("/api/ai-chat", async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ message: "Message is required" });

        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "user", content: message }
                ],
                temperature: 0.7,
                max_tokens: 1024
            },
            {
                headers: {
                    "Authorization": `Bearer ${GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const reply = response.data.choices[0].message.content;
        res.json({ reply });
    } catch (error) {
        console.error("Groq Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ 
            message: "AI Assistant is currently unavailable",
            error: error.response ? error.response.data.error.message : error.message 
        });
    }
});

// NGO Management Routes
app.post('/api/ngo', upload.array('gallery', 10), async (req, res) => {
    try {
        let galleryPaths = [];
        if (req.files && req.files.length > 0) {
            galleryPaths = req.files.map(file => file.path);
        }


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
        const ngos = await NGO.find({ status: 'active' }).sort({ name: 1 });
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

// 11. Rescued Animal Management
app.post('/api/rescued-animals', upload.array('photos', 5), async (req, res) => {
    try {
        let photoPaths = [];
        if (req.files && req.files.length > 0) {
            photoPaths = req.files.map(file => file.path);
        }

        const newAnimal = new RescuedAnimal({
            ...req.body,
            photos: photoPaths
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

app.get('/api/rescued-animals/ngo/:ngoId', async (req, res) => {
    try {
        const animals = await RescuedAnimal.find({ assignedNGO: req.params.ngoId }).sort({ rescueDate: -1 });
        res.json(animals);
    } catch (error) {
        res.status(500).json({ message: "Server error while fetching NGO animals" });
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

// 12. Volunteer Coordination Routes
app.get('/api/volunteers', async (req, res) => {
    try {
        const volunteers = await Volunteer.find().sort({ createdAt: -1 });
        res.json(volunteers);
    } catch (error) {
        res.status(500).json({ message: "Server error while fetching volunteers" });
    }
});

app.post('/api/volunteers', async (req, res) => {
    try {
        const newVolunteer = new Volunteer(req.body);
        await newVolunteer.save();
        res.status(201).json({ message: "Volunteer registered successfully!", volunteer: newVolunteer });
    } catch (error) {
        res.status(500).json({ message: "Server error while registering volunteer" });
    }
});

app.get('/api/volunteer-opportunities', async (req, res) => {
    try {
        const opportunities = await VolunteerOpportunity.find().sort({ createdAt: -1 });
        res.json(opportunities);
    } catch (error) {
        res.status(500).json({ message: "Server error while fetching opportunities" });
    }
});

app.post('/api/volunteer-opportunities', async (req, res) => {
    try {
        const newOpportunity = new VolunteerOpportunity(req.body);
        await newOpportunity.save();
        res.status(201).json({ message: "Opportunity added successfully!", opportunity: newOpportunity });
    } catch (error) {
        res.status(500).json({ message: "Server error while adding opportunity" });
    }
});

app.get('/api/volunteers/summary', async (req, res) => {
    try {
        const total = await Volunteer.countDocuments();
        const active = await Volunteer.countDocuments({ status: "Active" });
        const onboarding = await Volunteer.countDocuments({ status: "On-boarding" });
        const ngoCount = await VolunteerOpportunity.distinct("ngoName");

        res.json({
            totalRegistered: total,
            activeMonthly: active,
            newOnboarding: onboarding,
            ngosWithOpenRoles: ngoCount.length
        });
    } catch (error) {
        res.status(500).json({ message: "Server error while fetching volunteer summary" });
    }
});

// 13. Veterinary Directory Routes

// Submit Vet Application (Public)
app.post('/api/vets', upload.single('photo'), async (req, res) => {
    try {
        const { email } = req.body;
        
        // Check for existing application
        const existingVet = await Vet.findOne({ email });
        if (existingVet) {
            return res.status(400).json({ message: "An application with this email already exists." });
        }

        const vetData = req.body;
        
        // Handle photo storage with Cloudinary
        if (req.file) {
            vetData.photo = req.file.path;
        }
        
        if (typeof vetData.specialization === 'string') {
            vetData.specialization = [vetData.specialization];
        }

        const newVet = new Vet(vetData);
        await newVet.save();
        res.status(201).json({ message: "Application submitted successfully!", vet: newVet });
    } catch (error) {
        console.error('Vet submission error:', error);
        res.status(500).json({ message: "Server error while submitting application" });
    }
});

// Adoption Posting
app.post('/api/adoptions', upload.single('photo'), async (req, res) => {
    try {
        const adoptionData = req.body;
        if (req.file) {
            adoptionData.photos = [req.file.path];
        }

        const newAdoption = new Adoption(adoptionData);
        await newAdoption.save();
        res.status(201).json({ message: "Adoption post created successfully!", adoption: newAdoption });
    } catch (error) {
        console.error("Adoption error:", error);
        res.status(500).json({ message: "Server error while creating adoption post" });
    }
});


// Get Approved Vets (Public Directory)

app.get('/api/vets', async (req, res) => {
    try {
        const vets = await Vet.find({ status: 'approved' }).sort({ createdAt: -1 });
        res.json(vets);
    } catch (error) {
        res.status(500).json({ message: "Error fetching veterinarians" });
    }
});

// Admin: Get All Vets (for Dashboard)
app.get('/admin/vets', async (req, res) => {
    try {
        const vets = await Vet.find().sort({ createdAt: -1 });
        res.json(vets);
    } catch (error) {
        res.status(500).json({ message: "Error fetching vets for admin" });
    }
});

// Admin: Update Vet Status (Approve/Reject)
app.put('/admin/vets/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const vet = await Vet.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!vet) return res.status(404).json({ message: "Vet not found" });
        res.json({ message: `Vet status updated to ${status}`, vet });
    } catch (error) {
        res.status(500).json({ message: "Error updating vet status" });
    }
});

// Start server
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;