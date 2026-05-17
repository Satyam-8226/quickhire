// Centralized error handler middleware
// Send consistent JSON responses for errors across the API

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    success: false,
    message: err.message || "Server Error",
    // Include stack in non-production for easier debugging
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};

export default errorHandler;
