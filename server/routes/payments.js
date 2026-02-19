const router = require('express').Router();
const { createStripeIntent, confirmStripePayment, processCod } = require('../controllers/paymentController');
const { verifyToken } = require('../middleware/auth');

router.post('/stripe', verifyToken, createStripeIntent);
router.post('/stripe/confirm', verifyToken, confirmStripePayment);
router.post('/cod', verifyToken, processCod);

module.exports = router;
