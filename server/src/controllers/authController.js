import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import generateToken from "../utils/generateToken.js";
import ErrorResponse from "../utils/errorResponse.js";

// Register a new user
// - Validates uniqueness, hashes password, returns token + user info
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role = "candidate" } = req.body;

  // Check existing user
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new ErrorResponse("User already exists", 400);
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  // Respond with token and basic user info
  res.status(201).json({
    success: true,
    token: generateToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      resume: user.resume || '',
      currentResume: user.currentResume || null,
    },
  });
});

// Login existing user
// - Verifies credentials and returns token + user info
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(401);
    throw new ErrorResponse("Invalid credentials", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401);
    throw new ErrorResponse("Invalid credentials", 401);
  }

  res.status(200).json({
    success: true,
    token: generateToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      resume: user.resume || '',
      currentResume: user.currentResume || null,
    },
  });
});

// Get current user (protected route)
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

export { registerUser, loginUser, getMe };