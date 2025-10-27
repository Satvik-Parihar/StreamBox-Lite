const router = require('express').Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const allMiddleware = [auth, admin]; // Chain middleware

// @route   GET /api/admin/users
// @desc    Get all users (Admin only)
router.get('/users', allMiddleware, async (req, res) => {
    try {
        const users = await User.find().select('-password -activeSessions');
        res.json(users);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/admin/users/:id/plan
// @desc    Change a user's plan (Admin only)
router.put('/users/:id/plan', allMiddleware, async (req, res) => {
    try {
        const { plan } = req.body;
        if (!['FREE', 'STANDARD', 'PREMIUM'].includes(plan)) {
            return res.status(400).json({ message: 'Invalid plan' });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: { plan: plan } },
            { new: true }
        ).select('-password');

        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);

    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/admin/users/:id/logout-all
// @desc    Force logout all sessions for a user (Admin only)
router.post('/users/:id/logout-all', allMiddleware, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: { activeSessions: [] } },
            { new: true }
        );

        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: `All sessions for ${user.email} have been logged out.` });
        
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;