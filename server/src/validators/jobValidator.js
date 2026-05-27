import { isEmpty } from "./commonValidators.js";

export const validateJob = (req, res, next) => {
  const {
    title,
    company,
    location,
    jobType,
    salary,
    description,
    requirements,
  } = req.body;

  const errors = [];

  if (isEmpty(title)) errors.push("Job title is required");

  if (isEmpty(company)) errors.push("Company name is required");

  if (isEmpty(location)) errors.push("Location is required");

  if (isEmpty(jobType)) errors.push("Job type is required");

  if (isEmpty(salary)) errors.push("Salary is required");

  if (isEmpty(description)) errors.push("Description is required");

  if (!Array.isArray(requirements) || requirements.length === 0) {
    errors.push("Requirements must be a non-empty array");
  }

  if (errors.length) {
    return res.status(400).json({
      success: false,
      errors,
    });
  }

  next();
};