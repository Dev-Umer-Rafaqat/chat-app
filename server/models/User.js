const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    loginFailedAttempts: {
      type: Number,
      default: 0,
    },

    loginLockLevel: {
      type: Number,
      default: 0,
    },

    // Temporary lock expiration time.
    loginLockedUntil: {
      type: Date,
      default: null,
    },

    // Permanent account disable.
    accountDisabled: {
      type: Boolean,
      default: false,
    },

    verificationRequired: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
