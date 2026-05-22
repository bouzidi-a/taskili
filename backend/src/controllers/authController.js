const User = require("../models/user");
const generateToken = require("../utils/generateToken");
const sendVerificationEmail = require("../utils/sendEmail");

const register = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match!" });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.create({
      fullName,
      email,
      password,
      role,
      verificationCode: code,
      verificationCodeExpiry: expiry,
      isVerified: false,
    });

    await sendVerificationEmail(email, fullName, code);

    return res.status(201).json({
      message: "Registration successful. Please check your email for the verification code.",
      userId: user._id,
    });
  } catch (err) {
    res.status(500).json({ status: "failed", message: err.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { userId, code } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    if (user.verificationCodeExpiry < Date.now()) {
      return res.status(400).json({ message: "Code expired. Please register again." });
    }

    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpiry = null;
    await user.save();

    const token = generateToken(user._id);

    return res.status(200).json({
      message: "Email verified successfully!",
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
    res.status(500).json({ status: "failed", message: err.message });
  }
};

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
  res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);
};

module.exports = { register, verifyEmail, login, oauthCallback };
