const Category = require('../models/Category');

// GET /api/categories
exports.getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find().sort('name');
        res.json(categories);
    } catch (err) { next(err); }
};

// GET /api/categories/:id
exports.getCategory = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.json(category);
    } catch (err) { next(err); }
};

// POST /api/categories (admin)
exports.createCategory = async (req, res, next) => {
    try {
        const category = await Category.create(req.body);
        res.status(201).json(category);
    } catch (err) { next(err); }
};

// PUT /api/categories/:id (admin)
exports.updateCategory = async (req, res, next) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.json(category);
    } catch (err) { next(err); }
};

// DELETE /api/categories/:id (admin)
exports.deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.json({ message: 'Category deleted' });
    } catch (err) { next(err); }
};
