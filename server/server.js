require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ——— Security ———
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' }, contentSecurityPolicy: false }));
app.use(cors({
    origin: true,
    credentials: true,
}));
// ——— Health Check ———
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/debug', async (req, res) => {
    const mongoose = require('mongoose');
    try {
        // Attempt connection manually if not connected
        if (mongoose.connection.readyState === 0) {
            await connectDB();
        }
        res.json({
            status: 'ok',
            env: {
                mongo_uri_set: !!process.env.MONGO_URI,
                node_env: process.env.NODE_ENV
            },
            db_state: mongoose.connection.readyState, // 1 = connected
            host: mongoose.connection.host
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            error: err.message,
            stack: err.stack,
            mongo_uri_set: !!process.env.MONGO_URI
        });
    }
});

// ——— Serverless DB Connection ———
app.use(async (req, res, next) => {
    // 0 = disconnected, 1 = connected, 2 = connecting
    if (require('mongoose').connection.readyState === 0) {
        await connectDB();
    }
    next();
});

// ——— Body Parsers ———
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ——— Static Files ———
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ——— API Routes ———
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/admin', require('./routes/admin'));

const fs = require('fs');

// ——— Serve Production Frontend ———
const clientDist = path.join(__dirname, '..', 'client', 'dist');

if (fs.existsSync(clientDist)) {
    app.use(express.static(clientDist));
    // SPA catch-all
    app.get(/^(?!\/api).*/, (req, res) => {
        res.sendFile(path.join(clientDist, 'index.html'));
    });
} else {
    console.log('⚠️ Static files skipped (client/dist not found)');
}

// ——— Error Handler ———
app.use(errorHandler);

// ——— Start Server ———
const PORT = process.env.PORT || 5000;

const autoSeed = async () => {
    const User = require('./models/User');
    const Category = require('./models/Category');
    const Product = require('./models/Product');

    const userCount = await User.countDocuments();
    if (userCount > 0) return; // Already seeded

    console.log('🌱 Auto-seeding database...');

    await User.create({ name: 'Admin User', email: 'admin@shopverse.com', password: 'admin123', role: 'admin' });
    await User.create({ name: 'Test User', email: 'user@shopverse.com', password: 'user123', role: 'user' });

    const cats = await Category.insertMany([
        { name: 'Electronics', description: 'Gadgets, phones, and tech accessories' },
        { name: 'Clothing', description: 'Fashion apparel for men and women' },
        { name: 'Home & Kitchen', description: 'Essentials for your home' },
        { name: 'Books', description: 'Best-selling books and literature' },
        { name: 'Sports', description: 'Sports gear and fitness equipment' },
    ]);

    await Product.insertMany([
        { name: 'Wireless Bluetooth Headphones', description: 'Premium noise-cancelling wireless headphones with 30-hour battery life and deep bass.', price: 79.99, category: cats[0]._id, stock: 50, ratings: 4.5, numReviews: 128, featured: true },
        { name: 'Smart Watch Pro', description: 'Advanced smart watch with heart rate monitoring, GPS tracking, sleep analysis, and 7-day battery life.', price: 199.99, category: cats[0]._id, stock: 30, ratings: 4.3, numReviews: 89, featured: true },
        { name: 'USB-C Fast Charger 65W', description: 'Universal 65W GaN charger with USB-C and USB-A ports. Compatible with laptops, phones, and tablets.', price: 34.99, category: cats[0]._id, stock: 100, ratings: 4.7, numReviews: 256 },
        { name: 'Mechanical Gaming Keyboard', description: 'RGB mechanical keyboard with Cherry MX switches, per-key lighting, and programmable macros.', price: 129.99, category: cats[0]._id, stock: 25, ratings: 4.6, numReviews: 67, featured: true },
        { name: 'Classic Denim Jacket', description: 'Timeless denim jacket made from premium cotton with a comfortable fit.', price: 89.99, category: cats[1]._id, stock: 40, ratings: 4.2, numReviews: 34 },
        { name: 'Running Performance Sneakers', description: 'Lightweight running shoes with responsive cushioning and breathable mesh upper.', price: 119.99, category: cats[1]._id, stock: 60, ratings: 4.4, numReviews: 92, featured: true },
        { name: 'Stainless Steel Water Bottle', description: 'Double-wall insulated bottle - cold for 24hrs, hot for 12hrs. BPA-free, 750ml.', price: 24.99, category: cats[2]._id, stock: 200, ratings: 4.8, numReviews: 312 },
        { name: 'Non-Stick Cookware Set', description: '10-piece ceramic non-stick cookware set with pots, pans, and lids. Dishwasher safe.', price: 149.99, category: cats[2]._id, stock: 15, ratings: 4.1, numReviews: 45, featured: true },
        { name: 'The Art of Programming', description: 'Guide to modern software development, clean code, and system design patterns.', price: 39.99, category: cats[3]._id, stock: 75, ratings: 4.9, numReviews: 421, featured: true },
        { name: 'Yoga Mat Premium', description: 'Extra-thick 6mm yoga mat with non-slip surface and alignment guides. Eco-friendly TPE.', price: 45.99, category: cats[4]._id, stock: 80, ratings: 4.5, numReviews: 156 },
    ]);

    console.log('✅ Seeded: 2 users, 5 categories, 10 products');
    console.log('   Admin: admin@shopverse.com / admin123');
    console.log('   User:  user@shopverse.com / user123');
};

const startServer = async () => {
    try {
        await connectDB();
        await autoSeed();
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Failed to connect to DB:', err);
        process.exit(1);
    }
};

// Only start server if not in test/production (Vercel)
if (require.main === module) {
    startServer();
}
// For Vercel, we rely on the middleware to connect

module.exports = app;
