// Basic request validators for auth routes
// These are beginner-friendly, dependency-free checks.

const isEmail = (value) => /\S+@\S+\.\S+/.test(value);

export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    errors.push("Name is required and should be at least 2 characters");
  }
  if (!email || !isEmail(email)) {
    errors.push("Valid email is required");
  }
  if (!password || typeof password !== "string" || password.length < 6) {
    errors.push("Password is required and should be at least 6 characters");
  }

  if (errors.length) {
    return res.status(400).json({ success: false, errors });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email) errors.push("Email is required");
  if (!password) errors.push("Password is required");

  if (errors.length) return res.status(400).json({ success: false, errors });

  next();
};
