const mongoose = require('mongoose');

const connectDB = async () => {
    // 0 = disconnected, 1 = connected, 2 = connecting
    if (mongoose.connection.readyState >= 1) {
        return;
    }

    try {
        if (!process.env.MONGO_URI && process.env.NODE_ENV === 'production') {
            throw new Error('MONGO_URI is required in production mode');
        }

        // Try the configured MONGO_URI
        if (process.env.MONGO_URI) {
            try {
                await mongoose.connect(process.env.MONGO_URI, {
                    serverSelectionTimeoutMS: 5000,
                });
                console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
                return;
            } catch (err) {
                if (process.env.NODE_ENV === 'production') throw err;
                console.warn(`⚠️  Failed to connect to MONGO_URI (${err.message}). Falling back to in-memory...`);
            }
        }

        // Fallback for development only
        console.warn('⚠️  No MONGO_URI found. Please set MONGO_URI in .env file.');
        console.warn('   In production, the app will crash without a DB connection.');
        console.warn('   In development, you can use a local MongoDB instance.');

        // Return to avoid crashing immediately in dev if just testing UI
        return;
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err.message);
        // Do NOT exit process in serverless environment, just throw
        if (process.env.NODE_ENV === 'production') {
            throw err;
        }
        process.exit(1);
    }
};

module.exports = connectDB;
