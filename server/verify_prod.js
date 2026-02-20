require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const verify = async () => {
    try {
        console.log('Connecting to:', process.env.MONGO_URI.split('@')[1]); // Hide password
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected! DB Name:', mongoose.connection.name);

        const count = await User.countDocuments();
        console.log('User count:', count);

        const admin = await User.findOne({ email: 'admin@shopverse.com' });
        if (admin) {
            console.log('✅ Admin found:', admin.email, '| Role:', admin.role);
            console.log('   Password Hashed:', admin.password.substring(0, 10) + '...');
        } else {
            console.error('❌ Admin user NOT found!');
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

verify();
