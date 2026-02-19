const router = require('express').Router();
const { getCategories, getCategory, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/', getCategories);
router.get('/:id', getCategory);
router.post('/', verifyToken, isAdmin, createCategory);
router.put('/:id', verifyToken, isAdmin, updateCategory);
router.delete('/:id', verifyToken, isAdmin, deleteCategory);

module.exports = router;
