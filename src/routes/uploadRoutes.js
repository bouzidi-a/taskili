const express = require('express');
const router = express.Router();
const { uploadAvatar, uploadPortfolioFile } = require('../controllers/uploadController');
const { protect } = require('../middlewares/auth');
const { avatarUpload, portfolioUpload } = require('../config/multer');

router.post('/avatar',    protect, avatarUpload.single('avatar'),       uploadAvatar);
router.post('/portfolio', protect, portfolioUpload.single('file'),  uploadPortfolioFile);

module.exports = router;