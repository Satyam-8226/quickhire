import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoute.js";

const app = express();

// Global middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Simple health check
app.get("/", (req, res) => {
  res.json({ success: true, message: "QuickHire AI API is running" });
});

export default app;