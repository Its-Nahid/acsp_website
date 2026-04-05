const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
    donorName: {
        type: String,
        default: 'Anonymous'
    },
    email: {
        type: String,
        default: 'anonymous@example.com'
    },
    phone: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        default: ''
    },
    cause: {
        type: String,
        default: 'General Fund'
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'BDT'
    },
    transactionId: {
        type: String,
        required: true,
        unique: true
    },
    valId: {
        type: String
    },
    status: {
        type: String,
        enum: ['PENDING', 'VALID', 'FAILED', 'CANCELLED'],
        default: 'PENDING'
    },
    paymentMethod: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Donation', DonationSchema);
