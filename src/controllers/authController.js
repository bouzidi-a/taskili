const User = require("../models/user");
const generateToken = require("../utils/generateToken");

// Register
const register = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword, role } = req.body;
    // exist user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }
    // password and confirm password do not match
    if (password !== confirmPassword)
      return res.status(400).json({ error: "Passwords do not match!" });
    // creating user
    const user = await User.create({ fullName, email, password, role });
    // generate new user token
    const token = generateToken(user._id);
    // send the respose back
    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ Status: "failed", message: err.message });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(404).json({ message: "Invalid email or password" });
    }
    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ status: "Failed", message: err.message });
  }
};
const oauthCallback = (req, res) => {
  const token = generateToken(req.user._id);

  // Redirect to your frontend with the token in the URL
  res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);
};

module.exports = { register, login, oauthCallback };
