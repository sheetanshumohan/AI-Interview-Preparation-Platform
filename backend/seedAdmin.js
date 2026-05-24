const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const adminEmail = 'sheetanshumohan@gmail.com'; // Using your current gmail pattern
        const adminPassword = 'adminpassword123'; // Hardcoded as requested for local access

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminEmail });
        
        if (existingAdmin) {
            console.log('Admin already exists, updating to ensure isAdmin is true');
            existingAdmin.isAdmin = true;
            existingAdmin.isVerified = true;
            await existingAdmin.save();
        } else {
            console.log('Creating new Admin user...');
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            
            const admin = new User({
                name: 'System Administrator',
                email: adminEmail,
                password: hashedPassword,
                isAdmin: true,
                isVerified: true,
                role: 'Administrator',
                experience: 'Senior'
            });

            await admin.save();
            console.log('Admin user created successfully');
        }

        console.log('\n--- ADMIN CREDENTIALS ---');
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);
        console.log('-------------------------\n');

        mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
