// Centralized error handler middleware
// Send consistent JSON responses for errors across the API

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;

  let message = err.message || 'Server Error';

  // Invalid MongoDB ObjectId
  if (err.name === 'CastError') {
    message = 'Resource not found';
    statusCode = 404;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && {
      stack: err.stack,
    }),
  });
  };

export default errorHandler;