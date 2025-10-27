const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function(req, res, next) {
    // 1. Get token from header
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // 2. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. CRITICAL: Check if token is still in the user's activeSessions
        const user = await User.findOne({ _id: decoded.id, 'activeSessions.token': token });
        if (!user) {
            return res.status(401).json({ message: 'Token is not valid (session may have been logged out)' });
        }

        // 4. Attach user to request and continue
        req.user = user; 
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};