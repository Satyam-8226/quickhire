import express from "express";
import { registerUser, loginUser, getMe } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validateRegister, validateLogin } from "../validators/authValidator.js";

const router = express.Router();

// Public
router.post(
  "/register",
  validateRegister,
  registerUser
);

router.post(
  "/login",
  validateLogin,
  loginUser
);
// Protected
router.get("/me", protect, getMe);

export default router;