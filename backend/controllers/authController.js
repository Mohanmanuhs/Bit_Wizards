const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// @desc Register a new user
// @route POST /api/auth/register
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, clubId } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'student',
            clubId: clubId || null,
        });

        const token = generateToken(user);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // send over HTTPS in production
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        res.status(201).json({ user, token });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Registration failed' });
    }
};

// @desc Login user
// @route POST /api/auth/login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = generateToken(user);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // send over HTTPS in production
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        res.status(200) .json({ user, token });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Login failed' });
    }
};

// @desc Logout user (on frontend just delete token)
// @route POST /api/auth/logout
const logoutUser = async (req, res) => {
    try {
        // On client, remove token. If using cookie:
        res.clearCookie('token');
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Logout failed' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
};