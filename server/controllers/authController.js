const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Password strength validation
const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push('at least 8 characters');
    if (!/[A-Z]/.test(password)) errors.push('an uppercase letter');
    if (!/[a-z]/.test(password)) errors.push('a lowercase letter');
    if (!/[0-9]/.test(password)) errors.push('a digit');
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password)) errors.push('a special character');
    return errors;
};

// POST /api/auth/register
exports.register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Validate password strength
        const pwErrors = validatePassword(password);
        if (pwErrors.length > 0) {
            return res.status(400).json({ message: `Password must contain ${pwErrors.join(', ')}` });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const user = await User.create({ name, email, password });
        const token = generateToken(user);

        res.status(201).json({
            token,
            user: { _id: user._id, name: user.name, email: user.email, role: user.role },
        });
    } catch (err) { next(err); }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = generateToken(user);
        res.json({
            token,
            user: { _id: user._id, name: user.name, email: user.email, role: user.role },
        });
    } catch (err) { next(err); }
};

// GET /api/auth/me
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) { next(err); }
};

// PUT /api/auth/profile
exports.updateProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.name = req.body.name || user.name;
        if (req.body.phone !== undefined) user.phone = req.body.phone;
        if (req.body.address) user.address = req.body.address;

        await user.save();
        res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, address: user.address });
    } catch (err) { next(err); }
};
