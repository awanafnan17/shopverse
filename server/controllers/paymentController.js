// Safe Stripe Init
let stripe;
if (process.env.STRIPE_SECRET_KEY) {
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
} else {
    console.warn('⚠️ STRIPE_SECRET_KEY is missing. Payments will fail.');
}

const Order = require('../models/Order');
const Payment = require('../models/Payment');

// POST /api/payments/stripe — Create payment intent
exports.createStripeIntent = async (req, res, next) => {
    try {
        if (!stripe) {
            return res.status(500).json({ message: 'Payment system not configured (Missing Stripe Key)' });
        }

        const { amount, orderId } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // cents
            currency: 'usd',
            metadata: { orderId },
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        });
    } catch (err) { next(err); }
};

// POST /api/payments/stripe/confirm
exports.confirmStripePayment = async (req, res, next) => {
    try {
        const { paymentIntentId, orderId } = req.body;

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        order.paymentStatus = 'paid';
        order.stripePaymentIntentId = paymentIntentId;
        await order.save();

        await Payment.findOneAndUpdate(
            { order: orderId },
            { status: 'completed', transactionId: paymentIntentId },
        );

        res.json({ message: 'Payment confirmed', order });
    } catch (err) { next(err); }
};

// POST /api/payments/cod
exports.processCod = async (req, res, next) => {
    try {
        const { orderId } = req.body;
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        // COD stays pending until delivered
        res.json({ message: 'COD order confirmed. Pay on delivery.', order });
    } catch (err) { next(err); }
};
