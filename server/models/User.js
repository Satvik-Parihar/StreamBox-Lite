const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
    token: { type: String, required: true },
    loggedInAt: { type: Date, default: Date.now }
});

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    plan: {
        type: String,
        enum: ['FREE', 'STANDARD', 'PREMIUM'],
        default: 'FREE'
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    activeSessions: [SessionSchema]
});

// We'll add password hashing here later

module.exports = mongoose.model('User', UserSchema);