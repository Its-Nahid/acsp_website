const express = require('express');
const router = express.Router();

// Create NGO Profile
router.post('/create', (req, res) => {
    const ngo = req.body;

    if (!ngo.name || !ngo.email) {
        return res.status(400).json({ message: "Missing fields" });
    }

    res.status(201).json({
        message: "NGO Profile Created",
        data: ngo
    });
});

module.exports = router;