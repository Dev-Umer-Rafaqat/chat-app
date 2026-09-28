const User = require("../models/User");
const AppError = require("../utils/AppError");

async function getAllUsers(excludeUserId) {
  // Exclude the currently logged-in user — you don't message yourself
  return User.find({ _id: { $ne: excludeUserId } }).select(
    "name email createdAt",
  );
}

async function getUserById(id) {
  const user = await User.findById(id).select("name email createdAt");
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
}

module.exports = { getAllUsers, getUserById };
