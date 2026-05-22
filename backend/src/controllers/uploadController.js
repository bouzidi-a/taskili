const User = require('../models/user');
const Profile = require('../models/Profile');
const { deleteFromCloudinary } = require('../config/cloudinary');

// ─── Upload Avatar ────────────────────────────────────────
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    // ✅ Cloudinary returns the URL in req.file.path
    const avatarUrl = req.file.path;

    // Delete old avatar from Cloudinary if exists
    const user = await User.findById(req.user._id);
    if (user.avatar) {
      await deleteFromCloudinary(user.avatar, 'image');
    }

    // Save new avatar URL to user
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

    // ✅ Cloudinary returns the URL in req.file.path
    const fileUrl = req.file.path;

    res.status(200).json({ message: 'File uploaded successfully', fileUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.uploadCV = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' })
    const fileUrl = req.file.path
    res.status(200).json({ message: 'CV uploaded successfully', fileUrl })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
};
