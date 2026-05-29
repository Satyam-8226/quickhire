// Centralized error handler middleware
// Send consistent JSON responses for errors across the API

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Server Error';
  let details = {};

  console.error('===== ERROR HANDLER =====');
  console.error('Method:', req.method);
  console.error('URL:', req.originalUrl);
  console.error('Params:', JSON.stringify(req.params));
  console.error('Body:', JSON.stringify(req.body));
  console.error('User:', req.user ? {
    id: req.user._id,
    email: req.user.email,
    role: req.user.role,
  } : null);
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

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
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