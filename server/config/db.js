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
        console.log('⚠️  No MONGO_URI found. Starting in-memory MongoDB for development...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        await mongoose.connect(uri);
        console.log(`✅ In-Memory MongoDB running at: ${uri}`);
        console.log('   ⚡ Data will be lost when the server stops.');
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err.message);
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
    }
};

module.exports = connectDB;
