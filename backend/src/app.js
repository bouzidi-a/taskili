const express      = require('express');
const cors         = require('cors');
const path         = require('path');
const helmet       = require('helmet');
const rateLimit    = require('express-rate-limit');
const swaggerUi   = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const authRoutes         = require('./routes/authRoutes');
const workRoutes         = require('./routes/workRoutes');
const userRoutes         = require('./routes/userRoutes');
const statsRoutes        = require('./routes/statsRoutes');
const profileRoutes      = require('./routes/profileRoutes');
const uploadRoutes       = require('./routes/uploadRoutes');
const reviewRoutes       = require('./routes/reviewRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const chatRoutes         = require('./routes/chatRoutes');
const errorHandler       = require('./middlewares/errorHandler');
const passport           = require('./config/passport');

const app = express();

// ─── Security Headers ─────────────────────────────────────
app.use(helmet());

// ─── CORS ─────────────────────────────────────────────────
app.use(cors({
  origin:      process.env.CLIENT_URL || '*',
  methods:     ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
}));

// ─── Rate Limiting ────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max:      100,             // max 100 requests per IP
  message:  { message: 'Too many requests, please try again later' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max:      10,              // max 10 login/register attempts
  message:  { message: 'Too many auth attempts, please try again later' },
});

app.use(globalLimiter);

// ─── Body Parser ──────────────────────────────────────────
app.use(express.json({ limit: '10kb' })); // limit body size
app.use(express.urlencoded({ extended: true, limit: '10kb' }));




// ─── Static Files ─────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ─── Passport ─────────────────────────────────────────────
app.use(passport.initialize());

// ─── Routes ───────────────────────────────────────────────
app.use('/api/auth',          authLimiter, authRoutes);
app.use('/api/works',         workRoutes);
app.use('/api/users',         userRoutes);
app.use('/api/stats',         statsRoutes);
app.use('/api/profiles',      profileRoutes);
app.use('/api/upload',        uploadRoutes);
app.use('/api/reviews',       reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/chat',          chatRoutes);
// ─── API Docs ─────────────────────────────────────────────
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ─── Global Error Handler ─────────────────────────────────
app.use(errorHandler);

module.exports = app;