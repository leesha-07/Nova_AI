const User = require("../models/User");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const registerUser = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  if (confirmPassword !== password) {
    return res.status(400).json({ message: "Password doesn't match" });
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "This User already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ name, email, password: hashedPassword });
  res.status(201).json({ message: "New User Created Successfully" });
};
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const existUser = await User.findOne({ email });
  if (!existUser) {
    return res.status(400).json({ message: "Invalid email or password" });
  }
  const isPasswordCorrect = await bcrypt.compare(password, existUser.password);
  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Password Doesn't Match" });
  }
  return res
    .status(200)
    .json({ message: "Password  Match", userId: existUser._id });
};
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      message: "User with this email was not found",
    });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  user.resetToken = resetToken;
  user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;

  await user.save();

  res.status(200).json({
    message: "Reset token generated successfully",
    resetToken,
  });
};

const resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;

  if (!resetToken || !newPassword) {
    return res.status(400).json({
      message: "Reset token and new password are required",
    });
  }

  const user = await User.findOne({
    resetToken,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      message: "Invalid or expired reset token",
    });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;
  user.resetToken = null;
  user.resetTokenExpiry = null;

  await user.save();

  res.status(200).json({
    message: "Password reset successfully",
  });
};
const changePassword = async (req, res) => {
  const { userId } = req.params;
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      message: "New password doesn't match",
    });
  }

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const isPasswordCorrect = await bcrypt.compare(
    currentPassword,
    user.password,
  );

  if (!isPasswordCorrect) {
    return res.status(400).json({
      message: "Current password is incorrect",
    });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;

  await user.save();

  res.status(200).json({
    message: "Password changed successfully",
  });
};
module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  changePassword,
};
