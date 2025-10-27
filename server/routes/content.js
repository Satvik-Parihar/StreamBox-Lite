const router = require('express').Router();
const auth = require('../middleware/auth');
const Show = require('../models/Show');

// @route   GET /api/content/shows
// @desc    Get all shows (Protected)
router.get('/shows', auth, async (req, res) => {
    try {
        const shows = await Show.find();
        res.json(shows);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/content/play/:id
// @desc    "Play" a show (Protected + Plan Logic)
router.get('/play/:id', auth, async (req, res) => {
    try {
        const { quality } = req.query; // ?quality=HD
        const userPlan = req.user.plan;

        if (quality === 'HD' && userPlan === 'FREE') {
            return res.status(403).json({ message: 'Upgrade to watch in HD.' });
        }
        
        const show = await Show.findById(req.params.id);
        if (!show) return res.status(404).json({ message: 'Show not found' });
        
        const url = (quality === 'HD') ? show.hdUrl : show.sdUrl;
        res.json({ message: `Streaming from ${url}` });

    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/content/download/:id
// @desc    "Download" a show (Protected + Plan Logic)
router.get('/download/:id', auth, async (req, res) => {
    try {
        if (req.user.plan !== 'PREMIUM') {
            return res.status(403).json({ message: 'Upgrade to Premium to download.' });
        }

        const show = await Show.findById(req.params.id);
        if (!show) return res.status(404).json({ message: 'Show not found' });

        res.json({ downloadUrl: show.downloadUrl });

    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;