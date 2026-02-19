const router = require('express').Router();
const { getStats, getUsers, updateUser, deleteUser, getAllOrders } = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.use(verifyToken, isAdmin);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/orders', getAllOrders);

module.exports = router;
