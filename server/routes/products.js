const router = require('express').Router();
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct, uploadImages } = require('../controllers/productController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', verifyToken, isAdmin, uploadImages, createProduct);
router.put('/:id', verifyToken, isAdmin, uploadImages, updateProduct);
router.delete('/:id', verifyToken, isAdmin, deleteProduct);

module.exports = router;
