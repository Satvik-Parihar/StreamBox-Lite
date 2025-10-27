const router = require('express').Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   PUT /api/user/me/plan
// @desc    Allow a logged-in user to change their own plan
router.put('/me/plan', auth, async (req, res) => {
    try {
        const { plan } = req.body;
        if (!['FREE', 'STANDARD', 'PREMIUM'].includes(plan)) {
            return res.status(400).json({ message: 'Invalid plan' });
        }

        // In a real app, you would process payment here (Stripe, etc.)
        // before updating the database.

        // req.user comes from the auth middleware
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: { plan: plan } },
            { new: true }
        ).select('-password -activeSessions');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Send back the updated user object
        res.json(user);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;