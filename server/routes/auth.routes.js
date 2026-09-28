const express = require("express");

const authController = require("../controllers/auth.controller");
const protect = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");

const { authRateLimiter } = require("../middleware/authRateLimit.middleware");

const { registerSchema, loginSchema } = require("../validators/auth.validator");

const router = express.Router();

router.post(
  "/register",
  authRateLimiter,
  validate(registerSchema),
  authController.register,
);

router.post(
  "/login",
  authRateLimiter,
  validate(loginSchema),
  authController.login,
);

router.post("/logout", authController.logout);

router.get("/me", protect, authController.getMe);

module.exports = router;
