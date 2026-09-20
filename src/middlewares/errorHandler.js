const ApiError = require('../utils/apiError');

/**
 * 404 Not Found Middleware
 */
const notFoundHandler = (req, res, next) => {
  next(ApiError.notFound(`Endpoint not found: [${req.method}] ${req.originalUrl}`));
};

/**
 * Global Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = err;

  // If error is not an instance of ApiError, normalize it
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || (error.name === 'ValidationError' ? 400 : 500);
    const message = error.message || 'An unexpected error occurred';
    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    error = ApiError.badRequest(`Invalid resource identifier: ${err.value}`);
  }

  // Handle Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    error = ApiError.badRequest(`Duplicate field value entered for '${field}'. Please use another value.`);
  }

  // Handle Mongoose Validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    error = ApiError.badRequest('Database validation error', messages);
  }

  // Handle Multer file upload errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      error = ApiError.badRequest('File size exceeds the allowed 10MB limit');
    } else {
      error = ApiError.badRequest(`File upload error: ${err.message}`);
    }
  }

  const response = {
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors || []
  };

  // Include stack trace only in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = error.stack;
  }

  res.status(error.statusCode).json(response);
};

module.exports = {
  notFoundHandler,
  errorHandler
};
