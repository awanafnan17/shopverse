const router = require('express').Router();
const { createReview, getProductReviews, deleteReview } = require('../controllers/reviewController');
const { verifyToken } = require('../middleware/auth');

router.post('/', verifyToken, createReview);
router.get('/:productId', getProductReviews);
router.delete('/:id', verifyToken, deleteReview);

module.exports = router;
