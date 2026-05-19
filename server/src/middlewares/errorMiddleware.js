// Centralized error handler middleware
// Send consistent JSON responses for errors across the API

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;

  let message = err.message || 'Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    stack:
      process.env.NODE_ENV === 'production'
        ? null
        : err.stack,
  });
};

export default errorHandler;