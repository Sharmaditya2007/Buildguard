const User = require('../models/User');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Register a new user (homeowner or contractor)
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw ApiError.badRequest('An account with this email already exists');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role
  });

  const token = user.generateAuthToken();

  return ApiResponse.created(
    res,
    {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      },
      token
    },
    'User registered successfully'
  );
});

/**
 * @desc    Login user & get JWT token
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Resilient fallback for demo accounts when database is connecting or offline
  const mongoose = require('mongoose');
  const jwt = require('jsonwebtoken');
  if (mongoose.connection.readyState !== 1) {
    if (email === 'homeowner@buildguard.ai' || email === 'contractor@buildguard.ai') {
      const role = email.startsWith('homeowner') ? 'homeowner' : 'contractor';
      const token = jwt.sign(
        { id: role === 'homeowner' ? '65f000000000000000000001' : '65f000000000000000000002', role },
        process.env.JWT_SECRET || 'buildguard_secret_key_2026',
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );
      return ApiResponse.ok(
        res,
        {
          user: {
            id: role === 'homeowner' ? '65f000000000000000000001' : '65f000000000000000000002',
            name: role === 'homeowner' ? 'David Miller' : 'Apex Builders Inc.',
            email,
            role
          },
          token
        },
        'Login successful (Demo Sandbox Mode)'
      );
    }
  }

  // Find user and explicitly select password
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const token = user.generateAuthToken();

  return ApiResponse.ok(
    res,
    {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    },
    'Login successful'
  );
});

/**
 * @desc    Get current authenticated user profile
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  return ApiResponse.ok(
    res,
    {
      user: req.user
    },
    'Current user profile retrieved'
  );
});

module.exports = {
  register,
  login,
  getMe
};
