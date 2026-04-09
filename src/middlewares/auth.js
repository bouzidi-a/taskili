const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/jwt');

const verifyToken = (req, res, next) => {
  const token = req.header('auth-token');
  if (!token)
    return res.status(401).json({ error: 'Access Denied! No token provided.' });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid Token!' });
  }
};

module.exports = verifyToken;