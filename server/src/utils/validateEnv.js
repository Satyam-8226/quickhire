// Basic environment validation
// Ensures required environment variables are present at startup

const validateEnv = () => {
  const required = ["JWT_SECRET", "MONGO_URI"];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    throw new Error(`Missing environment variables: ${missing.join(", ")}`);
  }
};

export default validateEnv;
