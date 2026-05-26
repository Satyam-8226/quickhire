// Centralized error handler middleware
// Send consistent JSON responses for errors across the API

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Server Error';
  let details = {};

  console.error('===== ERROR HANDLER =====');
  console.error('Name:', err.name);
  console.error('Message:', err.message);
  console.error('StatusCode:', statusCode);

  // Invalid MongoDB ObjectId
  if (err.name === 'CastError') {
    message = 'Resource not found';
    statusCode = 404;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    details = Object.keys(err.errors).reduce((acc, field) => {
      acc[field] = err.errors[field].message;
      return acc;
    }, {});
    console.error('Validation Details:', details);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value';
    const field = Object.keys(err.keyValue)[0];
    details = { field, value: err.keyValue[field] };
    console.error('Duplicate Key:', details);
  }

  console.error('===== END ERROR HANDLER =====');

  res.status(statusCode).json({
    success: false,
    message,
    ...(Object.keys(details).length > 0 && { details }),
    ...(process.env.NODE_ENV !== 'production' && {
      stack: err.stack,
    }),
  });
};

export default errorHandler;