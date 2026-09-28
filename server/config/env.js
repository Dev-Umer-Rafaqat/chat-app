require("dotenv/config");

const env = {
  PORT: process.env.PORT || 5000,

  MONGO_URI: process.env.MONGO_URI,

  JWT_SECRET: process.env.JWT_SECRET,

  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",

  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",

  NODE_ENV: process.env.NODE_ENV || "development",

  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,

  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,

  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
};

const requiredVars = [
  "MONGO_URI",
  "JWT_SECRET",

  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY",
];

for (const key of requiredVars) {
  if (!env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

module.exports = env;
