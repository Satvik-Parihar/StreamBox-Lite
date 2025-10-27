module.exports = function(req, res, next) {
    // This middleware must run AFTER the auth middleware
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
};