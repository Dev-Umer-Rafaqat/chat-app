const asyncHandler = require("../utils/asyncHandler");
const userService = require("../services/user.service");

const getUsers = asyncHandler(async (req, res) => {
  const users = await userService.getAllUsers(req.user._id);
  res.status(200).json({ success: true, data: users });
});

const getUser = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  res.status(200).json({ success: true, data: user });
});

module.exports = { getUsers, getUser };
