const User = require('../models/user');
const Profile = require('../models/Profile');

// ─── Upload Avatar ────────────────────────────────────────
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    // Save to user
    await User.findByIdAndUpdate(req.user._id, { avatar: avatarUrl });

    res.status(200).json({ message: 'Avatar uploaded successfully', avatar: avatarUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Upload Portfolio File ────────────────────────────────
exports.uploadPortfolioFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const fileUrl = `/uploads/portfolio/${req.file.filename}`;

    res.status(200).json({ message: 'File uploaded successfully', fileUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};