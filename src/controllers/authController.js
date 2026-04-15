const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { supabase } = require('../lib/supabaseClient');

// ─── REGISTER ────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword, role } = req.body;

    // Basic validations (keep yours)
    if (password !== confirmPassword)
      return res.status(400).json({ error: 'Passwords do not match!' });

    if (password.length < 8)
      return res.status(400).json({ error: 'Password must be at least 8 characters' });

    // 1. Create user in Supabase (handles hashing + confirmation email)
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error)
      return res.status(400).json({ error: error.message });

    // 2. Store extra fields in MongoDB, linked by Supabase user id
    const newUser = await User.create({
      supabaseId: data.user.id,   // ← link to Supabase
      fullName,
      email,
      role: role || 'freelancer',
      // NO password field anymore — Supabase owns it
    });

    return res.status(201).json({
      message: 'Registration successful! Please check your email to confirm your account.',
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt,
      },
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── LOGIN ────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Supabase checks credentials + email confirmed
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error)
      return res.status(400).json({ error: error.message });
    // if email not confirmed, Supabase returns:
    // "Email not confirmed" automatically ✅

    // 2. Fetch extra fields from MongoDB using supabase user id
    const user = await User.findOne({ supabaseId: data.user.id });

    if (!user)
      return res.status(404).json({ error: 'User profile not found' });

    return res.status(200).json({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
};

module.exports = { register, login };