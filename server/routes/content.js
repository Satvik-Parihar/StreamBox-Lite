const router = require('express').Router();
const auth = require('../middleware/auth'); // Your new middleware
const Show = require('../models/Show');

// Get all shows (Protected Route)
router.get('/shows', auth, async (req, res) => {
    // const shows = await Show.find(); // In real app, you'd have data
    const shows = [ // Using dummy data for speed
         {_id: 1, title: 'Show 1', duration: '50 min'},
         {_id: 2, title: 'Show 2', duration: '42 min'}
    ];
    res.json(shows);
});

// "Play" a show (Protected Route with Plan Logic)
router.get('/play/:id', auth, (req, res) => {
    const { quality } = req.query; // e.g., ?quality=HD
    const userPlan = req.user.plan; // We get this from the auth middleware

    if (quality === 'HD' && userPlan === 'FREE') {
        return res.status(403).json({ message: 'Upgrade to watch in HD.' });
    }
    res.json({ message: `Playing show ${req.params.id} in ${quality || 'SD'}` });
});

// "Download" a show (Protected Route with Plan Logic)
router.get('/download/:id', auth, (req, res) => {
    if (req.user.plan !== 'PREMIUM') {
        return res.status(403).json({ message: 'Upgrade to Premium to download.' });
    }
    res.json({ message: `Downloading show ${req.params.id}` });
});

module.exports = router;