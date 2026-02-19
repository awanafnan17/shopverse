const router = require('express').Router();
const { register, login, getMe, updateProfile } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');
const { validateRegister, validateLogin } = require('../middleware/validate');

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/me', verifyToken, getMe);
router.put('/profile', verifyToken, updateProfile);

module.exports = router;
