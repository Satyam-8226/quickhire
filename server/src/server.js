import dotenv from "dotenv";
import connectDB from "./config/db.js";
import validateEnv from "./utils/validateEnv.js";
import app from "./app.js";
import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorMiddleware.js";

// Load env early
dotenv.config();

// Basic env validation
validateEnv();

// Connect to DB
connectDB();

// 404 handler (for unknown routes)
app.use(notFound);

// Centralized error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
