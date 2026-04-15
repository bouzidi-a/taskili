const { supabase } = require('../lib/supabaseClient');
const User = require('../models/user');

const verifyToken = async (req, res, next) => {
  try {
    // 1. Keep your original header name (auth-token)
    const token = req.header('auth-token');

    if (!token)
      return res.status(401).json({ error: 'Access Denied! No token provided.' });

    // 2. Verify with Supabase (replaces jwt.verify())
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user)
      return res.status(400).json({ error: 'Invalid Token!' });

    // 3. Fetch MongoDB user using supabase id
    const user = await User.findOne({ supabaseId: data.user.id });

    if (!user)
      return res.status(404).json({ error: 'User profile not found' });

    // 4. Attach to req.user (same shape your routes already expect)
    req.user = {
      id: user._id,
      supabaseId: data.user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    };

    next();

  } catch (err) {
    res.status(500).json({ error: 'Authentication error' });
  }
};

module.exports = verifyToken;