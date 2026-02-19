const Order = require('../models/Order');
const Product = require('../models/Product');
const Payment = require('../models/Payment');

// POST /api/orders
exports.createOrder = async (req, res, next) => {
    try {
        const { orderItems, shippingAddress, paymentMethod, taxPrice = 0, shippingPrice = 0 } = req.body;

        let totalPrice = 0;
        const populatedItems = [];

        for (const item of orderItems) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: `Product ${item.product} not found` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
            }

            product.stock -= item.quantity;
            await product.save();

            populatedItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                image: product.images?.[0] || '',
            });

            totalPrice += product.price * item.quantity;
        }

        totalPrice += taxPrice + shippingPrice;

        const order = await Order.create({
            user: req.user.id,
            orderItems: populatedItems,
            shippingAddress,
            paymentMethod,
            taxPrice,
            shippingPrice,
            totalPrice,
        });

        // Create payment record
        await Payment.create({
            order: order._id,
            amount: totalPrice,
            method: paymentMethod,
            status: 'pending',
        });

        res.status(201).json(order);
    } catch (err) {
        next(err);
    }
};

// GET /api/orders/me
exports.getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort('-createdAt');
        res.json(orders);
    } catch (err) { next(err); }
};

// GET /api/orders/:id
exports.getOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        // Check ownership or admin
        if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }
        res.json(order);
    } catch (err) { next(err); }
};

// PUT /api/orders/:id/status (admin)
exports.updateOrderStatus = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        order.orderStatus = req.body.status;
        if (req.body.status === 'delivered') {
            order.deliveredAt = new Date();
            if (order.paymentMethod === 'cod') {
                order.paymentStatus = 'paid';
            }
        }
        if (req.body.status === 'cancelled') {
            // Restore stock
            for (const item of order.orderItems) {
                await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
            }
        }
        await order.save();
        res.json(order);
    } catch (err) { next(err); }
};
