const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// This schema is embedded inside the User
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

// Hash password before saving
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('User', UserSchema);