const Review = require('../models/Review');
const Product = require('../models/Product');

// POST /api/reviews
exports.createReview = async (req, res, next) => {
    try {
        const { productId, rating, comment } = req.body;

        const existing = await Review.findOne({ product: productId, user: req.user.id });
        if (existing) return res.status(400).json({ message: 'You have already reviewed this product' });

        const review = await Review.create({ product: productId, user: req.user.id, rating, comment });
        await recalcRatings(productId);

        const populated = await Review.findById(review._id).populate('user', 'name');
        res.status(201).json(populated);
    } catch (err) { next(err); }
};

// GET /api/reviews/:productId
exports.getProductReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find({ product: req.params.productId })
            .populate('user', 'name')
            .sort('-createdAt');
        res.json(reviews);
    } catch (err) { next(err); }
};

// DELETE /api/reviews/:id
exports.deleteReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ message: 'Review not found' });

        if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const productId = review.product;
        await review.deleteOne();
        await recalcRatings(productId);

        res.json({ message: 'Review deleted' });
    } catch (err) { next(err); }
};

async function recalcRatings(productId) {
    const reviews = await Review.find({ product: productId });
    const numReviews = reviews.length;
    const ratings = numReviews > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / numReviews
        : 0;
    await Product.findByIdAndUpdate(productId, { ratings, numReviews });
}
