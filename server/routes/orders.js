const router = require('express').Router();
const { createOrder, getMyOrders, getOrder, updateOrderStatus } = require('../controllers/orderController');
const { verifyToken, isAdmin } = require('../middleware/auth');
const { validateOrder } = require('../middleware/validate');

router.post('/', verifyToken, validateOrder, createOrder);
router.get('/me', verifyToken, getMyOrders);
router.get('/:id', verifyToken, getOrder);
router.put('/:id/status', verifyToken, isAdmin, updateOrderStatus);

module.exports = router;
