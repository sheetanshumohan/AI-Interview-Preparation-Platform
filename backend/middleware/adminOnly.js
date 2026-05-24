const User = require('../models/User');

const adminOnly = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        
        if (!user || !user.isAdmin) {
            return res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
        }
        
        next();
    } catch (error) {
        console.error('Error in adminOnly middleware:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = adminOnly;
