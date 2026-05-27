import { isEmail, isEmpty } from "./commonValidators.js";

export const validateRegister = (req, res, next) => {
  const { name, email, password, role } = req.body;

  const errors = [];

  if (isEmpty(name) || name.trim().length < 2) {
    errors.push("Name should be at least 2 characters");
  }

  if (!isEmail(email)) {
    errors.push("Valid email is required");
  }

  if (isEmpty(password) || password.length < 6) {
    errors.push("Password should be at least 6 characters");
  }

  if (role && !["candidate", "recruiter", "admin"].includes(role)) {
    errors.push("Invalid role");
  }

  if (errors.length) {
    return res.status(400).json({
      success: false,
      errors,
    });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  const errors = [];

  if (!isEmail(email)) {
    errors.push("Valid email is required");
  }

  if (isEmpty(password)) {
    errors.push("Password is required");
  }

  if (errors.length) {
    return res.status(400).json({
      success: false,
      errors,
    });
  }

  next();
};