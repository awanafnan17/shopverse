const { body, validationResult } = require('express-validator');

const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    }
    next();
};

const validateRegister = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    handleValidation,
];

const validateLogin = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    handleValidation,
];

const validateProduct = [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
    handleValidation,
];

const validateOrder = [
    body('orderItems').isArray({ min: 1 }).withMessage('At least one order item is required'),
    body('shippingAddress.fullName').notEmpty().withMessage('Full name is required'),
    body('shippingAddress.street').notEmpty().withMessage('Street is required'),
    body('shippingAddress.city').notEmpty().withMessage('City is required'),
    body('shippingAddress.state').notEmpty().withMessage('State is required'),
    body('shippingAddress.zipCode').notEmpty().withMessage('Zip code is required'),
    body('shippingAddress.country').notEmpty().withMessage('Country is required'),
    body('paymentMethod').isIn(['stripe', 'cod']).withMessage('Valid payment method required'),
    handleValidation,
];

module.exports = { validateRegister, validateLogin, validateProduct, validateOrder };
