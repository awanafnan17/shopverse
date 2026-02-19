const Product = require('../models/Product');
const Category = require('../models/Category');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const mongoose = require('mongoose');

// Multer config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
    filename: (req, file, cb) => cb(null, `${uuidv4()}${path.extname(file.originalname)}`),
});
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|webp|gif/;
        const ext = allowed.test(path.extname(file.originalname).toLowerCase());
        const mime = allowed.test(file.mimetype);
        cb(ext && mime ? null : new Error('Only images allowed'), ext && mime);
    },
});

exports.uploadImages = upload.array('images', 5);

// GET /api/products
exports.getProducts = async (req, res, next) => {
    try {
        const { page = 1, limit = 12, sort = '-createdAt', category, search, minPrice, maxPrice, featured } = req.query;
        const query = {};

        if (category) {
            // Support both ObjectId and slug
            if (mongoose.Types.ObjectId.isValid(category)) {
                query.category = category;
            } else {
                // It's a slug — look up the category
                const cat = await Category.findOne({ slug: category });
                if (cat) {
                    query.category = cat._id;
                } else {
                    // No match — return empty results
                    return res.json({ products: [], page: 1, pages: 0, total: 0 });
                }
            }
        }
        if (featured === 'true') query.featured = true;
        if (search) query.$text = { $search: search };
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        const products = await Product.find(query)
            .populate('category', 'name slug')
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Product.countDocuments(query);

        res.json({
            products,
            page: Number(page),
            pages: Math.ceil(total / limit),
            total,
        });
    } catch (err) { next(err); }
};

// GET /api/products/:id
exports.getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).populate('category', 'name slug');
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) { next(err); }
};

// POST /api/products (admin)
exports.createProduct = async (req, res, next) => {
    try {
        const { name, description, price, category, stock, featured } = req.body;
        const images = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];
        const product = await Product.create({ name, description, price, category, stock, images, featured });
        res.status(201).json(product);
    } catch (err) { next(err); }
};

// PUT /api/products/:id (admin)
exports.updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        Object.assign(product, req.body);
        if (req.files && req.files.length > 0) {
            product.images = req.files.map(f => `/uploads/${f.filename}`);
        }
        await product.save();
        res.json(product);
    } catch (err) { next(err); }
};

// DELETE /api/products/:id (admin)
exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted' });
    } catch (err) { next(err); }
};
