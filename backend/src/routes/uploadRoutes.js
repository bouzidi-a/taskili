const express = require('express');
const router = express.Router();
const { uploadAvatar, uploadPortfolioFile } = require('../controllers/uploadController');
const { protect } = require('../middlewares/auth');
const { uploadAvatar: avatarUpload, uploadPortfolio: portfolioUpload } = require('../config/cloudinary');

// ✅ Using Cloudinary multer instances directly
router.post('/avatar',    protect, avatarUpload,    uploadAvatar);
router.post('/portfolio', protect, portfolioUpload, uploadPortfolioFile);

module.exports = router;