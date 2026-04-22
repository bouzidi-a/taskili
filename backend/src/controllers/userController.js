const User = require("../models/user");

// ─── Get My User Info ─────────────────────────────────────
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

// ─── Update My User Info ──────────────────────────────────
const updateMe = async (req, res) => {
  try {
    // ✅ Only allow safe fields to be updated
    const allowed = ["fullName", "phoneNumber", "avatar"];
    const updates = {};
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};

// ─── Delete My Account ────────────────────────────────────
const deleteMe = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};

module.exports = { getMe, updateMe, deleteMe };