const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { Strategy: FacebookStrategy } = require('passport-facebook');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// ─── Local ────────────────────────────────────────────────
passport.use(new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email }).select('+password');
      if (!user) return done(null, false, { message: 'No user with that email' });
      const isMatch = await user.comparePassword(password);
      if (!isMatch) return done(null, false, { message: 'Wrong password' });
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// ─── JWT ──────────────────────────────────────────────────
passport.use(new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  },
  async (payload, done) => {
    try {
      const user = await User.findById(payload.id).select('-password');
      if (!user) return done(null, false);
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// ─── Google ───────────────────────────────────────────────
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback',
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists with this googleId
      let user = await User.findOne({ googleId: profile.id });

      if (!user) {
        // Check if email already registered (link accounts)
        user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // Link Google to existing account
          user.googleId = profile.id;
          user.avatar = user.avatar || profile.photos[0].value;
          await user.save();
        } else {
          // Create brand new user
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
          });
        }
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));
// ─── Facebook ─────────────────────────────────────────────
passport.use(new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: '/api/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'emails', 'photos'],
     enableProof: true
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ facebookId: profile.id });

      if (!user) {
        const email = profile.emails?.[0]?.value;
        user = email ? await User.findOne({ email }) : null;

        if (user) {
          user.facebookId = profile.id;
          user.avatar = user.avatar || profile.photos?.[0]?.value;
          await user.save();
        } else {
          user = await User.create({
            facebookId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0]?.value,
            avatar: profile.photos?.[0]?.value,
          });
        }
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

module.exports = passport;