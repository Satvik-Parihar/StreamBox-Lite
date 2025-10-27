const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs'); // You would use this in a real app

const PLAN_LIMITS = { 'FREE': 1, 'STANDARD': 2, 'PREMIUM': 3 };

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // 1. Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 2. TODO: Check password with bcrypt
        // if (password !== user.password) { ... }

        // 3. Check Session Limit (THE CORE LOGIC)
        const maxSessions = PLAN_LIMITS[user.plan];
        if (user.activeSessions.length >= maxSessions) {
            return res.status(403).json({ message: "Maximum session limit reached." });
        }

        // 4. Create token and add to sessions
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
        user.activeSessions.push({ token });
        await user.save();

        // 5. Send response
        res.json({ token, user: { email: user.email, plan: user.plan, role: user.role } });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// TODO: Add a '/logout' route here

module.exports = router;