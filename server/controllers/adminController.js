const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');

// GET /api/admin/stats
exports.getStats = async (req, res, next) => {
    try {
        const [totalUsers, totalProducts, totalOrders] = await Promise.all([
            User.countDocuments(),
            Product.countDocuments(),
            Order.countDocuments(),
        ]);

        const revenueAgg = await Order.aggregate([
            { $match: { paymentStatus: 'paid' } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } },
        ]);
        const totalRevenue = revenueAgg[0]?.total || 0;

        const monthlySales = await Order.aggregate([
            { $match: { paymentStatus: 'paid' } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                    total: { $sum: '$totalPrice' },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
            { $project: { month: '$_id', total: 1, count: 1, _id: 0 } },
        ]);

        const ordersByStatus = await Order.aggregate([
            { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
        ]);

        res.json({ totalUsers, totalProducts, totalOrders, totalRevenue, monthlySales, ordersByStatus });
    } catch (err) { next(err); }
};

// GET /api/admin/users
exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password').sort('-createdAt');
        res.json(users);
    } catch (err) { next(err); }
};

// PUT /api/admin/users/:id
exports.updateUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) { next(err); }
};

// DELETE /api/admin/users/:id
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted' });
    } catch (err) { next(err); }
};

// GET /api/admin/orders
exports.getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find().populate('user', 'name email').sort('-createdAt');
        res.json(orders);
    } catch (err) { next(err); }
};
