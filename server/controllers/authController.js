const User = require("../models/User");
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
module.exports = { registerUser, loginUser };
