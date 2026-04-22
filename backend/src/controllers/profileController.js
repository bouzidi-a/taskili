const Profile = require('../models/Profile');

// ─── Get my profile ───────────────────────────────────────
exports.getMyProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id })
      .populate('user', 'fullName avatar email role');

    if (!profile) {
      // Auto-create empty profile on first visit
      profile = await Profile.create({ user: req.user._id });
      await profile.populate('user', 'fullName avatar email role');
    }

    res.status(200).json({ profile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Get profile by user ID (public) ─────────────────────
exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.userId })
      .populate('user', 'fullName avatar role');

    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    res.status(200).json({ profile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Update my profile ────────────────────────────────────
exports.updateMyProfile = async (req, res) => {
  try {
    const allowed = ['bio', 'skills', 'portfolio', 'hourlyRate', 'location', 'website', 'social'];
    const updates = {};
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      updates,
      { new: true, upsert: true, runValidators: true }
    ).populate('user', 'fullName avatar email role');

    res.status(200).json({ message: 'Profile updated', profile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Add portfolio item ───────────────────────────────────
exports.addPortfolioItem = async (req, res) => {
  try {
    const { title, description, link } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $push: { portfolio: { title, description, link } } },
      { new: true, upsert: true }
    );

    res.status(201).json({ message: 'Portfolio item added', portfolio: profile.portfolio });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Delete portfolio item ────────────────────────────────
exports.deletePortfolioItem = async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { portfolio: { _id: req.params.itemId } } },
      { new: true }
    );

    res.status(200).json({ message: 'Portfolio item deleted', portfolio: profile.portfolio });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};