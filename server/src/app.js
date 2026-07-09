import express from "express";
import cors from "cors";

import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";

import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import externalApplicationRoutes from "./routes/externalApplicationRoutes.js";
import interviewRoundRoutes from "./routes/interviewRoundRoutes.js";

const app = express();


// ===============================
// CORE MIDDLEWARES
// ===============================

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((origin) => origin.trim())
  : [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:5174",
      "http://127.0.0.1:5174",
    ];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());


// ===============================
// SECURITY MIDDLEWARES
// ===============================

// Secure HTTP headers
app.use(helmet());

// Prevent MongoDB injection attacks
// app.use(
//   mongoSanitize({
//     replaceWith: "_",
//   })
// );

// Prevent HTTP parameter pollution
app.use(hpp());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    message: "Too many requests, please try again later",
  },
});

app.use(limiter);


// ===============================
// HEALTH CHECK ROUTE
// ===============================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "QuickHire AI API is running",
  });
});


// ===============================
// API ROUTES
// ===============================

app.use("/api/auth", authRoutes);

app.use("/api/jobs", jobRoutes);

app.use("/api/applications", applicationRoutes);

app.use("/api/external-applications", externalApplicationRoutes);

app.use("/api", interviewRoundRoutes);


export default app;