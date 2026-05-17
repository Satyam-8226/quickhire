// Role-based authorization middleware foundation
// Usage: authorizeRoles('recruiter', 'admin')
const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    res.status(401);
    return next(new Error("Not authenticated"));
  }

  if (!allowedRoles.includes(req.user.role)) {
    res.status(403);
    return next(new Error("Forbidden: insufficient role"));
  }

  next();
};

export default authorizeRoles;
