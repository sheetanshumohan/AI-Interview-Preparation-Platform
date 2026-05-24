const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { signup, login, logout, checkAuth } = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.get('/check-auth', verifyToken, checkAuth);
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', (req, res, next) => {
    passport.authenticate('google', { session: false }, (err, user, info) => {
        if (err) return res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
        if (!user && info?.message === 'needs_registration') {
            return res.redirect(`${process.env.CLIENT_URL}/register?error=needs_registration`);
        }
        if (!user) return res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);

        // Success - Generate JWT
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        const redirectUrl = user.isAdmin 
            ? `${process.env.CLIENT_URL}/admin?token=${token}` 
            : `${process.env.CLIENT_URL}/dashboard?token=${token}`;
        res.redirect(redirectUrl);
    })(req, res, next);
});

// GitHub OAuth
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', (req, res, next) => {
    passport.authenticate('github', { session: false }, (err, user, info) => {
        if (err) return res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
        if (!user && info?.message === 'needs_registration') {
            return res.redirect(`${process.env.CLIENT_URL}/register?error=needs_registration`);
        }
        if (!user) return res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        const redirectUrl = user.isAdmin 
            ? `${process.env.CLIENT_URL}/admin?token=${token}` 
            : `${process.env.CLIENT_URL}/dashboard?token=${token}`;
        res.redirect(redirectUrl);
    })(req, res, next);
});

module.exports = router;
