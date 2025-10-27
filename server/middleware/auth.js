const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // CRITICAL: Check if token is still in the user's activeSessions array
        // This query finds the user AND checks that the token is in the sub-document array.
        const user = await User.findOne({ 
            _id: decoded.id, 
            'activeSessions.token': token 
        }).select('-password'); // Exclude password

        if (!user) {
            return res.status(401).json({ message: 'Token is not valid (session may have been logged out)' });
        }
        
        req.user = user; // Attach the user object (without password)
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};