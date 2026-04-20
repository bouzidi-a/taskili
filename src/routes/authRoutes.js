const express = require('express');
const router = express.Router();
const { register, login , oauthCallback} = require('../controllers/authController');
const passport = require('passport');

router.post('/register', register);
router.post('/login', login);
// Google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false,
}));
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  oauthCallback
);

// Facebook
router.get('/facebook', passport.authenticate('facebook', {
  scope: ['public_profile','email'],
  session: false,
}));
router.get('/facebook/callback',
  passport.authenticate('facebook', { session: false, failureRedirect: '/login' }),
  oauthCallback
);

module.exports = router;