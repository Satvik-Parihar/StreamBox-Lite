const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authMiddleware = require('../middleware/auth');

const PLAN_LIMITS = { 'FREE': 1, 'STANDARD': 2, 'PREMIUM': 3 };

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({
            email,
            password, // Will be hashed by the pre-save hook
        });

        await user.save();
        res.status(201).json({ message: 'User registered successfully' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST /api/auth/login
// @desc    Login user and enforce session limits
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const maxSessions = PLAN_LIMITS[user.plan];
        if (user.activeSessions.length >= maxSessions) {
            // Option 1: Reject login
            return res.status(403).json({ message: "Maximum session limit reached." });
            
            // Option 2: Evict oldest session (uncomment to use)
            // user.activeSessions.sort((a, b) => a.loggedInAt - b.loggedInAt);
            // user.activeSessions.shift();
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        user.activeSessions.push({ token });
        await user.save();

        res.json({
            token,
            user: {
                _id: user._id,
                email: user.email,
                plan: user.plan,
                role: user.role
            }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

// @route   GET /api/auth/me
// @desc    Get logged in user data (validates token)
router.get('/me', authMiddleware, async (req, res) => {
    try {
        // req.user is populated by auth middleware (without password)
        res.json(req.user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/auth/logout
// @desc    Log user out (removes one session)
router.post('/logout', authMiddleware, async (req, res) => {
    try {
        const token = req.header('x-auth-token');
        await User.updateOne(
            { _id: req.user._id },
            { $pull: { activeSessions: { token: token } } }
        );
        res.json({ message: 'Logged out successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;