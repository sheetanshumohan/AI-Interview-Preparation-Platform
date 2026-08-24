const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./db/connectDB');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const aiRoutes = require('./routes/aiRoutes');
const adminRoutes = require('./routes/adminRoutes');
const passport = require('passport');
require('./config/passport');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Dynamic CORS configuration for local and production deployment
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            callback(null, true);
        }
    },
    credentials: true
}));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
    res.send('PrepAI API is running...');
});

// Always bind to process.env.PORT for Render / production web services
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
