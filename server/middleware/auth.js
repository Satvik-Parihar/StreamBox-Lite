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
        const user = await User.findOne({ 
            _id: decoded.id, 
            'activeSessions.token': token 
        }).select('-password'); // Exclude password

        if (!user) {
            // This is the 401 error: The token is valid, but not in the active session list
            return res.status(401).json({ message: 'Token is not valid (session may have been logged out)' });
        }
        
        req.user = user; // Attach the user object (without password)
        next();
    } catch (err) {
        // This fails if the token is expired or secret is wrong
        res.status(401).json({ message: 'Token is not valid' });
    }
};