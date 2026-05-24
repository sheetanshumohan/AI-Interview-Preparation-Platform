const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.BACKEND_URL 
        ? `${process.env.BACKEND_URL}/api/auth/google/callback` 
        : "http://localhost:5000/api/auth/google/callback",
    scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value;
        let user = await User.findOne({ email });

        if (user) {
            // If user exists, link the googleId if it's not already linked
            if (!user.googleId) {
                user.googleId = profile.id;
                user.avatar = profile.photos[0].value;
                await user.save();
            }
            return done(null, user);
        } else {
            // New user trying to login via social - as per request, they MUST register manually first
            // to ensure role/experience is captured.
            return done(null, false, { message: 'needs_registration' });
        }
    } catch (error) {
        return done(error, null);
    }
}));

// Serialize/Deserialize not needed for JWT-only flow but required by passport
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
