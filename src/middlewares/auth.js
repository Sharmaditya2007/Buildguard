const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Middleware to verify JWT token and authenticate user
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw ApiError.unauthorized('Not authorized. No Bearer token provided');
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'buildguard_default_secret_key'
    );

    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        throw ApiError.unauthorized('The user belonging to this token no longer exists');
      }
      req.user = user;
    } else {
      // In development/test mode without active DB connection, hydrate user from verified token
      req.user = {
        _id: decoded.id,
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        name: decoded.name
      };
    }

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      throw ApiError.unauthorized('Invalid or expired authentication token');
    }
    throw error;
  }
});

/**
 * Role-Based Access Control (RBAC) middleware
 * @param  {...string} roles Allowed roles ('contractor', 'homeowner')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw ApiError.forbidden(
        `User role '${req.user ? req.user.role : 'anonymous'}' is not authorized to access this resource`
      );
    }
    next();
  };
};

// Convenient contractor-only shortcut
const contractorOnly = authorize('contractor');

// Convenient homeowner-only shortcut
const homeownerOnly = authorize('homeowner');

module.exports = {
  protect,
  authorize,
  contractorOnly,
  homeownerOnly
};
