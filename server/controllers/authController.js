const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @desc    Login admin
// @route   POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const token = generateToken(user._id);

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.json({
    success: true,
    user: { id: user._id, email: user.email, role: user.role },
    token,
  });
});

// @desc    Get current user
// @route   GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ success: true, user });
});

// @desc    Logout
// @route   POST /api/auth/logout
const logout = asyncHandler(async (req, res) => {
  res.cookie('token', '', { maxAge: 0, httpOnly: true });
  res.json({ success: true, message: 'Logged out' });
});

// @desc    Register admin (one-time use / protected by secret)
// @route   POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { email, password, secret } = req.body;

  if (!process.env.ADMIN_SECRET) {
    res.status(500);
    throw new Error('Admin registration is not configured');
  }

  if (!secret) {
    res.status(403);
    throw new Error('Admin secret is required');
  }

  if (secret !== process.env.ADMIN_SECRET) {
    res.status(403);
    throw new Error('Invalid admin secret');
  }

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({ email, password, role: 'admin' });
  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    user: { id: user._id, email: user.email, role: user.role },
    token,
  });
});

module.exports = { login, getMe, logout, register };
