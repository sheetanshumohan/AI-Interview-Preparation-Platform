const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'prepai_jwt_secret_fallback_key_2026';

const verifyToken = (req, res, next) => {
    let token = req.cookies.token;
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized - no token provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ success: false, message: 'Unauthorized - invalid token' });
        }
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.error("Error in verifyToken:", error);
        return res.status(401).json({ success: false, message: 'Unauthorized - token invalid or expired' });
    }
};

module.exports = verifyToken;
