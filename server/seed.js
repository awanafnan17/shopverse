require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');

const connectAndSeed = async () => {
    try {
        // Try local MongoDB first, fall back to in-memory
        try {
            await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 3000 });
        } catch {
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongod = await MongoMemoryServer.create();
            await mongoose.connect(mongod.getUri());
        }

        console.log('🗑️  Clearing existing data...');
        await Promise.all([User.deleteMany(), Category.deleteMany(), Product.deleteMany()]);

        console.log('👤 Creating users...');
        const admin = await User.create({ name: 'Admin User', email: 'admin@shopverse.com', password: 'admin123', role: 'admin' });
        const user = await User.create({ name: 'Test User', email: 'user@shopverse.com', password: 'user123', role: 'user' });

        console.log('📁 Creating categories...');
        const cats = await Category.insertMany([
            { name: 'Electronics', description: 'Gadgets, phones, and tech accessories' },
            { name: 'Clothing', description: 'Fashion apparel for men and women' },
            { name: 'Home & Kitchen', description: 'Essentials for your home' },
            { name: 'Books', description: 'Best-selling books and literature' },
            { name: 'Sports', description: 'Sports gear and fitness equipment' },
        ]);

        console.log('📦 Creating products...');
        await Product.insertMany([
            { name: 'Wireless Bluetooth Headphones', description: 'Premium noise-cancelling wireless headphones with 30-hour battery life and deep bass. Perfect for music lovers and professionals.', price: 79.99, category: cats[0]._id, stock: 50, ratings: 4.5, numReviews: 128, featured: true, images: [] },
            { name: 'Smart Watch Pro', description: 'Advanced smart watch with heart rate monitoring, GPS tracking, sleep analysis, and 7-day battery life. Water-resistant up to 50m.', price: 199.99, category: cats[0]._id, stock: 30, ratings: 4.3, numReviews: 89, featured: true, images: [] },
            { name: 'USB-C Fast Charger 65W', description: 'Universal 65W GaN charger with USB-C and USB-A ports. Compatible with laptops, phones, and tablets.', price: 34.99, category: cats[0]._id, stock: 100, ratings: 4.7, numReviews: 256, featured: false, images: [] },
            { name: 'Mechanical Gaming Keyboard', description: 'RGB mechanical keyboard with Cherry MX switches, per-key lighting, and programmable macros for competitive gaming.', price: 129.99, category: cats[0]._id, stock: 25, ratings: 4.6, numReviews: 67, featured: true, images: [] },
            { name: 'Classic Denim Jacket', description: 'Timeless denim jacket made from premium cotton with a comfortable fit. Available in multiple washes.', price: 89.99, category: cats[1]._id, stock: 40, ratings: 4.2, numReviews: 34, featured: false, images: [] },
            { name: 'Running Performance Sneakers', description: 'Lightweight running shoes with responsive cushioning, breathable mesh upper, and durable rubber outsole.', price: 119.99, category: cats[1]._id, stock: 60, ratings: 4.4, numReviews: 92, featured: true, images: [] },
            { name: 'Stainless Steel Water Bottle', description: 'Double-wall insulated water bottle that keeps drinks cold for 24 hours and hot for 12 hours. BPA-free, 750ml.', price: 24.99, category: cats[2]._id, stock: 200, ratings: 4.8, numReviews: 312, featured: false, images: [] },
            { name: 'Non-Stick Cookware Set', description: '10-piece ceramic non-stick cookware set including pots, pans, and lids. Dishwasher safe with cool-touch handles.', price: 149.99, category: cats[2]._id, stock: 15, ratings: 4.1, numReviews: 45, featured: true, images: [] },
            { name: 'The Art of Programming', description: 'Comprehensive guide to modern software development practices, clean code principles, and system design patterns.', price: 39.99, category: cats[3]._id, stock: 75, ratings: 4.9, numReviews: 421, featured: true, images: [] },
            { name: 'Yoga Mat Premium', description: 'Extra-thick 6mm yoga mat with non-slip surface and alignment guides. Eco-friendly TPE material.', price: 45.99, category: cats[4]._id, stock: 80, ratings: 4.5, numReviews: 156, featured: false, images: [] },
        ]);

        console.log('\n✅ Database seeded successfully!');
        console.log('   Admin: admin@shopverse.com / admin123');
        console.log('   User:  user@shopverse.com / user123');
        console.log(`   Categories: ${cats.length}`);
        console.log('   Products: 10\n');

        process.exit(0);
    } catch (err) {
        console.error('❌ Seed error:', err);
        process.exit(1);
    }
};

connectAndSeed();
